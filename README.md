# @hashtagcms/web-sdk

<div align="center">

[![npm version](https://img.shields.io/npm/v/@hashtagcms/web-sdk.svg)](https://www.npmjs.com/package/@hashtagcms/web-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](index.d.ts)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

**Core JavaScript SDK for the HashtagCMS ecosystem**

*Framework-agnostic • TypeScript-ready • Production-tested*

[Installation](#-installation) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API Reference](#-api-reference) • [Contributing](CONTRIBUTING.md)

</div>

---

## 🌟 Overview

The HashtagCMS Web SDK is a comprehensive JavaScript library that provides essential frontend functionality for HashtagCMS applications. Built with vanilla JavaScript, it works seamlessly across all modern frameworks including React, Vue, Angular, Svelte, and plain JavaScript projects.

### Why Choose This SDK?

- 🎯 **Framework Agnostic** - Works with any JavaScript framework or vanilla JS
- 📦 **Lightweight** - Minimal footprint with tree-shaking support
- 🔒 **Type-Safe** - Full TypeScript definitions included
- ✅ **Battle-Tested** - Used in production HashtagCMS applications
- 🚀 **Modern** - ES6+ with backward compatibility
- 🧪 **Well-Tested** - Comprehensive test coverage with Jest
- 📚 **Well-Documented** - Extensive documentation and examples

---

## ✨ Features

### Core Components

| Feature | Description | Status |
|---------|-------------|--------|
| **Form Validation** | 15+ built-in validation rules with custom rule support | ✅ Stable |
| **Form Submission** | Smart form handling with CSRF protection | ✅ Stable |
| **Analytics** | Integrated tracking with Google Analytics support | ✅ Stable |
| **App Configuration** | Centralized configuration management | ✅ Stable |
| **HTTP Bootstrap** | Automatic CSRF token handling for Axios | ✅ Stable |

### Validation Rules

✅ Required • Email • URL • Phone • Number • Integer • Min/Max • Length • Pattern • Alpha • Alphanumeric • Date • Match • Custom Rules

---

## 📦 Installation

### NPM

```bash
npm install @hashtagcms/web-sdk
```

### Yarn

```bash
yarn add @hashtagcms/web-sdk
```

### CDN

```html
<!-- UMD Build -->
<script src="https://unpkg.com/@hashtagcms/web-sdk@latest/dist/index.umd.js"></script>
```

---

## 🚀 Quick Start

### Basic Form Validation

```javascript
import { FormValidator } from '@hashtagcms/web-sdk';

const validator = new FormValidator('#myForm', {
    validateOnBlur: true,
    showErrors: true,
    errorClass: 'is-invalid'
});

validator.validate((isValid, errors, formData) => {
    if (isValid) {
        console.log('Form is valid!', formData);
        // Submit your form
    } else {
        console.error('Validation errors:', errors);
    }
});
```

### Form Submission with Validation

```javascript
import { FormSubmitter } from '@hashtagcms/web-sdk';

const contactForm = new FormSubmitter({
    form: '#contact-form',
    messageHolder: '#messages',
    submitUrl: '/api/contact',
    onSuccess: (response) => {
        console.log('Form submitted successfully!', response);
    },
    onError: (error) => {
        console.error('Submission failed:', error);
    },
    validatorOptions: {
        validateOnBlur: true,
        showErrors: true
    }
});

// Programmatic submission
contactForm.submit()
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
```

### Analytics Tracking

```javascript
import { Analytics } from '@hashtagcms/web-sdk';

const analytics = new Analytics({
    publishUrl: '/analytics/publish',
    enableGoogleAnalytics: true,
    onPublish: (data, response) => {
        console.log('Analytics published:', data);
    }
});

// Track CMS-specific category page
analytics.trackCmsPage({
    categoryId: 1,
    pageId: 123
});

// Track standard page view (Master method)
analytics.trackPageView('/home');

// Track with Google Analytics
analytics.google.trackPageView('/home');
analytics.google.trackEventView('Button', 'Click', 'Subscribe Button');
```

### App Configuration

```javascript
import { AppConfig } from '@hashtagcms/web-sdk';

const config = new AppConfig({
    media: { 
        http_path: 'https://cdn.example.com' 
    },
    site_name: 'My Awesome Site',
    api_url: 'https://api.example.com'
});

// Get configuration values
const siteName = config.getValue('site_name', 'Default Site');
const apiUrl = config.getValue('api_url');

// Get media URLs
const logoUrl = config.getMedia('images/logo.png');
// Returns: https://cdn.example.com/images/logo.png

// Check if key exists
if (config.has('api_url')) {
    // Use API URL
}
```

---

## 📚 Documentation

### Comprehensive Guides

- 📖 [**Architecture & Design**](./docs/01-architecture.md) - Understanding the SDK structure
- ⚙️ [**Bootstrap & Global Config**](./docs/02-bootstrap.md) - Setting up the SDK
- 🧩 [**Component API Reference**](./docs/03-components.md) - All available components
- 🔗 [**Integration Guide**](./docs/04-integration.md) - Integrating with PHP/Java themes
- ✅ [**Form Validation Guide**](./docs/05-form-validation.md) - Complete validation documentation
- 📧 [**Newsletter/Form Submission**](./docs/06-newsletter-usage.md) - Form handling guide
- 📘 [**TypeScript Support**](./docs/07-typescript-support.md) - Using with TypeScript
- 📊 [**Analytics Usage**](./docs/08-analytics-usage.md) - Analytics tracking guide
- 🔍 [**Google Analytics Helper**](./docs/09-analytics-google-helper.md) - GA integration
- 📈 [**Analytics Comparison**](./docs/10-analytics-hashtagcms-vs-google.md) - HashtagCMS vs Google Analytics

---

## 🛠️ API Reference

### FormValidator

Comprehensive form validation with built-in and custom rules.

```typescript
class FormValidator {
    constructor(form: string | HTMLFormElement, options?: FormValidatorOptions)
    validate(callback?: ValidationCallback): boolean
    validateField(field: HTMLElement): boolean
    addRule(name: string, validator: ValidatorFunction, message?: string): void
    getErrors(): ValidationErrors
    getFormData(): Record<string, any>
    reset(): void
    isValid(): boolean
}
```

**Options:**

```javascript
{
    validateOnBlur: true,        // Validate on blur event
    validateOnInput: false,      // Validate on input event
    validateOnSubmit: true,      // Validate on submit event
    showErrors: true,            // Show error messages in DOM
    errorClass: 'is-invalid',    // CSS class for invalid fields
    successClass: 'is-valid',    // CSS class for valid fields
    scrollToError: true,         // Scroll to first error
    focusOnError: true,          // Focus first error field
    customRules: {},             // Custom validation rules
    customMessages: {}           // Custom error messages
}
```

**Built-in Validation Rules:**

| Rule | Description | Example |
|------|-------------|---------|
| `required` | Field must have a value | `<input required>` |
| `email` | Valid email address | `<input type="email">` |
| `url` | Valid URL | `<input type="url">` |
| `phone` | Valid phone number | `data-validate="phone"` |
| `number` | Numeric value | `<input type="number">` |
| `integer` | Integer value | `data-validate="integer"` |
| `min` | Minimum value | `<input min="5">` |
| `max` | Maximum value | `<input max="100">` |
| `minlength` | Minimum length | `<input minlength="3">` |
| `maxlength` | Maximum length | `<input maxlength="20">` |
| `pattern` | Regex pattern | `<input pattern="[A-Za-z]+">` |
| `alpha` | Alphabetic only | `data-validate="alpha"` |
| `alphanumeric` | Alphanumeric only | `data-validate="alphanumeric"` |
| `date` | Valid date | `<input type="date">` |
| `match` | Match another field | `data-validate="match:password"` |

**Custom Rules:**

```javascript
validator.addRule('creditcard', (value) => {
    // Luhn algorithm validation
    return /^[0-9]{13,19}$/.test(value);
}, 'Please enter a valid credit card number');
```

---

### FormSubmitter / Newsletter

Smart form submission handler with built-in validation and CSRF protection.

```typescript
class FormSubmitter {
    constructor(options: FormSubmitterOptions)
    submit(): Promise<any>
    showMessage(message: string, type?: 'success' | 'error'): void
    show(): void
    close(): void
    newsletterNow(): Promise<any>
}
```

**Options:**

```javascript
{
    form: '#myForm',                    // Form element or selector (required)
    messageHolder: '#messages',         // Message container (optional)
    submitUrl: '/api/submit',          // Submit endpoint (default: '/common/newsletter')
    onSuccess: (data) => {},           // Success callback
    onError: (error) => {},            // Error callback
    validatorOptions: {                // FormValidator options
        validateOnBlur: true,
        showErrors: true
    }
}
```

**HTML Example:**

```html
<form id="contact-form">
    <input type="text" name="name" required minlength="3">
    <input type="email" name="email" required>
    <textarea name="message" required minlength="10"></textarea>
    <button type="submit">Send</button>
</form>
<div id="messages"></div>
```

**Aliases:**

- `FormSubmitter` - Recommended for generic forms
- `Newsletter` - Backward compatible alias
- `Subscribe` - Deprecated alias

---

### Analytics

Standardized analytics tracking with Google Analytics integration.

```typescript
class Analytics {
    google: GoogleAnalyticsHelper
    constructor(options?: AnalyticsOptions)
    publish(data: any, callback?: AnalyticsCallback): Promise<any>
    trackPageView(url: string, callback?: AnalyticsCallback): void
    trackCmsPage(data: { categoryId: number, pageId?: number }, callback?: AnalyticsCallback): Promise<any>
    setOption(key: string, value: any): void
    getOption(key: string, defaultValue?: any): any
}
```

**Options:**

```javascript
{
    publishUrl: '/analytics/publish',           // Analytics endpoint
    enableGoogleAnalytics: true,                // Enable GA integration
    enableBeacon: true,                         // Use sendBeacon API
    onPublish: (data, response, meta) => {},   // Publish callback
    onError: (error, data) => {},              // Error callback
    onPageView: (data) => {},                  // Page view callback
    onEvent: (data) => {}                      // Event callback
}
```

**Google Analytics Helper:**

```javascript
// Track page view (Google Analytics only)
analytics.google.trackPageView('/home');

// Track event (Google Analytics only)
analytics.google.trackEventView('Category', 'Action', 'Label');
```

**HashtagCMS Analytics:**

```javascript
// Track CMS category view (HashtagCMS only)
analytics.trackCmsPage({
    categoryId: 1,      // Required
    pageId: 123         // Optional
});

// Track standard page view (Master method - triggers GA + callbacks)
analytics.trackPageView('/home');
```

---

### AppConfig

Centralized configuration management for your application.

```typescript
class AppConfig {
    constructor(data?: any)
    setConfigData(data: any): void
    getValue<T>(key: string, defaultVal?: T): T // Supports dot notation
    getMedia(path: string): string
    getAll(): Record<string, any>
    has(key: string): boolean
}
```

**Example:**

```javascript
const config = new AppConfig({
    media: { http_path: 'https://cdn.example.com' },
    site_name: 'My Site',
    api: {
        url: 'https://api.example.com',
        timeout: 5000
    }
});

// Get nested values
const apiUrl = config.getValue('api.url');
const timeout = config.getValue('api.timeout', 3000);

// Get media URLs
const imageUrl = config.getMedia('uploads/image.jpg');
// Returns: https://cdn.example.com/uploads/image.jpg

// Check existence
if (config.has('api.url')) {
    // API URL is configured
}

// Get all config
const allConfig = config.getAll();
```

---

## 🎨 Framework Integration Examples

### React

```jsx
import { useEffect, useState } from 'react';
import { FormValidator, Analytics } from '@hashtagcms/web-sdk';

function ContactForm() {
    const [validator, setValidator] = useState(null);

    useEffect(() => {
        const v = new FormValidator('#contact-form', {
            validateOnBlur: true,
            showErrors: true
        });
        setValidator(v);

        return () => v.reset();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        validator.validate((isValid, errors, formData) => {
            if (isValid) {
                // Submit form
                console.log('Form data:', formData);
            }
        });
    };

    return (
        <form id="contact-form" onSubmit={handleSubmit}>
            {/* Form fields */}
        </form>
    );
}
```

### Vue 3

```vue
<template>
    <form ref="contactForm" @submit.prevent="handleSubmit">
        <!-- Form fields -->
    </form>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { FormValidator } from '@hashtagcms/web-sdk';

const contactForm = ref(null);
let validator = null;

onMounted(() => {
    validator = new FormValidator(contactForm.value, {
        validateOnBlur: true,
        showErrors: true
    });
});

onUnmounted(() => {
    validator?.reset();
});

const handleSubmit = () => {
    validator.validate((isValid, errors, formData) => {
        if (isValid) {
            console.log('Form data:', formData);
        }
    });
};
</script>
```

### Angular

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormValidator } from '@hashtagcms/web-sdk';

@Component({
    selector: 'app-contact-form',
    templateUrl: './contact-form.component.html'
})
export class ContactFormComponent implements OnInit, OnDestroy {
    private validator: FormValidator;

    ngOnInit() {
        this.validator = new FormValidator('#contact-form', {
            validateOnBlur: true,
            showErrors: true
        });
    }

    ngOnDestroy() {
        this.validator.reset();
    }

    onSubmit() {
        this.validator.validate((isValid, errors, formData) => {
            if (isValid) {
                console.log('Form data:', formData);
            }
        });
    }
}
```

### Vanilla JavaScript

```javascript
import { FormSubmitter, Analytics } from '@hashtagcms/web-sdk';

// Initialize form
const form = new FormSubmitter({
    form: '#contact-form',
    messageHolder: '#messages',
    submitUrl: '/api/contact',
    onSuccess: (data) => {
        console.log('Success!', data);
    }
});

// Initialize analytics
const analytics = new Analytics();
analytics.trackCmsPage({ categoryId: 1 });
analytics.trackPageView('/home');
```

---

## 🧪 Testing

This SDK uses **Jest** for comprehensive testing.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Coverage:**
- ✅ Form validation rules
- ✅ Form submission handling
- ✅ Analytics tracking
- ✅ Configuration management
- ✅ Error handling
- ✅ Edge cases

---

## 🏗️ Building

```bash
# Development build with watch
npm run dev

# Production build
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

**Build Outputs:**
- `dist/index.js` - CommonJS build
- `dist/index.esm.js` - ES Module build
- `dist/index.umd.js` - UMD build (browser)

---

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | ✅ Latest 2 versions |
| Firefox | ✅ Latest 2 versions |
| Safari | ✅ Latest 2 versions |
| Edge | ✅ Latest 2 versions |
| IE | ❌ Not supported |

---

## 📖 Advanced Usage

### Custom Validation Rules

```javascript
import { FormValidator } from '@hashtagcms/web-sdk';

const validator = new FormValidator('#myForm');

// Add custom rule
validator.addRule('strongPassword', (value) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
}, 'Password must contain uppercase, lowercase, number, and special character');

// Use in HTML
// <input type="password" data-validate="required|strongPassword">
```

### Conditional Validation

```javascript
validator.addRule('requiredIf', (value, param, field) => {
    const conditionField = document.querySelector(`[name="${param}"]`);
    if (conditionField && conditionField.checked) {
        return value && value.trim().length > 0;
    }
    return true;
}, 'This field is required');

// <input type="checkbox" name="subscribe">
// <input type="email" name="email" data-validate="requiredIf:subscribe">
```

### Cross-Field Validation

```javascript
// Password confirmation
validator.addRule('match', (value, param) => {
    const otherField = document.querySelector(`[name="${param}"]`);
    return otherField && value === otherField.value;
}, 'Fields do not match');

// <input type="password" name="password">
// <input type="password" name="password_confirm" data-validate="match:password">
```

### Analytics with Custom Data

```javascript
import { Analytics } from '@hashtagcms/web-sdk';

const analytics = new Analytics({
    onPublish: (data, response, meta) => {
        console.log('Published:', data);
        console.log('Beacon sent:', meta.beaconSent);
    }
});

// Track with custom data
analytics.publish({
    event_type: 'custom_event',
    user_id: 123,
    metadata: {
        source: 'homepage',
        campaign: 'summer_sale'
    }
});
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/hashtagcms/web-sdk.git
cd web-sdk

# Install dependencies
npm install

# Run tests
npm test

# Start development build
npm run dev
```

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

### Latest Version: 1.0.3

- ✅ Enhanced documentation
- ✅ Updated email addresses
- ✅ Improved TypeScript definitions
- ✅ Bug fixes and performance improvements

---

## 🔗 Related Packages

- [@hashtagcms/web-ui-kit](https://github.com/hashtagcms/web-ui-kit) - UI components for Blade/PHP themes
- [@hashtagcms/admin-ui-kit](https://github.com/hashtagcms/admin-ui-kit) - Admin panel UI components
- [@hashtagcms/hashtagcms](https://github.com/hashtagcms/hashtagcms) - Core HashtagCMS package

---

## 📄 License

[MIT](LICENSE) © HashtagCMS

---

## 💬 Support

- 📧 **Email:** hashtagcms.org@gmail.com
- 💬 **Discussions:** [GitHub Discussions](https://github.com/hashtagcms/web-sdk/discussions)
- 🐛 **Issues:** [GitHub Issues](https://github.com/hashtagcms/web-sdk/issues)
- 📚 **Documentation:** [Full Documentation](./docs/)

---

## 🙏 Acknowledgments

Built with ❤️ by the HashtagCMS team and contributors.

Special thanks to all our [contributors](https://github.com/hashtagcms/web-sdk/graphs/contributors)!

---

<div align="center">

**[⬆ Back to Top](#hashtagcmsweb-sdk)**

Made with ❤️ for the HashtagCMS community

</div>
