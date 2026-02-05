# Analytics Usage Guide

The `Analytics` class provides a flexible and configurable way to track analytics events, page views, and publish analytics data to your server. It supports Google Analytics integration (Legacy, Universal Analytics, and GA4) and includes optional callbacks for custom behavior.

---

## 📦 **Installation**

```javascript
import { Analytics } from '@hashtagcms/web-sdk';
```

---

## 🚀 **Quick Start**

### Basic Usage (Default Configuration)

```javascript
const analytics = new Analytics();

// Publish analytics data
analytics.publish({ event_type: 'custom', user_id: 123 });

// Track CMS-specific category page
analytics.trackCmsPage({ categoryId: 1, pageId: 123 });

// Track standard page view (Master method)
analytics.trackPageView('/home');

// Track event on Google Analytics
analytics.google.trackEventView('Button', 'Click', 'Subscribe Button');
```

---

## ⚙️ **Configuration Options**

### Constructor Options

```javascript
const analytics = new Analytics({
    publishUrl: '/api/analytics',           // Custom publish URL
    enableGoogleAnalytics: true,            // Enable GA integration
    enableBeacon: true,                     // Use sendBeacon API (default: true)
    onPublish: (data, response, meta) => {  // Success callback
        console.log('Published:', data);
        console.log('Beacon sent:', meta.beaconSent);
    },
    onError: (error, data) => {             // Error callback
        console.error('Failed:', error);
    },
    onPageView: ({ url }) => {              // Page view callback
        console.log('Page viewed:', url);
    },
    onEvent: ({ category, action, value }) => {  // Event callback
        console.log('Event:', category, action, value);
    }
});
```

### Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `publishUrl` | string | `'/analytics/publish'` | URL for publishing analytics data |
| `enableGoogleAnalytics` | boolean | `true` | Enable Google Analytics integration |
| `enableBeacon` | boolean | `true` | Use sendBeacon if available, fallback to axios |
| `onPublish` | function | `null` | Callback after successful publish |
| `onError` | function | `null` | Callback on publish error |
| `onPageView` | function | `null` | Callback after page view tracking |
| `onEvent` | function | `null` | Callback after event tracking |

### How `enableBeacon` Works

When `enableBeacon` is `true` (default), the `publish()` method will:

1. **Try sendBeacon first** - If browser supports it
2. **Fallback to axios** - If sendBeacon is not supported or fails

**Benefits:**
- ✅ **Fast** - sendBeacon doesn't block the page
- ✅ **Reliable** - Works even during page unload
- ✅ **Smart Fallback** - Uses axios when beacon isn't available
- ✅ **No Duplicates** - Only one method is used (not both)

**Example:**
```javascript
const analytics = new Analytics({
    enableBeacon: true,  // Default
    onPublish: (data, response, meta) => {
        if (meta.beaconSent) {
            console.log('Sent via beacon');
            // response will be null (beacon doesn't return response)
        } else {
            console.log('Sent via axios');
            console.log('Server response:', response);
        }
    }
});

// Will use beacon if supported, otherwise axios
analytics.publish({ event: 'test' });
```

**Disable Beacon (axios only):**
```javascript
const analytics = new Analytics({
    enableBeacon: false  // Always use axios
});
```
---

## 📊 **Publishing Analytics Data**

### Method 1: Using `publish()`

```javascript
const analytics = new Analytics({
    publishUrl: '/api/analytics',
    onPublish: (data, response) => {
        console.log('Analytics published successfully');
    }
});

// Publish data
analytics.publish({
    event_type: 'page_interaction',
    user_id: 123,
    session_id: 'abc123'
});
```

### Method 2: Using `publish()` with Callback

```javascript
const analytics = new Analytics();

analytics.publish(
    { event: 'signup', user_id: 456 },
    (error, response) => {
        if (error) {
            console.error('Failed to publish:', error);
        } else {
            console.log('Published:', response);
        }
    }
);
```

### Method 3: Using Promises

```javascript
const analytics = new Analytics();

analytics.publish({ event: 'purchase', amount: 99.99 })
    .then(response => {
        console.log('Success:', response);
    })
    .catch(error => {
        console.error('Error:', error);
    });
```

---

## 📄 **Tracking Page Views**

### Basic Page View Tracking

```javascript
```javascript
const analytics = new Analytics();

// Track CMS page view (Standard)
analytics.trackCmsPage({ 
    categoryId: 1, 
    pageId: 123 
});

