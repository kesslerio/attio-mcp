IMPORTANT ATTRIBUTION RULES
- NEVER include "Generated with Claude Code" or similar messages in any code, commits, or PRs
- NEVER add "Co-Authored-By: Claude" or other AI assistant attributions to commits
- ALL work should appear as if done directly by the human developer
- Remove ALL AI assistant signatures from any generated text
- NO automated footers, signatures, or attribution messages of any kind

BUILD/TEST COMMANDS
- Build: `npm run build`
- Watch mode: `npm run build:watch`
- Type check: `npm run check`
- Clean build: `npm run clean`
- Run tests: `npm test`
- Run single test: `npm test -- -t "test name pattern"`

CODE PRINCIPLES
- TypeScript: Use strict typing with interfaces/types. Functions > classes for stateless operations.
- API: Handle errors with detailed error responses using `createErrorResult`. Implement resilience with try/catch blocks.
- Config: Use environment variables (`process.env.ATTIO_API_KEY`). No hardcoding secrets.
- Errors: Use specific `try/catch` blocks. Allow continuation on non-critical errors.
- Logging: Use console.error for critical errors, with process.exit(1) for fatal errors.

CODE STYLE/STRUCTURE
- Follow standard TypeScript conventions with strict type checking.
- SRP: Keep functions focused on single responsibility.
- Handle errors with detailed messages for API interactions.
- Naming: `PascalCase` (classes/interfaces), `camelCase` (functions/variables), `snake_case` (files).
- Formatting: Follow project style, 2-space indentation.
- Types/Docs: Mandatory type hints. Use JSDoc for public API.
- Imports: Node.js standard modules -> external -> internal.
- Testing: 
  * ALWAYS place ALL tests in the `/test` directory - never in project root
  * Use Jest for TypeScript tests (*.test.ts)
  * Manual test scripts should be named with `-test.js` suffix
  * Test files should mirror the structure of the source code they test

GITHUB WORKFLOW

