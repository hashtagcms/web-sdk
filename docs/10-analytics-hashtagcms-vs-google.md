# Analytics API - HashtagCMS vs Google Analytics

Understanding the difference between HashtagCMS analytics and Google Analytics tracking.

---

## 🎯 **Two Separate Systems**

The Analytics class provides **two independent tracking systems**:

1. **HashtagCMS Analytics** (`trackCmsPage`) - Publishes data to your server
2. **Google Analytics** (`google.trackPageView`) - Sends data to Google
3. **Master Method** (`trackPageView`) - The "One Ring" that triggers GA (and ready for expansion)

---

## 📊 **HashtagCMS Analytics**

Tracks page views and custom events by publishing data to your server.

### **Track Page View**

```javascript
const analytics = new Analytics({
    publishUrl: '/api/analytics'
});

// Track CMS-category page view
analytics.trackCmsPage({
    categoryId: 2,
    pageId: 123, /* pageId is optional */    
});
```

**What it does:**
- ✅ Publishes data to your server (`/analytics/publish`).
- ✅ Uses `navigator.sendBeacon` (if available) or `axios`.
- ✅ Triggers `onPublish` callback.
- ✅ Requires `categoryId` (and optional `pageId`).
- ❌ Does NOT automatically send to Google Analytics.

### **Publish Custom Events**

```javascript
// Track custom events
analytics.publish({
    event: 'product_view',
    productId: 123,
    categoryId: 5,
    price: 29.99
});

analytics.publish({
    event: 'add_to_cart',
    productId: 123,
    quantity: 2
});
```

---

## 🌐 **Google Analytics**

Tracks page views and events with Google Analytics only (no server publish).

### **Track Page View**

```javascript
const analytics = new Analytics();

// Track page view with Google Analytics
analytics.google.trackPageView('/products/widget');
```

**What it does:**
- ✅ Sends to Google Analytics (ga, gtag, _gaq)
- ❌ Does NOT publish to your server
- ❌ Does NOT trigger `onPublish` callback

### **Track Event**

```javascript
// Track event with Google Analytics
analytics.google.trackEventView('Button', 'Click', 'Add to Cart');
analytics.google.trackEventView('Video', 'Play', 'Product Demo');
```

**What it does:**
- ✅ Sends to Google Analytics (ga, gtag, _gaq)
- ❌ Does NOT publish to your server
- ❌ Does NOT trigger `onPublish` callback

---

## 🔄 **Comparison Table**

| Method | Sends to Server | Sends to Google Analytics | Use Case |
|--------|----------------|---------------------------|----------|
| `analytics.trackCmsPage(data)` | ✅ Yes | ❌ No | CMS category tracking |
| `analytics.trackPageView(url)` | ❌ No | ✅ Yes | Master page tracking (GA) |
| `analytics.publish(data)` | ✅ Yes | ❌ No | Custom HashtagCMS events |
| `analytics.google.trackPageView(url)` | ❌ No | ✅ Yes | Google Analytics ONLY |
| `analytics.google.trackEventView(...)` | ❌ No | ✅ Yes | Google Analytics ONLY |

---

## 💡 **Real-World Examples**

### **Example 1: Track Both Systems**

```javascript
const analytics = new Analytics({
    publishUrl: '/api/analytics'
});

// Track with HashtagCMS CMS logic
analytics.trackCmsPage({
    categoryId: 2,
    pageId: 123
});

// ALSO track with Master method (triggers GA + callbacks)
analytics.trackPageView('/products/widget');
```

### **Example 2: E-commerce Tracking**

```javascript
const analytics = new Analytics({
    publishUrl: '/api/analytics'
});

// Product view - HashtagCMS
analytics.publish({
    event: 'product_view',
    productId: 123,
    categoryId: 5,
    price: 29.99,
    userId: 456
});

// Product view - Google Analytics
analytics.google.trackEventView('Ecommerce', 'Product View', 'Blue Widget');

// Add to cart - HashtagCMS
analytics.publish({
    event: 'add_to_cart',
    productId: 123,
    quantity: 2,
    userId: 456
});

// Add to cart - Google Analytics
analytics.google.trackEventView('Ecommerce', 'Add to Cart', 'Blue Widget');
```

