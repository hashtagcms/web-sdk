/**
 * Comprehensive Form Validator
 * Validates form fields with built-in and custom validation rules
 * @module FormValidator
 */

/**
 * Default validation rules
 */
const defaultRules = {
    required: (value) => {
        if (typeof value === 'string') {
            return value.trim().length > 0;
        }
        return value !== null && value !== undefined && value !== '';
    },
    
    email: (value) => {
        if (!value) return true; // Only validate if value exists
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },
    
    url: (value) => {
        if (!value) return true;
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    },
    
    number: (value) => {
        if (!value) return true;
        return !isNaN(value) && !isNaN(parseFloat(value));
    },
    
    integer: (value) => {
        if (!value) return true;
        return Number.isInteger(Number(value));
    },
    
    min: (value, min) => {
        if (!value) return true;
        const num = parseFloat(value);
        return !isNaN(num) && num >= parseFloat(min);
    },
    
    max: (value, max) => {
        if (!value) return true;
        const num = parseFloat(value);
        return !isNaN(num) && num <= parseFloat(max);
    },
    
    minlength: (value, length) => {
        if (!value) return true;
        return value.toString().length >= parseInt(length);
    },
    
    maxlength: (value, length) => {
        if (!value) return true;
        return value.toString().length <= parseInt(length);
    },
    
    pattern: (value, pattern) => {
        if (!value) return true;
        const regex = new RegExp(pattern);
        return regex.test(value);
    },
    
    phone: (value) => {
        if (!value) return true;
        // International phone number format
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
        return phoneRegex.test(value.replace(/\s/g, ''));
    },
    
    alphanumeric: (value) => {
        if (!value) return true;
        return /^[a-zA-Z0-9]+$/.test(value);
    },
    
    alpha: (value) => {
        if (!value) return true;
        return /^[a-zA-Z]+$/.test(value);
    },
    
    date: (value) => {
        if (!value) return true;
        const date = new Date(value);
        return date instanceof Date && !isNaN(date);
    },
    
    match: (value, matchFieldId) => {
        const matchField = document.getElementById(matchFieldId) || document.querySelector(matchFieldId);
        if (!matchField) return true;
        return value === matchField.value;
    }
};

/**
 * Default error messages
 */
const defaultMessages = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    url: 'Please enter a valid URL',
    number: 'Please enter a valid number',
    integer: 'Please enter a valid integer',
    min: 'Value must be at least {0}',
    max: 'Value must be at most {0}',
    minlength: 'Please enter at least {0} characters',
    maxlength: 'Please enter no more than {0} characters',
    pattern: 'Please match the requested format',
    phone: 'Please enter a valid phone number',
    alphanumeric: 'Please use only letters and numbers',
    alpha: 'Please use only letters',
    date: 'Please enter a valid date',
    match: 'Fields do not match'
};

/**
 * Form Validator Class
 */
class FormValidator {
    constructor(formElement, options = {}) {
        this.form = this._getFormElement(formElement);
        if (!this.form) {
            throw new Error('Form element not found');
        }
        
        this.options = {
            validateOnBlur: options.validateOnBlur !== false,
            validateOnInput: options.validateOnInput || false,
            validateOnSubmit: options.validateOnSubmit !== false,
            showErrors: options.showErrors !== false,
            errorClass: options.errorClass || 'is-invalid',
            successClass: options.successClass || 'is-valid',
            errorMessageClass: options.errorMessageClass || 'invalid-feedback',
            customRules: options.customRules || {},
            customMessages: options.customMessages || {},
            scrollToError: options.scrollToError || false,
            focusOnError: options.focusOnError !== false
        };
        
        this.rules = { ...defaultRules, ...this.options.customRules };
        this.messages = { ...defaultMessages, ...this.options.customMessages };
        this.errors = {};
        
        this._init();
    }
    
