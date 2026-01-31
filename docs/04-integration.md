# Theme Integration Guide

The Web SDK isdesigned to be the functional core for any HashtagCMS theme, regardless of the rendering engine.

## 🐘 PHP/Blade Integration (`@hashtagcms/web-ui-kit`)

In a Laravel environment, themes typically use standard bundlers like Webpack or Vite. 

1. Install the SDK: `npm install @hashtagcms/web-sdk`
2. Import in your `app.js`:
```javascript
import { Subscribe, Analytics, AppConfig } from '@hashtagcms/web-sdk';

window.HashtagCms = {
    Subscribe: new Subscribe(),
    Analytics: new Analytics(),
    AppConfig: new AppConfig(window.cmsData)
};
```

## ☕ Java/Thymeleaf Integration (`@hashtagcms/theme-java`)

In the Java ecosystem, the SDK can be integrated via NPM (if using a modern JS build pipeline) or by including the bundled distribution in your templates.

1. Ensure the `csrf-token` meta tag is populated by the Java backend.
2. Initialize the SDK in your main template:
```html
<script th:inline="javascript">
    /* Initialize config from server-side model */
    const config = new HashtagCms.AppConfig([[${cmsConfig}]]);
</script>
```

## 🏗️ Future Platforms

Because the SDK is vanilla Javascript and focused on API interactions, it can be easily ported to:
- Mobile web views.
- Headless CMS frontends (Next.js, Nuxt.js).
- Static site generators.
