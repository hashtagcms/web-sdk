# Bootstrap and Initialization

The `bootstrap.js` file handles the global setup required for HashtagCMS to communicate with the backend.

## 🛠️ Automated Setup

When you import the SDK, it automatically performs several actions:

1. **Axios Configuration**:
   - Sets the `X-Requested-With: XMLHttpRequest` header.
   - Enables `withCredentials` for cross-site cookie handling.
2. **CSRF Protection**:
   - Automatically looks for a `<meta name="csrf-token" content="...">` tag in the document head.
   - Sets the `X-CSRF-TOKEN` header for all Axios requests.
   - Sets the `Authorization: Bearer <token>` header for API compatibility.

In most cases, you don't need to call bootstrap manually. It is executed automatically when you import the SDK or include it via a script tag.

```javascript
// This will trigger bootstrap.js
import { FormSubmitter } from '@hashtagcms/web-sdk';
```

## 🌍 UMD Bootstrap

When using the SDK via CDN, the bootstrap logic runs as soon as the library is loaded. The global `HashtagCms` object is made available, and `window.axios` is pre-configured with your site's CSRF token.

```html
<script src="https://unpkg.com/@hashtagcms/web-sdk@latest/dist/index.umd.js"></script>
<script>
    // Axios is already pre-configured here
    window.axios.get('/api/any-endpoint').then(res => console.log(res.data));
</script>
```

## 🌐 Global Axios

The SDK exposes `axios` to the global `window` object for convenience in legacy scripts or simple inline templates. It is fully pre-configured to handle HashtagCMS security requirements (CSRF/Bearer tokens) as long as the meta tag is present.
