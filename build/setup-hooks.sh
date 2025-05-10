#!/bin/bash

# Script to install git hooks for preventing AI attribution messages

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Ensure we're in the project root directory
if [ ! -d ".git" ]; then
  echo -e "${RED}Error:${NC} This script must be run from the root of the git repository."
  exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy hooks
echo "Installing git hooks..."

# Pre-commit hook
cp build/hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
echo -e "${GREEN}✅ Installed pre-commit hook${NC}"

# Prepare-commit-msg hook
cp build/hooks/prepare-commit-msg .git/hooks/prepare-commit-msg
chmod +x .git/hooks/prepare-commit-msg
echo -e "${GREEN}✅ Installed prepare-commit-msg hook${NC}"

echo -e "\n${GREEN}Successfully installed all git hooks!${NC}"
echo -e "These hooks will prevent including AI attribution messages in commits and PRs."
echo -e "To verify installation, run: ${YELLOW}ls -la .git/hooks/${NC}"

exit 0