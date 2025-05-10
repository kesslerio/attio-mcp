#!/bin/bash

# Script to install git hooks using symlinks
# This ensures any updates to the hooks in the repo automatically apply

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if [ ! -d ".git" ]; then
  echo -e "${RED}Error:${NC} This script must be run from the root of a git repository."
  exit 1
fi

echo -e "${YELLOW}Installing Git hooks with symlinks...${NC}"

# Make sure hooks are executable
chmod +x build/hooks/pre-commit
chmod +x build/hooks/prepare-commit-msg

# Create symlinks for pre-commit and prepare-commit-msg
ln -sf "$(pwd)/build/hooks/pre-commit" .git/hooks/pre-commit
ln -sf "$(pwd)/build/hooks/prepare-commit-msg" .git/hooks/prepare-commit-msg

echo -e "${GREEN}✅ Git hooks installed successfully${NC}"
echo -e "Symlinks created to ensure hooks stay up-to-date with repository changes."

# List the hooks to verify installation
echo -e "${YELLOW}Verifying installation:${NC}"
ls -la .git/hooks/pre-commit .git/hooks/prepare-commit-msg

# Test if grep works correctly with the patterns
echo -e "\n${YELLOW}Testing pattern detection:${NC}"
TEST_STRING="Generated with [Claude Code]"
if echo "$TEST_STRING" | grep -q "Generated with \[Claude Code\]"; then
  echo -e "${GREEN}✅ Pattern detection working correctly${NC}"
else
  echo -e "${RED}❌ Pattern detection not working. Check grep patterns.${NC}"
fi

exit 0