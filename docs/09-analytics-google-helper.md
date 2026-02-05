# Analytics Google Helper - Usage Examples

The Analytics class now includes a nested `google` object for Google Analytics specific tracking.

---

## 🎯 **New API Structure**

```javascript
import { Analytics } from '@hashtagcms/web-sdk';

const analytics = new Analytics();

// ✅ Google Analytics specific methods
analytics.google.trackPageView('/products');
analytics.google.trackEventView('Button', 'Click', 'Subscribe');

// ✅ HashtagCMS Category tracking (to server)
analytics.trackCmsPage({ categoryId: 1, pageId: 123 });

// ✅ Master page view tracking (triggers GA + onPageView)
analytics.trackPageView('/products');

// ✅ Publish arbitrary data to server
analytics.publish({ event_type: 'custom_event' });
```

---

## 📊 **Comparison**

### **Option 1: Google Analytics Only**
```javascript
const analytics = new Analytics();

// Only sends to Google Analytics (ga, gtag, _gaq)
// Does NOT trigger onPageView or onEvent callbacks
analytics.google.trackPageView('/home');
analytics.google.trackEventView('Video', 'Play', 'Hero Video');
```

### **Option 2: Full Analytics (GA + Callbacks)**
```javascript
const analytics = new Analytics({
    onPageView: ({ url }) => {
        console.log('Page viewed:', url);
        // Send to Mixpanel, Heap, etc.
    },
    onEvent: ({ category, action, value }) => {
        console.log('Event:', category, action, value);
        // Send to Mixpanel, Heap, etc.
    }
});

// ✅ Sends to Google Analytics AND triggers onPageView callback
analytics.trackPageView('/home');
```

---

## 🔧 **Use Cases**

### **Use Case 1: Google Analytics Only**

When you only want to track with Google Analytics:

```javascript
const analytics = new Analytics();

// Track page views
analytics.google.trackPageView('/');
analytics.google.trackPageView('/about');
analytics.google.trackPageView('/contact');

// Track events
analytics.google.trackEventView('Navigation', 'Click', 'Home Link');
analytics.google.trackEventView('Form', 'Submit', 'Contact Form');
```

### **Use Case 2: Multiple Analytics Services**

When you want to send to Google Analytics AND other services:

```javascript
const analytics = new Analytics({
    onPageView: ({ url }) => {
        // Send to other services
        if (window.mixpanel) {
            mixpanel.track('Page View', { url });
        }
        if (window.heap) {
            heap.track('pageview', { path: url });
        }
    },
    onEvent: ({ category, action, value }) => {
        // Send to other services
        if (window.mixpanel) {
            mixpanel.track(action, { category, value });
        }
    }
});

// This triggers GA trackPageView + onPageView callback
analytics.trackPageView('/products');
```

### **Use Case 3: Disable Google Analytics**

When you want to use only custom analytics:

```javascript
const analytics = new Analytics({
    enableGoogleAnalytics: false,
    onPageView: ({ url }) => {
        // Only custom tracking
        myCustomAnalytics.trackPage(url);
    }
});

// This will NOT send to Google Analytics
analytics.trackPageView('/home');

// This will warn and do nothing (GA is disabled)
analytics.google.trackPageView('/home');
```

---

## 💡 **API Reference**

### **analytics.google.trackPageView(url, callback?)**

Track a page view with Google Analytics only.

```javascript
analytics.google.trackPageView('/products');

// With callback
analytics.google.trackPageView('/products', () => {
    console.log('GA page view tracked');
});
```

**Parameters:**
- `url` (string) - Page URL to track
- `callback` (function, optional) - Callback after tracking

**Sends to:**
- ✅ Google Analytics (ga, gtag, _gaq)
- ❌ Does NOT trigger `onPageView` callback
- ❌ Does NOT publish to server

---

### **analytics.google.trackEventView(category, action, value, callback?)**

Track an event with Google Analytics only.

```javascript
analytics.google.trackEventView('Video', 'Play', 'Hero Video');

// With callback
analytics.google.trackEventView('Video', 'Play', 'Hero Video', () => {
    console.log('GA event tracked');
});
```

**Parameters:**
- `category` (string) - Event category
- `action` (string) - Event action
- `value` (string) - Event value/label
- `callback` (function, optional) - Callback after tracking

**Sends to:**
- ✅ Google Analytics (ga, gtag, _gaq)
- ❌ Does NOT trigger `onEvent` callback
- ❌ Does NOT publish to server

---

## 🎨 **Real-World Examples**

### **Example 1: SPA Router Integration**

```javascript
const analytics = new Analytics();

// Vue Router
router.afterEach((to, from) => {
    // Only track with Google Analytics
    analytics.google.trackPageView(to.path);
});

// React Router
useEffect(() => {
    analytics.google.trackPageView(location.pathname);
}, [location]);
```

### **Example 2: Button Click Tracking**

```javascript
const analytics = new Analytics();

document.querySelectorAll('[data-track]').forEach(button => {
    button.addEventListener('click', (e) => {
        const category = e.target.dataset.category || 'Button';
        const action = e.target.dataset.action || 'Click';
        const value = e.target.dataset.value || e.target.textContent;
        
        // Track with Google Analytics only
        analytics.google.trackEventView(category, action, value);
    });
});
```

### **Example 3: Video Player Tracking**

```javascript
const analytics = new Analytics();

videoPlayer.on('play', () => {
    analytics.google.trackEventView('Video', 'Play', videoPlayer.title);
});

videoPlayer.on('pause', () => {
    analytics.google.trackEventView('Video', 'Pause', videoPlayer.title);
});

videoPlayer.on('ended', () => {
    analytics.google.trackEventView('Video', 'Complete', videoPlayer.title);
});
```

---

## 📝 **TypeScript Support**

```typescript
import { Analytics, GoogleAnalyticsHelper } from '@hashtagcms/web-sdk';

const analytics = new Analytics();

// Type-safe Google Analytics tracking
const google: GoogleAnalyticsHelper = analytics.google;

google.trackPageView('/home');
google.trackEventView('Button', 'Click', 'Subscribe');
```

---

## ✅ **Summary**

| Method | Sends to GA | Publishes to Server | Notes |
|--------|-------------|---------------------|-------|
| `analytics.google.trackPageView()` | ✅ | ❌ | GA only |
| `analytics.google.trackEventView()` | ✅ | ❌ | GA only |
| `analytics.trackPageView(url)` | ✅ | ❌ | GA + Callbacks |
| `analytics.trackCmsPage(data)` | ❌ | ✅ | CMS Category View |
| `analytics.publish(data)` | ❌ | ✅ | Arbitrary data publish |

**Use `analytics.google.*` when you only want Google Analytics tracking!**
