# Theme Integration Guide

The Web SDK is designed to be the functional core for any HashtagCMS theme, regardless of the rendering engine.

## 📦 Integration Methods

### 1. NPM / Module Bundler (Vite, Webpack)

Recommended for modern frontend workflows.

```bash
npm install @hashtagcms/web-sdk
```

```javascript
import { FormSubmitter, Analytics, AppConfig } from '@hashtagcms/web-sdk';

// Initialize and attach to window if needed for global access
window.HashtagCms = {
    form: new FormSubmitter(),
    analytics: new Analytics(),
    config: new AppConfig(window.HashtagCms.configData)
};
```

### 2. CDN / Script Tag (UMD)

The easiest way to integrate with traditional server-side rendering (PHP/Blade, Java/Thymeleaf, etc.).

```html
<script src="https://unpkg.com/@hashtagcms/web-sdk@latest/dist/index.umd.js"></script>
<script>
    // Access via the global HashtagCms object
    const analytics = new HashtagCms.Analytics();
    const config = new HashtagCms.AppConfig(window.HashtagCms.configData);
</script>
```

## 🐘 PHP/Blade Integration

Ensure the CSRF meta tag is present in your base layout:

```html
<meta name="csrf-token" content="{{ csrf_token() }}">
```

## ☕ Java/Thymeleaf Integration

Ensure the `csrf-token` meta tag is populated by your Java backend. Initialize your configuration from the server-side model:

```html
<script th:inline="javascript">
    const config = new HashtagCms.AppConfig([[${cmsConfig}]]);
</script>
```

## 🏗️ Future Platforms

Because the SDK is vanilla Javascript and focused on API interactions, it can be easily ported to:
- Mobile web views.
- Headless CMS frontends (Next.js, Nuxt.js).
- Static site generators.
