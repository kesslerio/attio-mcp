# Contributing to attio-mcp

First off, thank you for considering contributing to attio-mcp! This is a fork of the original [hmk/attio-mcp-server](https://github.com/hmk/attio-mcp-server) with enhanced functionality for the Attio API.

## Code of Conduct

By participating in this project, you agree to abide by our implicit code of conduct. Please treat others with respect, be inclusive, and avoid offensive language.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please create an issue with the following information:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots or code samples if applicable
- Any additional context that might be helpful

### Suggesting Enhancements

We welcome suggestions for enhancements! Please create an issue with:

- A clear, descriptive title
- A detailed description of the proposed enhancement
- Any relevant examples or mock-ups
- Why this enhancement would be useful

### Pull Requests

We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Update documentation if needed
5. Make sure your code follows the existing style
6. Submit the pull request

## Development Process

### Setting Up Development Environment

1. Fork the repository
2. Clone your fork locally
3. Add the upstream repository:
   ```
   git remote add upstream https://github.com/hmk/attio-mcp-server.git
   ```
4. Install dependencies:
   ```
   npm install
   ```
5. Create a `.env` file from the template:
   ```
   cp .env.template .env
   ```
6. Add your Attio API key to the `.env` file

### Development Workflow

1. Make sure your fork is up to date:
   ```
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```
2. Create a new branch for your feature:
   ```
   git checkout -b feature/your-feature-name
   ```
3. Implement your changes
4. Run tests:
   ```
   npm test
   ```
5. Ensure code is properly formatted:
   ```
   npm run lint
   ```
6. Commit your changes with descriptive commit messages
   - Use the format: `[Type]: [Description]` where Type is one of:
     - Feature
     - Fix
     - Docs
     - Refactor
     - Test
     - Chore
7. Push to your branch:
   ```
   git push origin feature/your-feature-name
   ```
8. Create a pull request from your branch to the main repository

## Style Guide

### Code Style

- Follow the established code style in the project
- Use TypeScript strictly typed code
- Document public APIs with JSDoc comments
- Keep functions focused on a single responsibility
- Write clear, descriptive variable and function names

### Commit Messages

We use a conventional commit message format:

```
Type: Description

Optional longer description

Optional footer
```

Where Type is one of:
- Feature: New functionality
- Fix: Bug fixes
- Docs: Documentation changes
- Refactor: Code restructuring
- Test: Test additions or changes
- Chore: Routine maintenance tasks

### Documentation

- Keep README and documentation up to date with changes
- Document new features or API changes
- Include examples for new functionality

## License

By contributing, you agree that your contributions will be licensed under the project's license.

## Questions?

If you have questions, feel free to create an issue labeled "question" in the repository.

Thank you for contributing!