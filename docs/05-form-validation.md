# Form Validation Guide

The `FormValidator` class provides comprehensive client-side form validation with 15+ built-in validation rules, custom rule support, and flexible configuration options.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Built-in Validation Rules](#built-in-validation-rules)
- [Configuration Options](#configuration-options)
- [HTML Markup](#html-markup)
- [Advanced Usage](#advanced-usage)
- [Custom Validation Rules](#custom-validation-rules)
- [Error Handling](#error-handling)
- [API Reference](#api-reference)

## Installation

```javascript
import { FormValidator, validateForm } from '@hashtagcms/web-sdk';
```

## Browser Usage (UMD)

If you are using the SDK via CDN, the validator is available on the global `HashtagCms` object:

```html
<script src="https://unpkg.com/@hashtagcms/web-sdk@latest/dist/index.umd.js"></script>
<script>
    const validator = new HashtagCms.FormValidator('#myForm');
</script>
```

## Quick Start

### Simple Function-based Validation

```javascript
import { validateForm } from '@hashtagcms/web-sdk';

validateForm('myForm', (isValid, errors, formData) => {
    if (isValid) {
        console.log('Form is valid!', formData);
        // Submit your form
    } else {
        console.log('Validation errors:', errors);
    }
});
```

### Class-based Validation with Options

```javascript
import { FormValidator } from '@hashtagcms/web-sdk';

const validator = new FormValidator('contactForm', {
    validateOnBlur: true,
    showErrors: true,
    errorClass: 'is-invalid',
    successClass: 'is-valid'
});

validator.validate((isValid, errors, formData) => {
    if (isValid) {
        // Submit form
        window.axios.post('/api/contact', formData);
    }
});
```

## Built-in Validation Rules

The FormValidator includes 15 built-in validation rules:

| Rule | Description | Example |
|------|-------------|---------|
| `required` | Field must have a value | `<input required>` |
| `email` | Valid email format | `<input type="email">` |
| `url` | Valid URL format | `<input type="url">` |
| `phone` | International phone number | `<input type="tel">` or `data-validate="phone"` |
| `number` | Valid number | `<input type="number">` |
| `integer` | Valid integer | `data-validate="integer"` |
| `min` | Minimum numeric value | `<input min="18">` |
| `max` | Maximum numeric value | `<input max="100">` |
| `minlength` | Minimum string length | `<input minlength="3">` |
| `maxlength` | Maximum string length | `<input maxlength="50">` |
| `pattern` | Custom regex pattern | `<input pattern="[A-Za-z]+">` |
| `alpha` | Only letters | `data-validate="alpha"` |
| `alphanumeric` | Only letters and numbers | `data-validate="alphanumeric"` |
| `date` | Valid date | `<input type="date">` |
| `match` | Match another field | `data-validate="match:password"` |

## Configuration Options

```javascript
const validator = new FormValidator('formId', {
    // Validation timing
    validateOnBlur: true,          // Validate when field loses focus (default: true)
    validateOnInput: false,        // Validate on every keystroke (default: false)
    validateOnSubmit: true,        // Validate on form submit (default: true)
    
    // Error display
    showErrors: true,              // Show error messages (default: true)
    errorClass: 'is-invalid',      // CSS class for invalid fields
    successClass: 'is-valid',      // CSS class for valid fields
    errorMessageClass: 'invalid-feedback', // CSS class for error messages
    
    // User experience
    scrollToError: true,           // Scroll to first error (default: false)
    focusOnError: true,            // Focus first error field (default: true)
    
    // Customization
    customRules: {},               // Add custom validation rules
    customMessages: {}             // Override default error messages
});
```

## HTML Markup

### Using HTML5 Attributes

```html
<form id="contactForm">
    <!-- Required field -->
    <input type="text" name="name" required>
    
    <!-- Email validation -->
    <input type="email" name="email" required>
    
    <!-- Number with min/max -->
    <input type="number" name="age" min="18" max="100" required>
    
    <!-- Text with length constraints -->
    <input type="text" name="username" minlength="3" maxlength="20" required>
    
    <!-- Pattern matching -->
    <input type="text" name="zipcode" pattern="[0-9]{5}" required>
    
    <button type="submit">Submit</button>
</form>
```

### Using data-validate Attribute

```html
<form id="registrationForm">
    <!-- Multiple rules with pipe separator -->
    <input type="text" name="phone" 
           data-validate="required|phone">
    
    <!-- Password with minimum length -->
    <input type="password" name="password" 
           data-validate="required|minlength:8">
    
    <!-- Confirm password (must match) -->
    <input type="password" name="confirm_password" 
           data-validate="required|match:password">
    
    <!-- Alpha characters only -->
    <input type="text" name="first_name" 
           data-validate="required|alpha">
    
    <!-- Alphanumeric only -->
    <input type="text" name="username" 
           data-validate="required|alphanumeric|minlength:3">
</form>
```

### Custom Error Messages

```html
<input type="email" 
       name="email" 
       required
       data-required-message="Please provide your email address"
       data-email-message="That doesn't look like a valid email">

<input type="password" 
       name="password" 
       data-validate="required|minlength:8"
       data-required-message="Password is required"
       data-minlength-message="Password must be at least 8 characters">
```

## Advanced Usage

### Real-time Validation

```javascript
const validator = new FormValidator('myForm', {
    validateOnInput: true,  // Validate as user types
    validateOnBlur: true    // Also validate on blur
});
```

### Validate Single Field

```javascript
const validator = new FormValidator('myForm');

// Validate a specific field
const emailField = document.getElementById('email');
const isValid = validator.validateField(emailField);

if (isValid) {
    console.log('Email is valid!');
}
```

### Get Form Data

```javascript
const validator = new FormValidator('myForm');

// Get all form data as an object
const formData = validator.getFormData();
console.log(formData);
// { name: 'John', email: 'john@example.com', age: '25' }
```

### Reset Form

```javascript
const validator = new FormValidator('myForm');

// Reset form and clear all errors
validator.reset();
```

### Check Validation Status

```javascript
const validator = new FormValidator('myForm');

validator.validate();

// Check if form is valid
if (validator.isValid()) {
    console.log('Form is valid!');
}

// Get all errors
const errors = validator.getErrors();
console.log(errors);
```

## Custom Validation Rules

### Adding Custom Rules

```javascript
const validator = new FormValidator('myForm');

// Add a custom rule for strong passwords
validator.addRule(
    'strongPassword',
    (value) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(value);
    },
    'Password must contain uppercase, lowercase, number and special character'
);

// Use in HTML
// <input type="password" data-validate="required|strongPassword">
```

### Custom Rule with Parameters

```javascript
validator.addRule(
    'minWords',
    (value, minWords) => {
        const words = value.trim().split(/\s+/);
        return words.length >= parseInt(minWords);
    },
    'Please enter at least {0} words'
);

// Use in HTML
// <textarea data-validate="required|minWords:10"></textarea>
```

### Global Custom Rules

```javascript
const validator = new FormValidator('myForm', {
    customRules: {
        creditCard: (value) => {
            // Luhn algorithm for credit card validation
            const digits = value.replace(/\D/g, '');
            let sum = 0;
            let isEven = false;
            
            for (let i = digits.length - 1; i >= 0; i--) {
                let digit = parseInt(digits[i]);
                if (isEven) {
                    digit *= 2;
                    if (digit > 9) digit -= 9;
                }
                sum += digit;
                isEven = !isEven;
            }
            
            return sum % 10 === 0;
        },
        
        uniqueUsername: async (value) => {
            // Async validation (returns Promise)
            const response = await axios.get(`/api/check-username/${value}`);
            return response.data.available;
        }
    },
    customMessages: {
        creditCard: 'Please enter a valid credit card number',
        uniqueUsername: 'This username is already taken'
    }
});
```

## Error Handling

### Error Object Structure

```javascript
validator.validate((isValid, errors, formData) => {
    if (!isValid) {
        console.log(errors);
        /* Output:
        {
            email: {
                field: HTMLInputElement,
                rule: 'email',
                message: 'Please enter a valid email address'
            },
            password: {
                field: HTMLInputElement,
                rule: 'minlength',
                message: 'Please enter at least 8 characters'
            }
        }
        */
    }
});
```

### Custom Error Display

```javascript
const validator = new FormValidator('myForm', {
    showErrors: false  // Disable automatic error display
});

validator.validate((isValid, errors, formData) => {
    if (!isValid) {
        // Custom error handling
        Object.keys(errors).forEach(fieldName => {
            const error = errors[fieldName];
            
            // Show toast notification
            showToast(error.message, 'error');
            
            // Or update a custom error container
            const errorContainer = document.getElementById(`${fieldName}-error`);
            if (errorContainer) {
                errorContainer.textContent = error.message;
                errorContainer.style.display = 'block';
            }
        });
    }
});
```

## API Reference

### Constructor

```javascript
new FormValidator(formElement, options)
```

**Parameters:**
- `formElement` (string|HTMLElement): Form ID, selector, or DOM element
- `options` (object): Configuration options (see Configuration Options section)

### Methods

#### `validate(callback)`
Validates the entire form and executes callback with results.

```javascript
validator.validate((isValid, errors, formData) => {
    // Handle validation result
});
```

**Returns:** `boolean` - Whether the form is valid

---

#### `validateField(field)`
Validates a single field.

```javascript
const isValid = validator.validateField(emailField);
```

**Parameters:**
- `field` (HTMLElement): The field to validate

**Returns:** `boolean` - Whether the field is valid

---

#### `addRule(name, validator, message)`
Adds a custom validation rule.

```javascript
validator.addRule('customRule', (value, param) => {
    return /* validation logic */;
}, 'Error message');
```

**Parameters:**
- `name` (string): Rule name
- `validator` (function): Validation function
- `message` (string): Error message (optional)

---

#### `getErrors()`
Returns all current validation errors.

```javascript
const errors = validator.getErrors();
```

**Returns:** `object` - Error object with field names as keys

---

#### `getFormData()`
Returns form data as an object.

```javascript
const data = validator.getFormData();
```

**Returns:** `object` - Form data

---

#### `reset()`
Resets the form and clears all errors.

```javascript
validator.reset();
```

---

#### `isValid()`
Checks if the form is currently valid.

```javascript
const valid = validator.isValid();
```

**Returns:** `boolean` - Whether the form is valid

## CSS Styling

The validator adds CSS classes to fields and creates error message elements. Here's a recommended CSS setup:

```css
/* Valid field styling */
.is-valid {
    border-color: #28a745;
    background-color: #f8fff9;
}

/* Invalid field styling */
.is-invalid {
    border-color: #dc3545;
    background-color: #fff8f8;
}

/* Error message styling */
.invalid-feedback {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: #dc3545;
}

/* Optional: Add icons */
.is-valid {
    background-image: url("data:image/svg+xml,...");
    background-repeat: no-repeat;
    background-position: right calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}
```

## Bootstrap Integration

The FormValidator works seamlessly with Bootstrap's form validation classes:

```html
<form id="myForm">
    <div class="form-group">
        <label for="email">Email</label>
        <input type="email" 
               class="form-control" 
               id="email" 
               name="email" 
               required>
        <!-- Error message will be inserted here automatically -->
    </div>
</form>

<script>
const validator = new FormValidator('myForm', {
    errorClass: 'is-invalid',
    successClass: 'is-valid',
    errorMessageClass: 'invalid-feedback'
});
</script>
```

## Best Practices

1. **Use HTML5 attributes when possible** - They're simpler and more semantic
2. **Combine client and server validation** - Never trust client-side validation alone
3. **Provide clear error messages** - Help users understand what went wrong
4. **Validate on blur for better UX** - Don't validate on every keystroke unless necessary
5. **Use custom rules for complex validation** - Keep your validation logic organized
6. **Test with different input types** - Ensure validation works with checkboxes, radios, selects, etc.

## Examples

### Complete Contact Form

```html
<form id="contactForm" class="needs-validation">
    <div class="form-group">
        <label for="name">Name *</label>
        <input type="text" 
               class="form-control" 
               id="name" 
               name="name" 
               required
               minlength="2"
               data-required-message="Please enter your name"
               data-minlength-message="Name must be at least 2 characters">
    </div>
    
    <div class="form-group">
        <label for="email">Email *</label>
        <input type="email" 
               class="form-control" 
               id="email" 
               name="email" 
               required
               data-required-message="Please enter your email"
               data-email-message="Please enter a valid email address">
    </div>
    
    <div class="form-group">
        <label for="phone">Phone</label>
        <input type="tel" 
               class="form-control" 
               id="phone" 
               name="phone"
               data-validate="phone"
               data-phone-message="Please enter a valid phone number">
    </div>
    
    <div class="form-group">
        <label for="message">Message *</label>
        <textarea class="form-control" 
                  id="message" 
                  name="message" 
                  required
                  minlength="10"
                  rows="4"></textarea>
    </div>
    
    <button type="submit" class="btn btn-primary">Submit</button>
</form>

<script>
import { FormValidator } from '@hashtagcms/web-sdk';

const validator = new FormValidator('contactForm', {
    validateOnBlur: true,
    showErrors: true,
    scrollToError: true
});

validator.validate((isValid, errors, formData) => {
    if (isValid) {
        window.axios.post('/api/contact', formData)
            .then(response => {
                alert('Message sent successfully!');
                validator.reset();
            })
            .catch(error => {
                alert('Error sending message');
            });
    }
});
</script>