    /**
     * Get form element from ID or selector
     */
    _getFormElement(idOrElement) {
        if (typeof idOrElement === 'string') {
            return document.getElementById(idOrElement) || document.querySelector(idOrElement);
        }
        return idOrElement;
    }
    
    /**
     * Initialize validator
     */
    _init() {
        if (this.options.validateOnSubmit) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validate();
            });
        }
        
        if (this.options.validateOnBlur || this.options.validateOnInput) {
            const fields = this.form.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                if (this.options.validateOnBlur) {
                    field.addEventListener('blur', () => this.validateField(field));
                }
                if (this.options.validateOnInput) {
                    field.addEventListener('input', () => this.validateField(field));
                }
            });
        }
    }
    
    /**
     * Get validation rules for a field
     */
    _getFieldRules(field) {
        const rules = [];
        
        // HTML5 validation attributes
        if (field.hasAttribute('required')) {
            rules.push({ name: 'required' });
        }
        
        const type = field.getAttribute('type');
        if (type === 'email') {
            rules.push({ name: 'email' });
        } else if (type === 'url') {
            rules.push({ name: 'url' });
        } else if (type === 'number') {
            rules.push({ name: 'number' });
        } else if (type === 'tel') {
            rules.push({ name: 'phone' });
        } else if (type === 'date') {
            rules.push({ name: 'date' });
        }
        
        if (field.hasAttribute('min')) {
            rules.push({ name: 'min', param: field.getAttribute('min') });
        }
        
        if (field.hasAttribute('max')) {
            rules.push({ name: 'max', param: field.getAttribute('max') });
        }
        
        if (field.hasAttribute('minlength')) {
            rules.push({ name: 'minlength', param: field.getAttribute('minlength') });
        }
        
        if (field.hasAttribute('maxlength')) {
            rules.push({ name: 'maxlength', param: field.getAttribute('maxlength') });
        }
        
        if (field.hasAttribute('pattern')) {
            rules.push({ name: 'pattern', param: field.getAttribute('pattern') });
        }
        
        // Custom data attributes
        if (field.hasAttribute('data-validate')) {
            const customRules = field.getAttribute('data-validate').split('|');
            customRules.forEach(rule => {
                const [name, param] = rule.split(':');
                rules.push({ name: name.trim(), param: param ? param.trim() : undefined });
            });
        }
        
        return rules;
    }
    
    /**
     * Get field value
     */
    _getFieldValue(field) {
        if (field.type === 'checkbox') {
            return field.checked;
        } else if (field.type === 'radio') {
            const checked = this.form.querySelector(`input[name="${field.name}"]:checked`);
            return checked ? checked.value : '';
        }
        return field.value;
    }
    
    /**
     * Get error message for a rule
     */
    _getErrorMessage(ruleName, param, field) {
        // Check for custom message on field
        const customMsg = field.getAttribute(`data-${ruleName}-message`);
        if (customMsg) {
            return customMsg;
        }
        
        // Check for field-specific custom message
        const fieldName = field.getAttribute('name') || field.getAttribute('id');
        if (this.messages[fieldName] && this.messages[fieldName][ruleName]) {
            return this.messages[fieldName][ruleName];
        }
        
        // Use default message
        let message = this.messages[ruleName] || 'Invalid value';
        
        // Replace placeholders
        if (param !== undefined) {
            message = message.replace('{0}', param);
        }
        
        return message;
    }
    
    /**
     * Validate a single field
     */
    validateField(field) {
        const fieldName = field.getAttribute('name') || field.getAttribute('id');
        const value = this._getFieldValue(field);
        const rules = this._getFieldRules(field);
        
        // Clear previous errors for this field
        delete this.errors[fieldName];
        
        // Validate each rule
        for (const rule of rules) {
            const validator = this.rules[rule.name];
            
            if (!validator) {
                console.warn(`Validation rule "${rule.name}" not found`);
                continue;
            }
            
            const isValid = rule.param !== undefined 
                ? validator(value, rule.param, field)
                : validator(value, field);
            
            if (!isValid) {
                const errorMessage = this._getErrorMessage(rule.name, rule.param, field);
                this.errors[fieldName] = {
                    field: field,
                    rule: rule.name,
                    message: errorMessage
                };
                break; // Stop at first error
            }
        }
        
        // Update UI
        if (this.options.showErrors) {
            this._updateFieldUI(field, fieldName);
        }
        
        return !this.errors[fieldName];
    }
    
    /**
     * Update field UI with error/success state
     */
    _updateFieldUI(field, fieldName) {
        const hasError = !!this.errors[fieldName];
        
        // Remove existing classes
        field.classList.remove(this.options.errorClass, this.options.successClass);
        
        // Add appropriate class
        if (hasError) {
            field.classList.add(this.options.errorClass);
        } else if (field.value) {
            field.classList.add(this.options.successClass);
        }
        
        // Handle error message
        this._removeErrorMessage(field);
        
        if (hasError) {
            this._showErrorMessage(field, this.errors[fieldName].message);
        }
    }
    
    /**
     * Show error message
     */
    _showErrorMessage(field, message) {
        const errorElement = document.createElement('div');
        errorElement.className = this.options.errorMessageClass;
        errorElement.textContent = message;
        errorElement.setAttribute('data-error-for', field.getAttribute('name') || field.getAttribute('id'));
        
        // Insert after field or its parent wrapper
        const wrapper = field.closest('.form-group') || field.closest('.form-field') || field.parentElement;
        wrapper.appendChild(errorElement);
    }
    
    /**
     * Remove error message
     */
    _removeErrorMessage(field) {
        const fieldName = field.getAttribute('name') || field.getAttribute('id');
        const wrapper = field.closest('.form-group') || field.closest('.form-field') || field.parentElement;
        const existingError = wrapper.querySelector(`[data-error-for="${fieldName}"]`);
        
        if (existingError) {
            existingError.remove();
        }
    }
    
    /**
     * Validate entire form
     */
    validate(callback) {
        this.errors = {};
        
        const fields = this.form.querySelectorAll('input:not([type="submit"]):not([type="button"]), select, textarea');
        
        fields.forEach(field => {
            // Skip disabled fields
            if (field.disabled) return;
            
            this.validateField(field);
        });
        
        const isValid = Object.keys(this.errors).length === 0;
        
        // Focus on first error
        if (!isValid && this.options.focusOnError) {
            const firstError = Object.values(this.errors)[0];
            if (firstError && firstError.field) {
                firstError.field.focus();
                
                if (this.options.scrollToError) {
                    firstError.field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
        
        // Execute callback
        if (typeof callback === 'function') {
            callback(isValid, this.errors, this.getFormData());
        }
        
        return isValid;
    }
    
    /**
     * Get form data as object
     */
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            // Handle multiple values (like checkboxes with same name)
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }
    
    /**
     * Reset form and clear errors
     */
    reset() {
        this.form.reset();
        this.errors = {};
        
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.classList.remove(this.options.errorClass, this.options.successClass);
            this._removeErrorMessage(field);
        });
    }
    
    /**
     * Add custom validation rule
     */
    addRule(name, validator, message) {
        this.rules[name] = validator;
        if (message) {
            this.messages[name] = message;
        }
    }
    
    /**
     * Get all errors
     */
    getErrors() {
        return this.errors;
    }
    
    /**
     * Check if form is valid
     */
    isValid() {
        return Object.keys(this.errors).length === 0;
    }
}

/**
 * Simple function-based validator (backward compatible)
 */
export function validateForm(idOrElement, callback) {
    const validator = new FormValidator(idOrElement, {
        validateOnSubmit: false
    });
    
    validator.validate(callback);
}

/**
 * Export the FormValidator class as default
 */
export default FormValidator;
