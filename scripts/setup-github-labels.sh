#!/bin/bash
# Script to set up GitHub labels for the Attio MCP repository

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

# Function to create or update a label
create_or_update_label() {
  local name="$1"
  local color="$2"
  local description="$3"
  
  echo "Creating/updating label: $name"
  
  # Check if label exists
  if gh api "repos/$OWNER/$REPO/labels" --jq ".[] | select(.name == \"$name\") | .name" | grep -q "$name"; then
    # Update existing label
    gh api --method PATCH "repos/$OWNER/$REPO/labels/$name" \
      -f name="$name" \
      -f color="$color" \
      -f description="$description"
  else
    # Create new label
    gh api --method POST "repos/$OWNER/$REPO/labels" \
      -f name="$name" \
      -f color="$color" \
      -f description="$description"
  fi
}

echo "Setting up labels..."

# Type Labels
create_or_update_label "bug" "d73a4a" "Something isn't working as expected"
create_or_update_label "enhancement" "a2eeef" "New feature or improvement to existing functionality"
create_or_update_label "documentation" "0075ca" "Documentation-related changes"
create_or_update_label "refactor" "6666ff" "Code changes that neither fix a bug nor add a feature"
create_or_update_label "test" "cccccc" "Adding or modifying tests"

# Priority Labels
create_or_update_label "P0" "b60205" "Critical - requires immediate attention"
create_or_update_label "P1" "d93f0b" "High - should be addressed in current sprint"
create_or_update_label "P2" "fbca04" "Medium - important but not urgent"
create_or_update_label "P3" "c2e0c6" "Low - nice to have"
create_or_update_label "P4" "e6e6e6" "Trivial - can be addressed later"

# Status Labels
create_or_update_label "status:ready" "0e8a16" "Ready to be worked on"
create_or_update_label "status:in-progress" "fbca04" "Currently being worked on"
create_or_update_label "status:blocked" "d93f0b" "Blocked by another issue or external factor"
create_or_update_label "status:review" "bfdadc" "Ready for review"
create_or_update_label "status:needs-info" "c5def5" "Needs more information"

# Area Labels
create_or_update_label "area:api" "1d76db" "API-related changes"
create_or_update_label "area:core" "5319e7" "Core functionality"
create_or_update_label "area:tools" "006b75" "Tool handling"
create_or_update_label "area:resources" "0052cc" "Resource handling"
create_or_update_label "area:error-handling" "b4a8d1" "Error handling improvements"
create_or_update_label "area:configuration" "d4c5f9" "Configuration-related changes"
create_or_update_label "area:performance" "fef2c0" "Performance improvements"

echo "Labels set up successfully!"