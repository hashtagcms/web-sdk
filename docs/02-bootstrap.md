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

## 🚀 Manual Usage

In most cases, you don't need to call bootstrap manually. It is executed as a side-effect when you import the main SDK index or components.

```javascript
// This will trigger bootstrap.js
import { Subscribe } from '@hashtagcms/web-sdk';
```

## 🌐 Global Axios

The SDK exposes `axios` to the global `window` object for convenience in legacy scripts or simple inline templates:

```javascript
window.axios.get('/api/endpoint').then(...);
```