## Repository Setup
We use a multi-remote setup for this project:
- `origin`: Primary development repository (https://github.com/kesslerio/attio-mcp.git)
- `fork`: Fork of the original repository (https://github.com/kesslerio/attio-mcp-server.git)
- `upstream`: Original repository (https://github.com/hmk/attio-mcp-server.git)

IMPORTANT: All GitHub CLI commands must specify the correct repository using the `--repo` flag.

Examples:
```bash
# For working with the primary development repository
gh issue list --repo kesslerio/attio-mcp

# For working with the fork
gh pr create --repo kesslerio/attio-mcp-server
```

1. Issue Management
- Create issues before starting work using templates in .github/ISSUE_TEMPLATE/
- Use descriptive titles: type: Description (clear, concise)
- Search first: gh issue list --repo kesslerio/attio-mcp --search "keyword" to avoid duplication

Required Labels:
- Priority Labels:
  * P0 - Critical (service down, security issue)
  * P1 - High (blocking functionality)
  * P2 - Medium (important but not blocking)
  * P3 - Low (minor improvements)
  * P4/P5 - Trivial (cosmetic, nice-to-have)

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

- Check available labels: gh label list --repo kesslerio/attio-mcp (do not create new labels without approval)

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
- DO NOT include any attribution messages like "Generated with Claude Code" or "Co-Authored-By: Claude" in commits
- DO NOT include any AI assistant attribution or signatures in commit messages
- Examples:
  Fix: Resolve token bucket race condition #42
  Docs: Update BUILD_SYSTEM_REFERENCE.md with optimization docs #85

4. Pull Requests
- ALWAYS get explicit approval from repository owner before committing or pushing to git upstream
- Reference issues with Closes #XX or Relates to #XX
- Include complete testing details
- Wait for review approval before merging
- Use squash merging when possible
- DO NOT include any attribution messages like "Generated with Claude Code" in PR bodies
- DO NOT include any AI assistant attribution or signatures anywhere in PR templates
- Ensure all PR descriptions and bodies focus exclusively on technical changes and reasoning

Creating PRs with GitHub CLI:
```bash
# For PRs in the primary development repository
gh pr create --repo kesslerio/attio-mcp --title "Feature: Your Feature Title" --body "Description of changes"

# For PRs to the original repository (from your fork)
gh pr create --repo hmk/attio-mcp-server --head kesslerio:feature/your-feature-name --title "Feature: Your Feature Title" --body "Description of changes"
```

Viewing PRs:
```bash
# View PRs in the primary development repository
gh pr list --repo kesslerio/attio-mcp

# View a specific PR with details
gh pr view 13 --repo kesslerio/attio-mcp
```

Reviewing PRs:
```bash
# View the diff for a specific PR
gh pr diff 13 --repo kesslerio/attio-mcp

# Add a review comment
gh pr review 13 --repo kesslerio/attio-mcp --comment "Your review comments here"

# Approve a PR
gh pr review 13 --repo kesslerio/attio-mcp --approve
```

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
- PR template: .github/PULL_REQUEST_TEMPLATE.md

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
□ Get explicit approval from repository owner before committing or pushing to git upstream

Issue Closure Checklist:
□ Check off all acceptance criteria
□ Add implementation details comment with all required sections
□ Add verification statement
□ Apply final status label (status:review)
□ Reference issue in PR (Closes #XX)
□ Get review approval before merging

Workflow DON'Ts:
□ DON'T create new issue templates for specific features or components
□ DON'T document milestones in markdown files (use GitHub Milestones instead)
□ DON'T create alternative workflows for specific project components
□ DON'T bypass the established label system with custom solutions
□ DON'T create separate process documentation for individual features
□ DON'T attempt operations without verifying paths/files exist first
□ DON'T create duplicate issues or PRs (check existing ones first)
□ DON'T continue with failed commands without resolving root causes
□ DON'T include any AI tool attribution messages (e.g., "Generated with Claude Code") in commits or PRs
□ DON'T add co-authorship lines for AI tools in any Git contributions

MILESTONES
- SDR Module: Pre-demo qualification
- AE Module: Post-demo closing

Use gh issue list to check current project status.

DOCUMENTATION GUIDELINES

- DO NOT create new template files or documentation alternatives for existing processes
- Use GitHub's native features (Projects, Milestones, Issues) rather than custom markdown files
- All project documentation should be centralized in the existing structure
- For new feature areas, use area labels rather than creating new templates
- Documentation for major features should be added to the main docs folder, not scattered in .github/
- Always use gh CLI tools for GitHub operations rather than creating separate tracking documents
- NEVER create draft files in the project root directory
- All working files must be placed in appropriate subdirectories based on their purpose:
  * Documentation goes in /ShapeScaleAI/docs/
  * Development files go in their module-specific directories
  * Issue analysis should be done directly in GitHub issues, not in separate files
- Delete all temporary files when work is completed

LARGE ENHANCEMENT PROJECTS

For major feature implementations:
- Create a GitHub Project directly in the GitHub interface or via gh CLI
- Use GitHub Milestones to track progress phases
- Break down work using standard issue templates with appropriate area labels
- Maintain a single source of truth for requirements in the primary documentation
- DO NOT create separate process documentation or templates for individual features

Examples of GitHub CLI commands for project management:
```bash
# Create a new project (always specify the repository)
gh project create --title "Project Name" --description "Description" --repo kesslerio/attio-mcp

# Create a milestone (always specify the repository) 
gh milestone create --title "Milestone Name" --description "Description" --repo kesslerio/attio-mcp

# Create a new issue with labels (always specify the repository)
gh issue create --title "Issue Title" --body "Description" --label "feature,area:core,P2,status:ready" --repo kesslerio/attio-mcp

# List milestones (always specify the repository)
gh milestone list --repo kesslerio/attio-mcp

# List projects (always specify the repository)
gh api repos/kesslerio/attio-mcp/projects --jq ".[].name"
```

ERROR HANDLING AND VERIFICATION

Before issuing commands:
- ALWAYS verify paths exist before referencing them: ls -la <path> or test -e <path>
- ALWAYS verify label existence before using: gh label list --repo kesslerio/attio-mcp | grep "<label>"
- ALWAYS search for existing issues before creating new ones: gh issue list --repo kesslerio/attio-mcp --search "<keywords>"
- ALWAYS check command output for errors and resolve before proceeding
- ALWAYS include the --repo flag with the correct repository for all GitHub CLI commands

When errors occur:
1. Stop and identify the root cause of the error
2. Document the error and resolution in logs for recurring issues
3. Do not repeat failed commands without addressing the underlying issue
4. For path errors, always use absolute paths or verify current directory first
5. For label errors, use only labels from the allowed list or create appropriately

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

For API/technical documentation

```# For general API/technical documentation
mcp_brave_web_search(
  query: "ShapeScale API token bucket algorithm documentation",
  count: 5
)

For finding code examples

```mcp_brave_web_search(
  query: "github example implementation token bucket rate limiter",
  count: 5
)
```

Sequential Thinking for Complex Bugs
For stubborn bugs and complex problems, use the Sequential Thinking MCP tool to break down the problem-solving process:

```mcp_sequentialthinking(
  thought: "Initial analysis of the bug...",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true
)
```

Sequential Thinking workflow:
1. Start with an initial problem statement
2. Break down analysis into sequential steps
3. Revise previous thoughts when new information emerges
4. Branch to explore alternative approaches when needed
5. Continue until reaching a clear solution

External Research Tools
When documentation is incomplete or you need external references:
   
```# For general API/technical documentation
mcp_brave_web_search(
  query: "ShapeScale API token bucket algorithm documentation",
  count: 5
)

# For finding code examples or implementations
mcp_brave_web_search(
  query: "github example implementation token bucket rate limiter",
  count: 5
)
```

Research best practices:
- Include specific error messages in search queries
- Look for official documentation first, then community resources
- Search for specific code patterns rather than general concepts
- Use "github" in queries to find real implementation examples
- Prefer recent results for APIs that change frequently