// Track standard page view via URL (Google Analytics + Callbacks)
analytics.trackPageView('/products/123');
```

### With Callback

```javascript
const analytics = new Analytics({
    onPageView: ({ url }) => {
        console.log('Page view tracked:', url);
        // Send to your custom analytics
        fetch('/my-analytics', {
            method: 'POST',
            body: JSON.stringify({ page: url })
        });
    }
});

analytics.trackPageView('/checkout');
```

### With Inline Callback

```javascript
const analytics = new Analytics();

analytics.trackPageView('/thank-you', () => {
    console.log('Thank you page viewed');
});
```

---

## 🎯 **Tracking Events**

### Basic Event Tracking

```javascript
```javascript
const analytics = new Analytics();

// Track button click
analytics.google.trackEventView('Button', 'Click', 'Subscribe Button');

// Track form submission
analytics.google.trackEventView('Form', 'Submit', 'Contact Form');

// Track video play
analytics.google.trackEventView('Video', 'Play', 'Product Demo');
```

### With Callback

```javascript
const analytics = new Analytics({
    onEvent: ({ category, action, value }) => {
        console.log(`Event: ${category} - ${action} - ${value}`);
        // Send to your custom analytics
    }
});

analytics.google.trackEventView('Download', 'Click', 'PDF Brochure');
```

### With Inline Callback

```javascript
const analytics = new Analytics();

analytics.google.trackEventView('Purchase', 'Complete', 'Product A', () => {
    console.log('Purchase event tracked');
    // Redirect to thank you page
    window.location.href = '/thank-you';
});
```

---

## 🔧 **Advanced Usage**

### Using sendBeacon API

By default (`enableBeacon: true`), analytics will use sendBeacon when available, with automatic fallback to axios.

```javascript
const analytics = new Analytics({
    enableBeacon: true,  // Default - uses beacon OR axios
    publishUrl: '/api/analytics',
    onPublish: (data, response, meta) => {
        if (meta.beaconSent) {
            console.log('Sent via sendBeacon (no response)');
        } else {
            console.log('Sent via axios');
            console.log('Server response:', response);
        }
    }
});

// Perfect for exit tracking - beacon survives page unload
window.addEventListener('beforeunload', () => {
    analytics.publish({
        event: 'page_exit',
        duration: Date.now() - pageLoadTime
    });
});
```

**Why sendBeacon?**
- **Fast**: Non-blocking, doesn't delay page navigation
- **Reliable**: Works during page unload (when axios would fail)
- **Automatic**: Falls back to axios if not supported


### Dynamic Configuration

```javascript
const analytics = new Analytics();

// Change publish URL
analytics.setOption('publishUrl', '/new-analytics-endpoint');

// Enable/disable Google Analytics
analytics.setOption('enableGoogleAnalytics', false);

// Add callback
analytics.setOption('onPublish', (data) => {
    console.log('Data published:', data);
});

// Get current option
const url = analytics.getOption('publishUrl');
console.log('Current URL:', url);
```

### Custom HTTP Requests

```javascript
const analytics = new Analytics();

// Custom GET request
analytics.submit('get', '/api/stats', { user_id: 123 })
    .then(response => console.log(response));

// Custom POST request
analytics.submit('post', '/api/events', { event: 'click' })
    .then(response => console.log(response));
```

---

## 🌐 **Google Analytics Integration**

The Analytics class automatically integrates with:
- **Legacy Google Analytics** (`_gaq`)
- **Universal Analytics** (`ga`)
- **Google Analytics 4** (`gtag`)

### Disable Google Analytics

```javascript
const analytics = new Analytics({
    enableGoogleAnalytics: false  // Only use custom callbacks
});
```

### Google Analytics Events

```javascript
// This will automatically send to Google Analytics if available
analytics.google.trackEventView('Video', 'Play', 'Homepage Hero Video');
```

### Google Analytics Page Views

```javascript
// This will automatically send to Google Analytics if available
analytics.trackPageView('/products');

// Equivalent to:
// ga('send', 'pageview', '/products');
// gtag('config', 'GA_MEASUREMENT_ID', { page_path: '/products' });
```

---

## 💡 **Real-World Examples**

### Example 1: E-commerce Tracking

