# Component Documentation

## `Newsletter`

Handles newsletter and subscription forms using a standardized HTML structure. 
*Note: Also exported as `Subscribe` for backward compatibility.*

### Usage
```javascript
import { Newsletter } from '@hashtagcms/web-sdk';
const newsletter = new Newsletter();
```

### HTML Requirements
The component automatically detects if it should use the new `newsletter` or legacy `subscribe` selectors.

**Primary (New):**
- `form[data-form='newsletter-form']`
- `span[data-class='newsletter-message']`
- `div[data-message-holder='newsletter-message-holder']`
- `span[data-class='newsletter-close']`

**Legacy (Fallback):**
- `form[data-form='subscribe-form']`
- `span[data-class='subscribe-message']`
- `div[data-message-holder='subscribe-message-holder']`
- `span[data-class='subscribe-close']`

---

## `Analytics`

Provides a unified interface for tracking page views and custom events.

### Methods
- `init(data)`: Optional initialization with default data.
- `trackPageView(url)`: Sends a page view event to the CMS and Google Analytics (if detected).
- `trackEventView(category, action, value)`: Tracks custom interactions.

### Example
```javascript
const analytics = new Analytics();
analytics.trackPageView(window.location.pathname);
```

---

## `AppConfig`

Manages configuration data provided by the CMS backend.

### Methods
- `constructor(initialData)`
- `setConfigData(data)`: Replace the current configuration.
- `getValue(key, defaultVal)`: Safely retrieve a value (e.g., `getValue('site_name', 'Default Name')`).
- `getMedia(path)`: Constructs a full URL for a media asset using the configured media HTTP path.

### Example
```javascript
const config = new AppConfig(window.cmsConfig);
const logoUrl = config.getMedia('logo.png');
```
