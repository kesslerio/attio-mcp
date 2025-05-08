# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## BUILD/TEST COMMANDS
- Build: `npm run build`
- Watch mode: `npm run build:watch`
- Type check: `npm run check`
- Clean build: `npm run clean`
- Run tests: `npm test`
- Run single test: `npm test -- -t "test name pattern"`

## CODE PRINCIPLES
- TypeScript: Use strict typing with interfaces/types. Functions > classes for stateless operations.
- API: Handle errors with detailed error responses using `createErrorResult`. Implement resilience with try/catch blocks.
- Config: Use environment variables (`process.env.ATTIO_API_KEY`). No hardcoding secrets.
- Errors: Use specific `try/catch` blocks. Allow continuation on non-critical errors.
- Logging: Use console.error for critical errors, with process.exit(1) for fatal errors.

## CODE STYLE/STRUCTURE
- Follow standard TypeScript conventions with strict type checking.
- SRP: Keep functions focused on single responsibility.
- Handle errors with detailed messages for API interactions.
- Naming: `PascalCase` (classes/interfaces), `camelCase` (functions/variables), `snake_case` (files).
- Formatting: Follow project style, 2-space indentation.
- Types/Docs: Mandatory type hints. Use JSDoc for public API.
- Imports: Node.js standard modules -> external -> internal.
- Testing: Use Jest for tests. Keep separate from source code.

## GITHUB ISSUES & LABELS

### Issue Content Requirements
All GitHub issues MUST include:
- Clear, descriptive title that summarizes the task/problem
- Comprehensive problem statement with context
- Implementation details with code examples where appropriate
- Acceptance criteria as a checklist
- Links to related issues/resources
- Properly formatted markdown with headers, lists, and code blocks

### Issue Templates
Issues should follow this structure:
```markdown
# [Issue Title]

## Overview
[Brief summary of the issue]

## Problem Statement
[Detailed description of the problem being addressed]

## Goals
- [Goal 1]
- [Goal 2]
- [Goal 3]

## Implementation Details
[Detailed description of implementation approach]

### Required Changes
1. **[Change Area 1]**
   - [Specific change]
   - [Specific change]
   ```typescript
   // Code example if applicable
   ```

2. **[Change Area 2]**
   - [Specific change]
   - [Specific change]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Related Issues
- #[Issue number] [Issue description]

## Additional Resources
- [Link to relevant documentation]
- [Link to relevant reference]
```

### Labels

All issues MUST be properly labeled. Use these existing labels:

#### Type Labels
- `bug`: Something isn't working as expected
- `enhancement`: New feature or improvement to existing functionality
- `documentation`: Documentation-related changes
- `refactor`: Code changes that neither fix a bug nor add a feature
- `test`: Adding or modifying tests

#### Priority Labels
- `P0`: Critical - requires immediate attention
- `P1`: High - should be addressed in current sprint
- `P2`: Medium - important but not urgent
- `P3`: Low - nice to have
- `P4`: Trivial - can be addressed later

#### Status Labels
- `status:ready`: Ready to be worked on
- `status:in-progress`: Currently being worked on
- `status:blocked`: Blocked by another issue or external factor
- `status:review`: Ready for review
- `status:needs-info`: Needs more information

#### Area Labels
- `area:api`: API-related changes
- `area:core`: Core functionality
- `area:tools`: Tool handling
- `area:resources`: Resource handling
- `area:error-handling`: Error handling improvements
- `area:configuration`: Configuration-related changes
- `area:performance`: Performance improvements

DO NOT create new labels without discussion first.

### Issue Management
- Search existing issues before creating new ones
- Use GitHub CLI (`gh`) for issue management 
- Update issues regularly with progress
- Link PRs to issues using "Fixes #issue-number" syntax
- Close issues when they are completed