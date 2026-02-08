# Form Submission Guide (Contact)

The `Contact` component is a specialized version of `FormSubmitter` designed specifically for contact forms with built-in validation and message display.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Configuration Options](#configuration-options)
- [API Methods](#api-methods)
- [Simple Example](#simple-example)

```javascript
import { Contact } from '@hashtagcms/web-sdk';
```

## Browser Usage (UMD)

If you are using the SDK via CDN, the component is available on the global `HashtagCms` object:

```html
<script src="https://unpkg.com/@hashtagcms/web-sdk@latest/dist/index.umd.js"></script>
<script>
    const contactForm = new HashtagCms.Contact({
        form: '#contact-form',
        messageHolder: '#messages'
    });
</script>
```

## Basic Usage

```javascript
const contact = new Contact({
    form: '#contact-form',
    messageHolder: '#message-container',
    onSuccess: (data) => {
        console.log('Message sent!', data);
    },
    onError: (error) => {
        console.error('Submission failed', error);
    }
});
```

## Configuration Options

```javascript
new Contact({
    // Required
    form: '#form-id',              // Form element or selector (required)
    
    // Optional
    messageHolder: '#messages',    // Message container element or selector
    submitUrl: '/common/contact',  // Submit URL (default: '/common/contact')
    
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
contact.submit()
    .then(data => console.log('Success', data))
    .catch(error => console.error('Error', error));
```

### `contactNow()`
Alias for `submit()` method.

```javascript
contact.contactNow();
```

## Simple Example

```html
<form id="contact-form">
    <input type="text" name="name" required placeholder="Name">
    <input type="email" name="email" required placeholder="Email">
    <textarea name="comment" required placeholder="Comment"></textarea>
    <button type="submit">Send</button>
</form>

<div id="messages" style="display: none;">
    <span class="message"></span>
    <button class="close">×</button>
</div>

<script>
import { Contact } from '@hashtagcms/web-sdk';

const contact = new Contact({
    form: '#contact-form',
    messageHolder: '#messages'
});
</script>
```
