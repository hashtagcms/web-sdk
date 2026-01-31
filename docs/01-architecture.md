# Web SDK Architecture

The `@hashtagcms/web-sdk` is designed as a lightweight, framework-agnostic collection of utilities and components used by the HashtagCMS ecosystem.

## 📁 Project Structure

```
@hashtagcms/web-sdk/
├── src/
│   ├── bootstrap.js       # Global initialization (Axios, CSRF)
│   ├── index.js           # Main entry point (Exports)
│   ├── components/        # UI-related logic
│   │   └── subscribe.js   # Configuration form handler
│   ├── helpers/           # Shared helpers
│   │   └── common.js      # AppConfig and utilities
│   └── utils/             # General utilities
│       └── analytics.js   # Tracking logic
├── package.json
└── README.md
```

## 🏗️ Design Principles

1. **Framework Agnostic**: No dependency on React, Vue, or Angular. Uses vanilla JavaScript to ensure compatibility with any frontend environment (Blade templates, Thymeleaf, etc.).
2. **Minimal Dependencies**: Keeps the bundle size small. Currently only depends on `axios` for HTTP requests.
3. **Singleton Compatibility**: Designed to be initialized once per page load to manage global state like configuration and tracking.
4. **Data-Attr Driven**: Components are designed to find their target elements using HTML5 `data-` attributes, reducing the need for explicit DOM passing in most cases.
