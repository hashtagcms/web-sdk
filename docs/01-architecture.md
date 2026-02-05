# Web SDK Architecture

The `@hashtagcms/web-sdk` is designed as a lightweight, framework-agnostic collection of utilities and components used by the HashtagCMS ecosystem.

## 📁 Project Structure

```
@hashtagcms/web-sdk/
├── src/
│   ├── bootstrap.js       # Global initialization (Axios, CSRF)
│   ├── index.js           # Main entry point (Exports)
│   ├── components/        # Frontend components
│   │   └── newsletter.js  # Form handler (Newsletter/FormSubmitter)
│   ├── helpers/           # Core helpers
│   │   ├── common.js      # AppConfig and utilities
│   │   ├── forms.js       # FormValidator logic
│   │   └── google-analytics.js # GA tracking helper
│   └── utils/             # General utilities
│       └── analytics.js   # HashtagCMS tracking logic
├── dist/                  # Compiled builds (CJS, ESM, UMD)
├── index.d.ts             # TypeScript definitions
├── package.json
└── README.md
```

## 🏗️ Design Principles

1. **Framework Agnostic**: No dependency on React, Vue, or Angular. Uses vanilla JavaScript to ensure compatibility with any frontend environment (Blade templates, Thymeleaf, Java/Spring, etc.).
2. **Standardized Communication**: Uses Axios with pre-configured CSRF protection to handle all CMS API interactions.
3. **Singleton Compatibility**: Designed to be initialized once per page load to manage global state like configuration and tracking.
4. **Build Flexibility**: Distributed in multiple formats to support modern bundlers and traditional browser `<script>` tags.

## 📦 Build Formats

The SDK is distributed in three formats:

- **ESM (dist/index.esm.js)**: For modern bundlers like Vite, Webpack, or Rollup.
- **CommonJS (dist/index.js)**: For Node.js environments.
- **UMD (dist/index.umd.js)**: For the browser via CDN. Exposes the global `HashtagCms` object.

