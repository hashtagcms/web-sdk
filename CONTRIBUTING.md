# Contributing to @hashtagcms/web-sdk

Thank you for your interest in contributing to the HashtagCMS Web SDK! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project follows a Code of Conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or bugfix
4. Make your changes
5. Push to your fork and submit a pull request

## Development Setup

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/web-sdk.git
cd web-sdk

# Install dependencies
npm install

# Run tests to verify setup
npm test
```

### Available Scripts

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Build and watch for changes
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
web-sdk/
├── src/
│   ├── components/      # UI components (Newsletter, etc.)
│   ├── helpers/         # Helper utilities (forms, common)
│   ├── utils/           # Utility functions (analytics)
│   ├── bootstrap.js     # Axios configuration
│   └── index.js         # Main entry point
├── tests/
│   ├── components/      # Component tests
│   └── utils/           # Utility tests
├── docs/                # Documentation
└── dist/                # Build output (generated)
```

## Development Workflow

### 1. Create a Branch

```bash
# For new features
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/bug-description
```

### 2. Make Changes

- Write clear, concise code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run specific test file
npm test -- newsletter.spec.js

# Run with coverage
npm run test:coverage
```

### 4. Lint and Format

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint -- --fix

# Format code
npm run format
```

### 5. Commit Your Changes

Use clear, descriptive commit messages:

```bash
# Good commit messages
git commit -m "feat: add email validation to FormValidator"
git commit -m "fix: resolve CSRF token issue in bootstrap"
git commit -m "docs: update FormSubmitter usage examples"

# Commit message format
# <type>: <description>
#
# Types: feat, fix, docs, style, refactor, test, chore
```

## Code Style

### JavaScript

- Use ES6+ features
- Use `const` for constants, `let` for variables
- No `var`
- Use single quotes for strings
- Add semicolons
- Use arrow functions where appropriate
- Document complex logic with comments

### Example

```javascript
// Good
const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Bad
var validateEmail = function(email) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}
```

### Documentation

- Add JSDoc comments for public methods
- Include parameter types and return types
- Provide usage examples for complex features

```javascript
/**
 * Validate a form field
 * @param {HTMLElement} field - The field to validate
 * @returns {boolean} True if valid, false otherwise
 */
validateField(field) {
    // Implementation
}
```

## Testing

### Writing Tests

- Write tests for all new features
- Maintain or improve code coverage
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert

### Test Example

```javascript
describe('FormValidator', () => {
    it('should validate required fields', () => {
        // Arrange
        const form = createTestForm();
        const validator = new FormValidator(form);
        
        // Act
        const isValid = validator.validate();
        
        // Assert
        expect(isValid).toBe(false);
    });
});
```

### Coverage Requirements

- Aim for at least 80% code coverage
- All new features must have tests
- Bug fixes should include regression tests

## Pull Request Process

### Before Submitting

1. ✅ All tests pass (`npm test`)
2. ✅ Code is linted (`npm run lint`)
3. ✅ Code is formatted (`npm run format`)
4. ✅ Documentation is updated
5. ✅ CHANGELOG.md is updated
6. ✅ No merge conflicts with main branch

### PR Guidelines

1. **Title**: Use clear, descriptive titles
   - Good: "Add phone number validation to FormValidator"
   - Bad: "Update forms.js"

2. **Description**: Include:
   - What changes were made
   - Why the changes were needed
   - How to test the changes
   - Screenshots (if UI changes)
   - Related issues (if any)

3. **Size**: Keep PRs focused and reasonably sized
   - Prefer smaller, focused PRs over large ones
   - Split large features into multiple PRs if possible

4. **Review**: Be responsive to feedback
   - Address review comments promptly
   - Ask questions if feedback is unclear
   - Be open to suggestions

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Checklist
- [ ] Tests pass
- [ ] Code is linted
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
```

## Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Verify it's actually a bug (not expected behavior)
3. Test with the latest version

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Environment**
- SDK Version: [e.g., 1.0.2]
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]

**Additional Context**
Any other relevant information
```

## Suggesting Features

### Feature Request Template

```markdown
**Problem**
What problem does this feature solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Any other relevant information
```

## Questions?

- 📧 Email: hashtagcms.org@gmail.com
- 💬 Discussions: GitHub Discussions
- 🐛 Issues: GitHub Issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to HashtagCMS Web SDK! 🚀
