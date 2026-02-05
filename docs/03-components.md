# Component Documentation

## `FormSubmitter` / `Newsletter`

A fully configurable, reusable form submission handler with built-in validation and message display. It is exported as both `FormSubmitter` (recommended for general forms) and `Newsletter` (for backward compatibility).

### Modern Usage (Recommended)
```javascript
import { FormSubmitter } from '@hashtagcms/web-sdk';

const contactForm = new FormSubmitter({
    form: '#contact-form',              // Required: form element or selector
    messageHolder: '#messages',         // Optional: message container
    submitUrl: '/api/contact',          // Optional: submit URL (default: '/common/newsletter')
    onSuccess: (data) => {              // Optional: success callback
        console.log('Submitted!', data);
    },
    onError: (error) => {               // Optional: error callback
        console.error('Error:', error);
    },
    validatorOptions: {                 // Optional: FormValidator options
        validateOnBlur: true
    }
});
```

### Configuration Options
- `form` (required): Form element or selector.
- `messageHolder` (optional): Message container element or selector.
- `submitUrl` (optional): URL to submit form data (default: `/common/newsletter`).
- `onSuccess` (optional): Callback function called on successful submission.
- `onError` (optional): Callback function called on error.
- `validatorOptions` (optional): Options to pass to `FormValidator`.

### Methods
- `submit()`: Submit the form programmatically (returns Promise).
- `showMessage(message, type)`: Display a custom message ('success' or 'error').
- `show()`: Show the message holder.
- `close()`: Hide the message holder.
- `newsletterNow()`: Alias for `submit()`.

---

## `FormValidator`

Comprehensive form validation with 15+ built-in rules, custom rule support, and flexible configuration.

### Usage
```javascript
import { FormValidator } from '@hashtagcms/web-sdk';

const validator = new FormValidator('myForm', {
    validateOnBlur: true,
    showErrors: true,
    errorClass: 'is-invalid',
    successClass: 'is-valid'
});

validator.validate((isValid, errors, formData) => {
    if (isValid) {
        // Form is valid, formData is ready for submission
    }
});
```

### Built-in Validation Rules
- `required` - Field must have a value.
- `email` - Valid email format.
- `url` - Valid URL format.
- `phone` - International phone number.
- `number` - Valid number.
- `integer` - Valid integer.
- `min` / `max` - Numeric range.
- `minlength` / `maxlength` - String length range.
- `pattern` - Custom regex pattern.
- `alpha` / `alphanumeric` - Character restrictions.
- `date` - Valid date.
- `match` - Match another field (e.g., password confirmation).

### Methods
- `validate(callback)`: Validates entire form.
- `validateField(field)`: Validates a single field.
- `addRule(name, validator, message)`: Add custom validation rule.
- `getErrors()`: Get all validation errors.
- `getFormData()`: Get form data as object.
- `reset()`: Reset form and clear errors.

---

## `Analytics`

Provides a unified interface for tracking page views and custom events with Google Analytics integration.

### Methods
- `trackPageView(url, callback?)` - Master method for tracking page views (GA + Callbacks).
- `trackCmsPage(data, callback?)`: Tracks a CMS category page view (HashtagCMS Server).
- `publish(data, callback)`: Submits arbitrary analytics data to the server.
- `google.trackPageView(url)`: Track page view on Google Analytics only.
- `google.trackEventView(category, action, value)`: Track event on Google Analytics only.

### Example
```javascript
import { Analytics } from '@hashtagcms/web-sdk';

const analytics = new Analytics({
    enableGoogleAnalytics: true
});

// Track CMS page view for HashtagCMS
analytics.trackCmsPage({ 
    categoryId: 1, 
    pageId: 123 
});

// Track standard page view (Master method)
analytics.trackPageView('/home');

// Track custom event for Google Analytics
analytics.google.trackEventView('Button', 'Click', 'Contact Us');
```

---

## `AppConfig`

Manages configuration data and media paths provided by the CMS backend.

### Methods
- `getValue(key, defaultVal)`: Safely retrieve a value using dot notation (e.g., `api.url`).
- `getMedia(path)`: Constructs a full URL for a media asset using the configured media path.
- `setConfigData(data)`: Update the configuration object.

### Example
```javascript
import { AppConfig } from '@hashtagcms/web-sdk';

const config = new AppConfig(window.HashtagCms.configData);

const siteName = config.getValue('site_name', 'Default Site');
const logoUrl = config.getMedia('logo.png');
```

