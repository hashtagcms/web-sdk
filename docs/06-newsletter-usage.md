# Form Submission Guide (FormSubmitter / Newsletter)

The `FormSubmitter` component (aliased as `Newsletter`) is a fully configurable, reusable form submission handler with built-in validation and message display.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Configuration Options](#configuration-options)
- [API Methods](#api-methods)
- [Usage Examples](#usage-examples)
- [Legacy Mode](#legacy-mode)
- [Callbacks](#callbacks)

```javascript
import { FormSubmitter } from '@hashtagcms/web-sdk';
// or
import { Newsletter } from '@hashtagcms/web-sdk';
```

## Browser Usage (UMD)

If you are using the SDK via CDN, the component is available on the global `HashtagCms` object:

```html
<script src="https://unpkg.com/@hashtagcms/web-sdk@latest/dist/index.umd.js"></script>
<script>
    const contactForm = new HashtagCms.FormSubmitter({
        form: '#contact-form',
        messageHolder: '#messages'
    });
</script>
```

## Basic Usage

```javascript
const formHandler = new FormSubmitter({
    form: '#newsletter-form',
    messageHolder: '#message-container',
    submitUrl: '/api/newsletter/subscribe',
    onSuccess: (data) => {
        console.log('Subscribed!', data);
    },
    onError: (error) => {
        console.error('Subscription failed', error);
    }
});
```

### Minimal Configuration

```javascript
// Only form is required
const newsletter = new Newsletter({
    form: '#my-form'
});
```

## Configuration Options

```javascript
new Newsletter({
    // Required
    form: '#form-id',              // Form element or selector (required)
    
    // Optional
    messageHolder: '#messages',    // Message container element or selector
    submitUrl: '/api/subscribe',   // Submit URL (default: '/common/newsletter')
    
    // Callbacks
    onSuccess: (data) => {},       // Success callback
    onError: (error) => {},        // Error callback
    
    // Validator options
    validatorOptions: {
        validateOnBlur: true,
        validateOnInput: false,
        errorClass: 'is-invalid',
        successClass: 'is-valid'
    }
});
```

## API Methods

### `submit()`
Submit the form programmatically.

```javascript
newsletter.submit()
    .then(data => console.log('Success', data))
    .catch(error => console.error('Error', error));
```

**Returns:** `Promise` - Resolves with response data or rejects with error

---

### `showMessage(message, type)`
Display a message in the message holder.

```javascript
newsletter.showMessage('Successfully subscribed!', 'success');
newsletter.showMessage('Invalid email address', 'error');
```

**Parameters:**
- `message` (string): Message to display
- `type` (string): 'success' or 'error' (default: 'success')

---

### `show()`
Show the message holder.

```javascript
newsletter.show();
```

---

### `close()`
Hide the message holder.

```javascript
newsletter.close();
```

---

### `newsletterNow()` / `subscribeNow()`
Alias for `submit()` method.

```javascript
newsletter.newsletterNow();
```

## Usage Examples

### Example 1: Simple Newsletter Form

```html
<form id="newsletter-form">
    <input type="email" name="email" required placeholder="Your email">
    <button type="submit">Subscribe</button>
</form>

<div id="messages" style="display: none;">
    <span class="message"></span>
    <button class="close">×</button>
</div>

<script>
import { Newsletter } from '@hashtagcms/web-sdk';

const newsletter = new Newsletter({
    form: '#newsletter-form',
    messageHolder: '#messages'
});
</script>
```

---

### Example 2: Contact Form with Custom URL

```html
<form id="contact-form">
    <input type="text" name="name" required placeholder="Name">
    <input type="email" name="email" required placeholder="Email">
    <textarea name="message" required placeholder="Message"></textarea>
    <button type="submit">Send</button>
</form>

<div id="contact-messages"></div>

<script>
const contactForm = new Newsletter({
    form: '#contact-form',
    messageHolder: '#contact-messages',
    submitUrl: '/api/contact',
    onSuccess: (data) => {
        alert('Message sent successfully!');
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = '/thank-you';
        }, 2000);
    }
});
</script>
```

---

### Example 3: Multiple Forms on Same Page

```html
<form id="header-newsletter">
    <input type="email" name="email" required>
    <button type="submit">Subscribe</button>
</form>

<form id="footer-newsletter">
    <input type="email" name="email" required>
    <button type="submit">Subscribe</button>
</form>

<script>
// Header newsletter
const headerNewsletter = new Newsletter({
    form: '#header-newsletter',
    submitUrl: '/api/newsletter',
    onSuccess: () => {
        alert('Thanks for subscribing from header!');
    }
});

// Footer newsletter
const footerNewsletter = new Newsletter({
    form: '#footer-newsletter',
    submitUrl: '/api/newsletter',
    onSuccess: () => {
        alert('Thanks for subscribing from footer!');
    }
});
</script>
```

---

### Example 4: Using DOM Elements Instead of Selectors

```javascript
const formElement = document.getElementById('my-form');
const messageContainer = document.querySelector('.messages');

const newsletter = new Newsletter({
    form: formElement,
    messageHolder: messageContainer,
    submitUrl: '/subscribe'
});
```

---

### Example 5: Programmatic Submission

```html
<form id="newsletter-form">
    <input type="email" name="email" required id="email-input">
</form>

<button id="custom-submit">Subscribe Now</button>

<script>
const newsletter = new Newsletter({
    form: '#newsletter-form'
});

// Custom submit button
document.getElementById('custom-submit').addEventListener('click', () => {
    newsletter.submit()
        .then(data => {
            console.log('Subscribed!', data);
        })
        .catch(error => {
            console.error('Failed', error);
        });
});
</script>
```

---

### Example 6: Custom Validation Options

```javascript
const newsletter = new Newsletter({
    form: '#newsletter-form',
    messageHolder: '#messages',
    validatorOptions: {
        validateOnBlur: true,
        validateOnInput: true,  // Real-time validation
        errorClass: 'error',
        successClass: 'valid',
        scrollToError: true,
        customRules: {
            businessEmail: (value) => {
                return !value.endsWith('@gmail.com') && !value.endsWith('@yahoo.com');
            }
        },
        customMessages: {
            businessEmail: 'Please use a business email address'
        }
    }
});
```

---

### Example 7: Advanced Callbacks

```javascript
const newsletter = new Newsletter({
    form: '#newsletter-form',
    messageHolder: '#messages',
    submitUrl: '/api/newsletter',
    
    onSuccess: (data) => {
        // Track with analytics
        if (window.gtag) {
            gtag('event', 'newsletter_signup', {
                method: 'website_form'
            });
        }
        
        // Show custom modal
        showSuccessModal(data.message);
        
        // Update UI
        document.getElementById('subscriber-count').textContent = data.total_subscribers;
    },
    
    onError: (error) => {
        // Log to error tracking service
        if (window.Sentry) {
            Sentry.captureException(new Error('Newsletter subscription failed'));
        }
        
        // Show custom error
        showErrorNotification(error.message);
    }
});
```

---

### Example 8: Without Message Holder

```javascript
// Form only, handle messages yourself
const newsletter = new Newsletter({
    form: '#newsletter-form',
    submitUrl: '/api/subscribe',
    onSuccess: (data) => {
        // Use your own notification system
        toastr.success(data.message);
    },
    onError: (error) => {
        toastr.error(error.message);
    }
});
```

## Legacy Mode

For backward compatibility, the Newsletter component supports legacy mode when called without options:

```javascript
// Legacy mode - automatically finds form with data attributes
const newsletter = new Newsletter();
```

**Required HTML structure for legacy mode:**

```html
<!-- Option 1: Newsletter selectors -->
<form data-form="newsletter-form">
    <input type="email" name="email" required>
    <button type="submit">Subscribe</button>
</form>

<div data-message-holder="newsletter-message-holder" style="display:none">
    <span data-class="newsletter-message"></span>
    <span data-class="newsletter-close">×</span>
</div>

<!-- Option 2: Subscribe selectors (fallback) -->
<form data-form="subscribe-form">
    <input type="email" name="email" required>
    <button type="submit">Subscribe</button>
</form>

<div data-message-holder="subscribe-message-holder" style="display:none">
    <span data-class="subscribe-message"></span>
    <span data-class="subscribe-close">×</span>
</div>
```

## Callbacks

### onSuccess Callback

Called when form submission is successful.

```javascript
onSuccess: (data) => {
    // data contains server response
    console.log(data.message);
    console.log(data.success);
}
```

**Data structure:**
```javascript
{
    success: true,
    message: "Successfully subscribed!",
    // ... other server response data
}
```

---

### onError Callback

Called when form submission fails or validation errors occur.

```javascript
onError: (error) => {
    // error contains error information
    console.log(error.message);
    console.log(error.errors);
}
```

**Error structure:**
```javascript
{
    success: false,
    message: "Invalid email address",
    errors: {
        email: ["The email field is required."]
    }
}
```

## Message Holder Structure

The message holder should contain elements for displaying messages and closing:

```html
<div id="message-holder" style="display: none;">
    <!-- Message will be displayed here -->
    <span class="message"></span>
    
    <!-- Optional close button -->
    <button class="close">×</button>
</div>
```

The component looks for:
- Elements with `data-class` attribute containing "message"
- Elements with class "message"
- Elements with `data-class` attribute containing "close"
- Elements with class "close"

## CSS Styling

### Basic Styles

```css
/* Message holder */
#message-holder {
    padding: 15px;
    margin: 10px 0;
    border-radius: 4px;
}

/* Success message */
.text-success {
    color: #28a745;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
}

/* Error message */
.text-danger {
    color: #dc3545;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
}

/* Close button */
.close {
    float: right;
    cursor: pointer;
    background: none;
    border: none;
    font-size: 1.5rem;
}

/* Form validation */
.is-invalid {
    border-color: #dc3545;
}

.is-valid {
    border-color: #28a745;
}

.invalid-feedback {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}
```

## Best Practices

1. **Always provide a form element** - It's the only required option
2. **Use callbacks for custom logic** - Don't modify the component, use callbacks
3. **Handle errors gracefully** - Provide meaningful error messages to users
4. **Validate on the server** - Client-side validation is not enough
5. **Use message holder for better UX** - Show feedback to users
6. **Customize validator options** - Tailor validation to your needs
7. **Test with different scenarios** - Valid input, invalid input, network errors

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .form-group { margin-bottom: 1rem; }
        .form-control { width: 100%; padding: 0.5rem; }
        .btn { padding: 0.5rem 1rem; cursor: pointer; }
        .message-holder { padding: 1rem; margin: 1rem 0; border-radius: 4px; }
        .text-success { color: #28a745; background: #d4edda; }
        .text-danger { color: #dc3545; background: #f8d7da; }
        .is-invalid { border-color: #dc3545; }
        .invalid-feedback { color: #dc3545; font-size: 0.875rem; }
    </style>
</head>
<body>
    <form id="newsletter-form">
        <div class="form-group">
            <label>Email Address</label>
            <input type="email" 
                   name="email" 
                   class="form-control" 
                   required 
                   placeholder="you@example.com">
        </div>
        <button type="submit" class="btn">Subscribe to Newsletter</button>
    </form>

    <div id="messages" class="message-holder" style="display: none;">
        <span class="message"></span>
        <button class="close" onclick="newsletter.close()">×</button>
    </div>

    <script type="module">
        import { Newsletter } from '@hashtagcms/web-sdk';

        const newsletter = new Newsletter({
            form: '#newsletter-form',
            messageHolder: '#messages',
            submitUrl: '/api/newsletter/subscribe',
            
            onSuccess: (data) => {
                console.log('Success!', data);
                
                // Track conversion
                if (window.gtag) {
                    gtag('event', 'conversion', {
                        'send_to': 'AW-XXXXXXXXX/XXXXXX',
                        'value': 1.0,
                        'currency': 'USD'
                    });
                }
            },
            
            onError: (error) => {
                console.error('Error:', error);
            },
            
            validatorOptions: {
                validateOnBlur: true,
                scrollToError: true
            }
        });
    </script>
</body>
</html>
```
