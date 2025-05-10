ATTIO MCP PROJECT GUIDE

PROJECT OVERVIEW
Purpose: GitHub workflow system for the Attio MCP project

Project Structure:
- /src/ - Core source files
- /dist/ - Distribution files
- /test/ - Test files
- /docs/ - Documentation
- /scripts/ - Utility scripts
- /build/ - Build system

DEVELOPMENT WORKFLOW

File Organization:
- Core source files: /src/
- Distribution files: /dist/
- Test files: /test/
- Documentation: /docs/
- Utility scripts: /scripts/
- Build system: /build/

Building and Testing:
# Install dependencies
npm install

# Run tests
npm test

GITHUB WORKFLOW

1. Issue Management
- Create issues before starting work using templates in .github/ISSUE_TEMPLATE/
- Use descriptive titles: type: Description (clear, concise)
- Search first: gh issue list --search "keyword" to avoid duplication

Required Labels:
- Priority Labels:
  * P0 - Critical (service down, security issue)
  * P1 - High (blocking functionality)
  * P2 - Medium (important but not blocking)
  * P3 - Low (minor improvements)
  * P4 - Trivial (cosmetic, nice-to-have)

- Type Labels:
  * bug - Incorrect functionality
  * feature - New capability
  * enhancement - Improvement to existing feature
  * documentation - Documentation updates
  * test - Test improvements

- Status Labels: (Required)
  * status:blocked - Work cannot proceed due to dependencies or blockers
  * status:in-progress - Work is currently being actively worked on
  * status:ready - Ready for implementation or review
  * status:review - Ready for or currently under review
  * status:needs-info - Requires additional information to proceed
  * status:untriaged - Not yet assessed or categorized

- Area Labels:
  * Module: area:core, area:api, area:build, area:dist
  * Content: area:documentation, area:testing, area:performance, area:refactor
  * API-specific: area:api:people, area:api:lists, area:api:notes, area:api:objects, area:api:records, area:api:tasks
  * Functional: area:extension, area:integration, area:security, area:rate-limiting, area:error-handling, area:logging

- Check available labels: gh label list (do not create new labels without approval)

2. Branch Strategy
- NEVER work directly on main except for critical hotfixes
- Create feature branches: git checkout -b feature/your-feature-name
- Use consistent prefixes: feature/, fix/, docs/, etc.

3. Commit Message Format
- ALWAYS start commit messages with one of these exact prefixes:
  Feature: <description>     # New functionality
  Fix: <description>         # Bug fixes
  Docs: <description>        # Documentation changes
  Refactor: <description>    # Code restructuring
  Test: <description>        # Test additions/modifications
  Chore: <description>       # Routine maintenance tasks
- Include issue references when applicable: #123
- For hotfixes, include [HOTFIX] in the commit message
- Case is important: use exactly as shown above
- Examples:
  Fix: Resolve API rate limiting issue #42
  Docs: Update API documentation with rate limiting details #85

4. Pull Requests
- Reference issues with Closes #XX or Relates to #XX
- Include complete testing details
- Wait for review approval before merging
- Use squash merging when possible

5. Issue Closure Requirements
When closing issues, always include:
- All acceptance criteria checked off
- Implementation comment with:
  - Implementation details
  - Key elements (3+ points)
  - Lessons learned (3+ insights)
  - Challenges/solutions
  - Future considerations
- Verification statement: "✅ VERIFICATION: I have completed all GitHub documentation requirements including: [list requirements]"

WORKFLOW ENFORCEMENT TOOLS

Available Validation Tools:
The repository is equipped with automated tools to enforce workflow requirements:

- Pre-commit hooks automatically validate branch naming and commit messages
- Issue templates provide structured formats for new issues
- Validation commands:
  # Check workflow compliance manually
  git workflow-validate
  
  # Verify issue closure requirements
  git issue-validate <ISSUE_ID>

GitHub Templates:
- Feature requests: .github/ISSUE_TEMPLATE/feature_request.md
- Bug reports: .github/ISSUE_TEMPLATE/bug_report.md

Exceptions to Normal Workflow:
Only bypass normal PR workflow for:
- Critical security vulnerabilities
- Production-breaking bugs
- Simple documentation fixes
Add [HOTFIX] to commit messages in these cases.

WORKFLOW CHECKLIST

Issue Creation Checklist:
□ Search for existing issues before creating new ones
□ Use the appropriate issue template (feature or bug)
□ Add descriptive title with proper format (type: Description)
□ Apply all required labels (Priority, Type, Area, Status)
□ Add detailed description with clear requirements
□ Add acceptance criteria as a checklist

Development Process Checklist:
□ Create a feature branch with proper naming (feature/name-of-feature)
□ Keep commits small and focused
□ Use proper commit message format (Type: Description #issue)
□ Run tests before creating a PR
□ Document implementation details throughout

Issue Closure Checklist:
□ Check off all acceptance criteria
□ Add implementation details comment with all required sections
□ Add verification statement
□ Apply final status label (status:review)
□ Reference issue in PR (Closes #XX)
□ Get review approval before merging

ADVANCED TROUBLESHOOTING TOOLS

Sequential Thinking for Complex Bugs:
For stubborn bugs and complex problems, use the Sequential Thinking MCP tool to break down the problem-solving process:

mcp_sequentialthinking(
  thought: "Initial analysis of the bug...",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
)

External Research with Brave Search:
When documentation is incomplete or you need external references:

For API/technical documentation:
```
mcp_brave_web_search(
  query: "Attio MCP API documentation",
  count: 5
)
```

For finding code examples:
```
mcp_brave_web_search(
  query: "github example implementation rate limiter",
  count: 5
)
```
