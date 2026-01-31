# @hashtagcms/web-sdk

> Core JavaScript SDK for the HashtagCMS ecosystem

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

This package contains the core JavaScript logic and components for HashtagCMS, providing shared functionality that is used across both **Blade/PHP** (`@hashtagcms/web-ui-kit`) and **Java** (`@hashtagcms/theme-java`) theme ecosystems.

## 📚 Documentation

For more detailed information, check the following guides:

- [Architecture & Design](./docs/01-architecture.md)
- [Bootstrap & Global Config](./docs/02-bootstrap.md)
- [Component API Reference](./docs/03-components.md)
- [Integrating with Themes (PHP/Java)](./docs/04-integration.md)

## ✨ Features

- 🛠️ **Core Components** - Shared logic like Configuration forms and Analytics tracking
- 🔧 **Configurable** - Manage application settings with `AppConfig`
- 🌐 **Standardized Requests** - Automatic CSRF token handling and Axios configuration
- 📦 **Framework Agnostic** - Vanilla JavaScript logic that works anywhere
- 🚀 **Lightweight** - Minimized footprint for high-performance builds

## 📦 Installation

```bash
npm install @hashtagcms/web-sdk
```

## 🚀 Quick Start

### Basic Usage

```javascript
import { Analytics, Subscribe, AppConfig } from "@hashtagcms/web-sdk";

// Initialize Components
const subscribe = new Subscribe();
const analytics = new Analytics();
const config = new AppConfig({
    media: { http_path: "https://cdn.example.com" }
});

// Use analytics
analytics.trackPageView('/home');
```

## 🛠️ API Reference

### `Subscribe`
Handles newsletter or contact form configuration.
- `init()`: Automatically finds form elements and attaches listeners.
- `subscribeNow()`: Programmatically triggers a configuration request.

### `Analytics`
Standardized tracking for HashtagCMS.
- `init(data)`: Initializes tracking with initial data.
- `trackPageView(url)`: Tracks a page view event.
- `trackEventView(category, action, value)`: Tracks a custom interaction.

### `AppConfig`
A helper class to manage CMS configuration.
- `setConfigData(data)`: Update the current configuration.
- `getValue(key, defaultVal)`: Safely retrieve configuration values.
- `getMedia(path)`: Get the full CDN/Server path for a media asset.

## 📄 License

[MIT](LICENSE) © HashtagCMS
