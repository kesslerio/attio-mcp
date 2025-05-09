# Git Hooks for Attribution Prevention

This directory contains Git hooks designed to prevent AI assistant attribution messages in commits and pull requests.

## Available Hooks

### 1. pre-commit
Checks staged changes for AI attribution messages and rejects the commit if any are found.

### 2. prepare-commit-msg
Automatically removes AI attribution messages from commit messages.

## Installation

The hooks are automatically installed by running:

```bash
npm run setup-hooks
```

This happens automatically during `npm install` due to the `postinstall` script.

## Manual Installation

If you need to manually install the hooks:

```bash
# Run the install script
./build/install-hooks.sh
```

The install script creates symbolic links to ensure that any updates to the hooks in the repository are automatically applied to your local Git hooks.

## Testing the Hooks

You can test if the hooks are working properly using:

```bash
# Run the test script
./build/test-hooks.sh
```

This will create a temporary file with attribution messages and verify that they are detected correctly.

## Patterns Detected

The hooks detect and prevent the following attribution patterns:

- "Generated with Claude"
- "Generated with [Claude Code]"
- "Co-Authored-By: Claude"
- "noreply@anthropic.com"
- "Generated by AI"
- "AI-generated"
- "Generated by Claude"
- "🤖 Generated"
- "Created with Claude"

## Why This Matters

Per project guidelines, all contributions should appear as if done directly by the human developer:

- No AI assistant signatures in commit messages
- No co-authorship attributions for AI tools
- No attribution footers in PR descriptions

These hooks help enforce this policy automatically.