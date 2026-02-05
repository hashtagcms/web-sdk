import FormValidator from '../helpers/forms';

export default class Newsletter {
    /**
     * Create a Newsletter instance
     * @param {Object} options - Configuration options
     * @param {string|HTMLElement} options.form - Form element or selector
     * @param {string|HTMLElement} options.messageHolder - Message holder element or selector (optional)
     * @param {string} options.submitUrl - URL to submit the form data (default: '/common/newsletter')
     * @param {Function} options.onSuccess - Callback after successful submission (optional)
     * @param {Function} options.onError - Callback after error (optional)
     * @param {Object} options.validatorOptions - FormValidator options (optional)
     */
    constructor(options = {}) {
        // Handle backward compatibility - if called without options
        if (!options.form) {
            this._initLegacyMode();
            return;
        }

        // Get form element
        this.form = this._getElement(options.form);
        if (!this.form) {
            throw new Error('Newsletter: Form element not found');
        }

        // Get message holder element (optional)
        this.messageHolder = options.messageHolder ? this._getElement(options.messageHolder) : null;
        
        // Get message and close elements if messageHolder exists
        if (this.messageHolder) {
            this.messageElement = this.messageHolder.querySelector('[data-class*="message"]') || 
                                 this.messageHolder.querySelector('.message');
            this.closeElement = this.messageHolder.querySelector('[data-class*="close"]') || 
                               this.messageHolder.querySelector('.close');
        }

        // Configuration
        this.submitUrl = options.submitUrl || '/common/newsletter';
        this.onSuccess = options.onSuccess || null;
        this.onError = options.onError || null;

        // Initialize validator
        this.validator = new FormValidator(this.form, {
            validateOnBlur: true,
            validateOnInput: false,
            validateOnSubmit: false,
            showErrors: true,
            errorClass: 'is-invalid',
            successClass: 'is-valid',
            errorMessageClass: 'invalid-feedback',
            ...(options.validatorOptions || {})
        });

        this._init();
    }

    /**
     * Legacy mode initialization for backward compatibility
     * @private
     */
    _initLegacyMode() {
        this.isLegacyMode = true;
        
        // Try to find newsletter form first, then subscribe form
        let formSelector = "form[data-form='newsletter-form']";
        this.form = document.querySelector(formSelector);
        
        if (!this.form) {
            formSelector = "form[data-form='subscribe-form']";
            this.form = document.querySelector(formSelector);
        }

        if (!this.form) {
            console.warn('Newsletter: No form found in legacy mode');
            return;
        }

        // Determine which selectors to use based on found form
        const isNewsletter = formSelector.includes('newsletter');
        const prefix = isNewsletter ? 'newsletter' : 'subscribe';

        this.messageHolder = document.querySelector(`div[data-message-holder='${prefix}-message-holder']`);
        this.messageElement = document.querySelector(`span[data-class='${prefix}-message']`);
        this.closeElement = document.querySelector(`span[data-class='${prefix}-close']`);
        
        this.submitUrl = '/common/newsletter';
        this.onSuccess = null;
        this.onError = null;

        // Initialize validator
        this.validator = new FormValidator(this.form, {
            validateOnBlur: true,
            validateOnInput: false,
            validateOnSubmit: false,
            showErrors: true,
            errorClass: 'is-invalid',
            successClass: 'is-valid',
            errorMessageClass: 'invalid-feedback'
        });

        this._init();
    }

    /**
     * Get DOM element from selector or element
     * @private
     */
    _getElement(selectorOrElement) {
        if (typeof selectorOrElement === 'string') {
            return document.querySelector(selectorOrElement) || document.getElementById(selectorOrElement);
        }
        return selectorOrElement;
    }

    /**
     * Initialize the component
     * @private
     */
    _init() {
        // Bind form submit event
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submit();
            });
        }

        // Bind close button if exists
        if (this.closeElement) {
            this.closeElement.addEventListener('click', () => {
                this.close();
            });
        }
    }

    /**
     * Submit the newsletter form
     * @returns {Promise|boolean}
     */
    submit() {
        // Validate form before submission
        if (this.validator) {
            const isValid = this.validator.validate();
            if (!isValid) {
                // Show validation errors
                const errors = this.validator.getErrors();
                const firstError = Object.values(errors)[0];
                if (firstError) {
                    this.showMessage(firstError.message, 'error');
                    this.show();
                }
                
                // Call error callback if provided
                if (this.onError) {
                    this.onError({ success: false, message: firstError.message, errors });
                }
                
                return false;
            }
        }

        // Get form data
        const formData = this.validator ? this.validator.getFormData() : this._getFormData();

        // Submit to server
        return axios.post(this.submitUrl, formData)
            .then(response => {
                // Check if response indicates success or error
                if (response.data.success === false) {
                    this._handleError(response.data);
                    return response.data;
                }
                this._handleSuccess(response.data);
                return response.data;
            })
            .catch(error => {
                this._handleError(error.response ? error.response.data : { message: 'Network error' });
                throw error;
            });
    }

    /**
     * Handle successful submission
     * @private
     */
    _handleSuccess(data) {
        console.log("Newsletter submission success:", data);
        
        this.showMessage(data.message || 'Successfully subscribed!', 'success');
        this.show();
        
        // Clear form
        if (this.form) {
            this.form.reset();
        }
        
        // Reset validator
        if (this.validator) {
            this.validator.reset();
        }

        // Call success callback if provided
        if (this.onSuccess) {
            this.onSuccess(data);
        }
    }

    /**
     * Handle submission error
     * @private
     */
    _handleError(data) {
        console.log("Newsletter submission error:", data);
        
        let errorMsg = 'There was an error. Please try again.';
        
        if (data.message) {
            if (typeof data.message === 'object' && data.message.email && data.message.email[0]) {
                errorMsg = data.message.email[0];
            } else if (typeof data.message === 'string') {
                errorMsg = data.message;
            }
        }
        
        this.showMessage(errorMsg, 'error');
        this.show();

        // Call error callback if provided
        if (this.onError) {
            this.onError(data);
        }
    }

    /**
     * Get form data as object (fallback if no validator)
     * @private
     */
    _getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }

    /**
     * Show message with appropriate styling
     * @param {string} message - Message to display
     * @param {string} type - Message type ('success' or 'error')
     */
    showMessage(message, type = 'success') {
        if (!this.messageElement) return;

        this.messageElement.innerText = message;
        
        if (type === 'success') {
            this.messageElement.classList.remove("text-danger");
            this.messageElement.classList.add("text-success");
        } else {
            this.messageElement.classList.remove("text-success");
            this.messageElement.classList.add("text-danger");
        }
    }

    /**
     * Close/hide the message holder
     */
    close() {
        if (this.messageHolder) {
            this.messageHolder.style.display = "none";
        }
    }

    /**
     * Show the message holder
     */
    show() {
        if (this.messageHolder) {
            this.messageHolder.style.display = "";
        }
    }

    /**
     * Programmatically trigger newsletter submission
     * @returns {Promise|boolean}
     */
    newsletterNow() {
        return this.submit();
    }

    /**
     * Alias for submit/newsletterNow
     * @deprecated Use submit() or newsletterNow() instead
     */
    subscribeNow() {
        return this.submit();
    }
}