---

## 🎨 **Use Cases**

### **When to use `analytics.trackCmsPage(data)`**

Use for HashtagCMS page tracking when you need:
- ✅ Server-side analytics storage
- ✅ Custom data fields (categoryId, pageId, userId, etc.)
- ✅ Integration with HashtagCMS ecosystem
- ✅ Full control over analytics data

```javascript
analytics.trackCmsPage({
    categoryId: 2,
    pageId: 123,
    userId: 456,
    sessionId: 'abc123'
});
```

### **When to use `analytics.google.trackPageView(url)`**

Use for Google Analytics tracking when you need:
- ✅ Google Analytics dashboard integration
- ✅ Google Analytics reports and insights
- ✅ Standard web analytics (bounce rate, session duration, etc.)
- ✅ No server-side storage needed

```javascript
analytics.google.trackPageView('/products/widget');
```

### **When to use both**

Most applications will use **BOTH** systems:

```javascript
// Track with both systems
function trackPage(pageData) {
    // HashtagCMS - detailed CMS tracking
    analytics.trackCmsPage({
        categoryId: pageData.categoryId,
        pageId: pageData.pageId,
        userId: currentUser.id
    });
    
    // Global Master method - standard tracking
    analytics.trackPageView(pageData.url);
}
```

---

## 📝 **API Reference**

### **HashtagCMS Analytics**

#### `analytics.trackCmsPage(data, callback?)`

Track a CMS category/page view with HashtagCMS analytics.

```javascript
analytics.trackCmsPage({
    categoryId: 2,
    pageId: 123,
    userId: 456
}, (error, response) => {
    if (!error) {
        console.log('Tracked:', response);
    }
});
```

**Parameters:**
- `data` (object) - Page view data
  - `categoryId` (number, required) - Category ID
  - `pageId` (number, optional) - Page ID
  - ...any custom fields
- `callback` (function, optional) - Callback after publish

**Returns:** Promise

#### `analytics.trackPageView(url, callback?)`

Master method to track a page view across all systems.

```javascript
analytics.trackPageView('/products', () => {
    console.log('Page view tracked across systems');
});
```

**Parameters:**
- `url` (string) - Page URL
- `callback` (function, optional) - Callback after tracking

**Returns:** void

#### `analytics.publish(data, callback?)`

Publish custom analytics data to server.

```javascript
analytics.publish({
    event_type: 'custom_event',
    data: { ... }
});
```

**Parameters:**
- `data` (object) - Analytics data
- `callback` (function, optional) - Callback after publish

**Returns:** Promise

---

### **Google Analytics**

#### `analytics.google.trackPageView(url, callback?)`

Track a page view with Google Analytics only.

```javascript
analytics.google.trackPageView('/products');
```

**Parameters:**
- `url` (string) - Page URL
- `callback` (function, optional) - Callback after tracking

**Returns:** void

#### `analytics.google.trackEventView(category, action, value, callback?)`

Track an event with Google Analytics only.

```javascript
analytics.google.trackEventView('Button', 'Click', 'Subscribe');
```

**Parameters:**
- `category` (string) - Event category
- `action` (string) - Event action
- `value` (string) - Event value/label
- `callback` (function, optional) - Callback after tracking

**Returns:** void

---

## ✅ **Summary**

| Feature | trackCmsPage | trackPageView |
|---------|---------------------|------------------|
| **Purpose** | CMS Server tracking | Global "Master" tracking |
| **Data** | Object (`categoryId`, etc.) | String (`url`) |
| **Systems** | CMS Server only | GA + Callbacks |
| **Returns** | Promise | void |
| **Use Case** | Internal CMS logic | User-facing tracking |

**Use both for comprehensive analytics coverage!** 🚀
