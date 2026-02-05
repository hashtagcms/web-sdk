# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2024

### Added
- **UMD Build Support** - Now provides a bundled version for browsers/CDNs at `dist/index.umd.js`.
- **Global `HashtagCms` Object** - SDK exports are now accessible via `window.HashtagCms`.
- **FormSubmitter** alias for Newsletter component (recommended for general forms).
- **Comprehensive Documentation** - Full refresh of README and 10 detailed guides in `/docs`.
- FormValidator with 15+ built-in validation rules.
- AppConfig robust JSON parsing (handles strings and objects).
- Newsletter component callbacks (onSuccess, onError).
- Promise-based form submission API.
- TypeScript definitions - Full type support for all exported classes and functions.
- ESLint and Prettier configuration.
- Test coverage reporting.
- GitHub Actions CI/CD workflow.

### Changed
- Refactored build process to use Webpack for multiple distribution formats (ESM, CommonJS, UMD).
- Updated package.json fields (`browser`, `module`, `main`) for better tool compatibility.
- Newsletter component now fully configurable with options.
- Improved error handling across all components.

### Deprecated
- `Subscribe` component (use `FormSubmitter` or `Newsletter` instead).
- `subscribeNow()` method (use `submit()` instead).

### Fixed
- Bootstrap.js incorrect Authorization header usage.
- Newsletter component properly resets validator after submission.
- Updated contact email to `hashtagcms.org@gmail.com`.

## [1.0.2] - 2024

### Added
- Newsletter component for email subscriptions
- Analytics tracking utilities
- AppConfig helper for configuration management
- Basic form handling
- Axios integration with CSRF token support

### Changed
- Initial stable release

## [1.0.0] - 2024

### Added
- Initial release
- Core SDK structure
- Basic components and utilities
