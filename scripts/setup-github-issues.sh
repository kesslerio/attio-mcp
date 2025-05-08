#!/bin/bash
# Script to set up GitHub milestones and issues for Phase 1 of the Attio MCP expansion

# Ensure gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo "GitHub CLI (gh) is not installed. Please install it from https://cli.github.com/"
  exit 1
fi

# Ensure we're authenticated
gh auth status || { echo "Please login using 'gh auth login'"; exit 1; }

# Get repo info using the gh CLI directly
REPO_INFO=$(gh repo view --json owner,name -q '.owner.login + " " + .name')
OWNER=$(echo "$REPO_INFO" | cut -d' ' -f1)
REPO=$(echo "$REPO_INFO" | cut -d' ' -f2)

if [ -z "$OWNER" ] || [ -z "$REPO" ]; then
  echo "Could not determine repository owner and name. Please ensure you're in a git repository connected to GitHub."
  exit 1
fi

echo "Repository: $OWNER/$REPO"

# Create Phase 1 milestone
echo "Creating Phase 1 milestone..."
MILESTONE_RESPONSE=$(gh api "repos/$OWNER/$REPO/milestones" -f title="Phase 1: Core Object Support" \
  -f description="Expand the MCP server to support People objects and Lists management, and improve the codebase structure." \
  -f state="open" \
  --jq '.number')

if [ $? -ne 0 ]; then
  echo "Failed to create milestone. Make sure you have appropriate permissions."
  exit 1
fi

MILESTONE_NUMBER=$MILESTONE_RESPONSE
echo "Created milestone #$MILESTONE_NUMBER"

# Create issues and add to milestone in separate steps
create_issue_and_add_to_milestone() {
  local title="$1"
  local body="$2"
  local label="$3"
  
  echo "Creating issue: $title"
  ISSUE_NUMBER=$(gh issue create --title "$title" --body "$body" --label "$label" --json number -q '.number')
  
  if [ $? -ne 0 ]; then
    echo "Failed to create issue: $title"
    return 1
  fi
  
  echo "Adding issue #$ISSUE_NUMBER to milestone #$MILESTONE_NUMBER"
  gh api -X PATCH "repos/$OWNER/$REPO/issues/$ISSUE_NUMBER" -f milestone="$MILESTONE_NUMBER"
  
  if [ $? -ne 0 ]; then
    echo "Failed to add issue #$ISSUE_NUMBER to milestone #$MILESTONE_NUMBER"
    return 1
  fi
  
  echo "Issue #$ISSUE_NUMBER created and added to milestone successfully"
}

# Create issues for Phase 1
echo "Creating issues for Phase 1..."

# Issue 1: Modularize codebase
create_issue_and_add_to_milestone \
  "Modularize the codebase" \
  "Reorganize the codebase into a modular structure for better maintainability and extensibility.

**Tasks:**
- Create directory structure (utils, api, handlers, objects)
- Move error handling to a separate utility module
- Extract API client functionality
- Create separate modules for each object type
- Update imports and references" \
  "enhancement"

# Issue 2: Implement People object support
create_issue_and_add_to_milestone \
  "Implement People object support" \
  "Add support for working with People objects in Attio.

**Tasks:**
- Update ListResourcesRequestSchema to support people resources
- Update ReadResourceRequestSchema to handle people URIs
- Add search-people tool
- Add read-person-details tool
- Add read-person-notes tool
- Add create-person-note tool
- Test all new functionality" \
  "enhancement"

# Issue 3: Implement Lists management
create_issue_and_add_to_milestone \
  "Implement Lists management" \
  "Add support for working with Lists in Attio.

**Tasks:**
- Add list-lists tool to list all lists in the workspace
- Add get-list-entries tool to get entries from a specific list
- Add add-record-to-list tool to add a record to a list
- Add remove-record-from-list tool to remove a record from a list
- Test all new functionality" \
  "enhancement"

# Issue 4: Enhance error handling
create_issue_and_add_to_milestone \
  "Enhance error handling and response formatting" \
  "Improve error handling and response formatting for better user experience.

**Tasks:**
- Standardize error response format
- Add more detailed error messages
- Implement input validation for all tools
- Handle rate limiting and network errors
- Test error scenarios" \
  "enhancement"

# Issue 5: Documentation
create_issue_and_add_to_milestone \
  "Update documentation for Phase 1 changes" \
  "Update documentation to reflect the new capabilities added in Phase 1.

**Tasks:**
- Update README.md with new features
- Document the modular structure
- Add examples for new tools
- Update installation and usage instructions" \
  "documentation"

echo "GitHub issues and milestone created successfully!"