```javascript
const analytics = new Analytics({
    publishUrl: '/api/analytics',
    onPublish: (data, response) => {
        console.log('Analytics sent:', data);
    },
    onError: (error) => {
        console.error('Analytics error:', error);
        // Log to error tracking service
    }
});

// Track product view
analytics.publish({
    event: 'product_view',
    product_id: 123,
    product_name: 'Blue Widget',
    price: 29.99
});

// Track add to cart
analytics.trackEventView('Ecommerce', 'Add to Cart', 'Blue Widget');

// Track purchase
analytics.publish({
    event: 'purchase',
    transaction_id: 'TXN-12345',
    total: 59.98,
    items: [
        { id: 123, name: 'Blue Widget', quantity: 2 }
    ]
});
```

### Example 2: SPA (Single Page Application) Tracking

```javascript
const analytics = new Analytics({
    publishUrl: '/api/analytics',
    onPageView: ({ url }) => {
        // Update document title
        document.title = `My App - ${url}`;
    }
});

// In your router
router.afterEach((to, from) => {
    // Master method tracks to Google and triggers callbacks
    analytics.trackPageView(to.path);
});
```

### Example 3: Form Tracking

```javascript
const analytics = new Analytics({
    onEvent: ({ category, action, value }) => {
        // Send to multiple analytics services
        if (window.mixpanel) {
            mixpanel.track(action, { category, value });
        }
    }
});

document.querySelector('#contact-form').addEventListener('submit', (e) => {
    analytics.google.trackEventView('Form', 'Submit', 'Contact Form');
    
    // Publish detailed form data
    analytics.publish({
        event: 'form_submission',
        form_name: 'contact',
        fields: {
            name: e.target.name.value,
            email: e.target.email.value
        }
    });
});
```

### Example 4: User Session Tracking

```javascript
const sessionStart = Date.now();

const analytics = new Analytics({
    publishUrl: '/api/analytics',
    enableBeacon: true  // Use beacon for exit tracking
});

// Track session start
analytics.publish({
    event: 'session_start',
    timestamp: sessionStart,
    referrer: document.referrer
});

// Track session end on page unload
window.addEventListener('beforeunload', () => {
    analytics.publish({
        event: 'session_end',
        duration: Date.now() - sessionStart,
        pages_viewed: pageViewCount
    });
});
```

---

## 🐛 **Error Handling**

### Using Callbacks

```javascript
const analytics = new Analytics({
    onError: (error, data) => {
        console.error('Analytics error:', error);
        console.log('Failed data:', data);
        // Log to error tracking service
        Sentry.captureException(error);
    }
});
```

### Using Promises

```javascript
const analytics = new Analytics();

analytics.publish({ event: 'test' })
    .catch(error => {
        console.error('Failed to publish:', error);
        // Retry logic
        setTimeout(() => {
            analytics.publish({ event: 'test' });
        }, 5000);
    });
```

---

## 📝 **TypeScript Support**

```typescript
import { Analytics, AnalyticsOptions, AnalyticsCallback } from '@hashtagcms/web-sdk';

const options: AnalyticsOptions = {
    publishUrl: '/api/analytics',
    enableGoogleAnalytics: true,
    onPublish: (data: any, response?: any) => {
        console.log('Published:', data);
    }
};

const analytics = new Analytics(options);

// Type-safe callbacks
const callback: AnalyticsCallback = (error, response) => {
    if (error) {
        console.error(error);
    } else {
        console.log(response);
    }
};

analytics.publish({ event: 'test' }, callback);
```

---

## 🎯 **Best Practices**

1. **Initialize Once**: Create a single Analytics instance and reuse it
2. **Use Callbacks**: Leverage callbacks for custom analytics integrations
3. **Error Handling**: Always handle errors in production
4. **sendBeacon**: Use for exit tracking to ensure data is sent
5. **Privacy**: Respect user privacy and GDPR compliance

---

## 📚 **API Reference**

### Constructor
```javascript
new Analytics(options?: AnalyticsOptions)
```

### Methods
- `trackPageView(url, callback?)` - Track a page view using a URL (GA + Callbacks)
- `trackCmsPage(data, callback?)` - Track a CMS-category page view (HashtagCMS Server)
- `publish(data, callback?)` - Publish arbitrary analytics data to server
- `setOption(key, value)` - Set configuration option
- `getOption(key, defaultValue?)` - Get configuration option
- `submit(method, url, data)` - Custom HTTP request (used internally by publish)

### Google Analytics Helper (`analytics.google`)
- `trackPageView(url, callback?)` - Track page view on Google Analytics only
- `trackEventView(category, action, value, callback?)` - Track event on Google Analytics only

---

## 🔗 **Related Documentation**

- [TypeScript Support](./07-typescript-support.md)
- [Component API Reference](./03-components.md)
- [Integration Guide](./04-integration.md)
