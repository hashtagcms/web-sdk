// Type definitions for @hashtagcms/web-sdk
// Project: https://github.com/hashtagcms/web-sdk
// Definitions by: HashtagCMS Team

declare module '@hashtagcms/web-sdk' {
    // ==================== FormValidator ====================

    /**
     * Form validation class with built-in and custom rules
     */
    export class FormValidator {
        /**
         * Create a FormValidator instance
         * @param form - Form element or selector string
         * @param options - Validation options
         */
        constructor(form: string | HTMLFormElement, options?: FormValidatorOptions);

        /**
         * Validate the entire form
         * @param callback - Optional callback with validation results
         * @returns True if valid, false otherwise
         */
        validate(callback?: ValidationCallback): boolean;

        /**
         * Validate a single field
         * @param field - Field element to validate
         * @returns True if valid, false otherwise
         */
        validateField(field: HTMLElement): boolean;

        /**
         * Add a custom validation rule
         * @param name - Rule name
         * @param validator - Validator function
         * @param message - Error message template
         */
        addRule(name: string, validator: ValidatorFunction, message?: string): void;

        /**
         * Get all validation errors
         * @returns Object containing all errors
         */
        getErrors(): ValidationErrors;

        /**
         * Get form data as an object
         * @returns Form data object
         */
        getFormData(): Record<string, any>;

        /**
         * Reset the form and clear all errors
         */
        reset(): void;

        /**
         * Check if form is currently valid
         * @returns True if valid, false otherwise
         */
        isValid(): boolean;
    }

    /**
     * Simple form validation function
     * @param formElement - Form element or selector
     * @param callback - Callback with validation results
     */
    export function validateForm(
        formElement: string | HTMLFormElement,
        callback: ValidationCallback
    ): void;

    /**
     * FormValidator configuration options
     */
    export interface FormValidatorOptions {
        /** Validate fields on blur event */
        validateOnBlur?: boolean;
        /** Validate fields on input event */
        validateOnInput?: boolean;
        /** Validate form on submit event */
        validateOnSubmit?: boolean;
        /** Show error messages in DOM */
        showErrors?: boolean;
        /** CSS class for invalid fields */
        errorClass?: string;
        /** CSS class for valid fields */
        successClass?: string;
        /** CSS class for error message elements */
        errorMessageClass?: string;
        /** Scroll to first error on validation */
        scrollToError?: boolean;
        /** Focus first error field on validation */
        focusOnError?: boolean;
        /** Custom validation rules */
        customRules?: Record<string, ValidatorFunction>;
        /** Custom error messages */
        customMessages?: Record<string, string>;
    }

    /**
     * Validator function type
     */
    export type ValidatorFunction = (
        value: any,
        param?: any,
        field?: HTMLElement
    ) => boolean;

    /**
     * Validation callback function type
     */
    export type ValidationCallback = (
        isValid: boolean,
        errors: ValidationErrors,
        formData: Record<string, any>
    ) => void;

    /**
     * Validation errors object
     */
    export interface ValidationErrors {
        [fieldName: string]: {
            field: HTMLElement;
            rule: string;
            message: string;
        };
    }

    // ==================== Newsletter / FormSubmitter ====================

    /**
     * Form submission handler with validation and callbacks
     * Also exported as Newsletter for backward compatibility
     */
    export class FormSubmitter {
        /**
         * Create a FormSubmitter instance
         * @param options - Configuration options
         */
        constructor(options?: FormSubmitterOptions);

        /**
         * Submit the form programmatically
         * @returns Promise resolving with response data
         */
        submit(): Promise<any>;

        /**
         * Show a message in the message holder
         * @param message - Message text
         * @param type - Message type ('success' or 'error')
         */
        showMessage(message: string, type?: 'success' | 'error'): void;

        /**
         * Show the message holder
         */
        show(): void;

        /**
         * Hide the message holder
         */
        close(): void;

        /**
         * Alias for submit()
         * @returns Promise resolving with response data
         */
        newsletterNow(): Promise<any>;

        /**
         * Deprecated alias for submit()
         * @deprecated Use submit() instead
         * @returns Promise resolving with response data
         */
        subscribeNow(): Promise<any>;
    }

    /**
     * Newsletter component (alias for FormSubmitter)
     */
    export class Newsletter extends FormSubmitter {}

    /**
     * Subscribe component (alias for FormSubmitter)
     * @deprecated Use FormSubmitter or Newsletter instead
     */
    export class Subscribe extends FormSubmitter {}

    /**
     * FormSubmitter/Newsletter configuration options
     */
    export interface FormSubmitterOptions {
        /** Form element or selector (required) */
        form: string | HTMLFormElement;
        /** Message holder element or selector */
        messageHolder?: string | HTMLElement;
        /** URL to submit form data to */
        submitUrl?: string;
        /** Success callback function */
        onSuccess?: (data: any) => void;
        /** Error callback function */
        onError?: (error: any) => void;
        /** FormValidator options */
        validatorOptions?: FormValidatorOptions;
    }

    // ==================== Analytics ====================

    /**
     * Analytics tracking utility with configurable URLs and callbacks
     */
    export class Analytics {
        /** Google Analytics helper */
        google: GoogleAnalyticsHelper;

        /**
         * Create an Analytics instance
         * @param options - Configuration options
         */
        constructor(options?: AnalyticsOptions);

        /**
         * Publish analytics data to server
         * @param data - Analytics data
         * @param callback - Optional callback
         * @returns Promise resolving with response
         */
        publish(data: any, callback?: AnalyticsCallback): Promise<any>;

        /**
         * Submit HTTP request
         * @param requestType - HTTP method (get, post, etc.)
         * @param url - Request URL
         * @param data - Request data
         * @returns Promise resolving with response
         */
        submit(requestType: string, url: string, data: any): Promise<any>;

        /**
         * Track a page view across all configured systems (Google Analytics, Callbacks, etc.)
         * @param url - Page URL to track
         * @param callback - Optional callback
         */
        trackPageView(url: string, callback?: AnalyticsCallback): void;

        /**
         * Track a CMS-category page view for the HashtagCMS server
         * @param data - Page view data
         * @param data.categoryId - Category ID (required, must be integer)
         * @param data.pageId - Page ID (optional, must be integer if provided)
         * @param callback - Optional callback after tracking
         * @returns Promise resolving with response
         * @throws Error if categoryId is missing or invalid, or if pageId is invalid
         */
        trackCmsPage(
            data: {
                categoryId: number;
                pageId?: number;
                [key: string]: any;
            },
            callback?: AnalyticsCallback
        ): Promise<any>;

        /**
         * Set a configuration option
         * @param key - Option key
         * @param value - Option value
         */
        setOption(key: string, value: any): void;

        /**
         * Get a configuration option
         * @param key - Option key
         * @param defaultValue - Default value if not found
         * @returns Option value
         */
        getOption(key: string, defaultValue?: any): any;
    }

    /**
     * Google Analytics Helper
     * Provides Google Analytics specific tracking methods
     */
    export interface GoogleAnalyticsHelper {
        /**
         * Track a page view with Google Analytics only
         * @param url - Page URL to track
         * @param callback - Optional callback
         */
        trackPageView(url: string, callback?: () => void): void;

        /**
         * Track an event with Google Analytics only
         * @param category - Event category
         * @param action - Event action
         * @param value - Event value/label
         * @param callback - Optional callback
         */
        trackEventView(
            category: string,
            action: string,
            value: string,
            callback?: () => void
        ): void;
    }

    /**
     * Analytics configuration options
     */
    export interface AnalyticsOptions {
        /** URL for publishing analytics (default: '/analytics/publish') */
        publishUrl?: string;
        /** Callback after analytics publish */
        onPublish?: (data: any, response?: any, meta?: { beaconSent: boolean }) => void;
        /** Callback on publish error */
        onError?: (error: any, data?: any) => void;
        /** Callback after page view tracking */
        onPageView?: (data: { url: string }) => void;
        /** Callback after event tracking */
        onEvent?: (data: { category: string; action: string; value: string }) => void;
        /** Enable Google Analytics integration (default: true) */
        enableGoogleAnalytics?: boolean;
        /** Use sendBeacon API if available, fallback to axios (default: true) */
        enableBeacon?: boolean;
    }

    /**
     * Analytics callback function type
     */
    export type AnalyticsCallback = (error?: any, response?: any) => void;


    // ==================== AppConfig ====================

    /**
     * Application configuration manager
     */
    export class AppConfig {
        /**
         * Create an AppConfig instance
         * @param data - Configuration data (object or JSON string)
         */
        constructor(data?: any);

        /**
         * Set configuration data
         * @param data - Configuration data (object or JSON string)
         */
        setConfigData(data: any): void;

        /**
         * Get a configuration value by key
         * @param key - Configuration key
         * @param defaultVal - Default value if key not found
         * @returns Configuration value or default
         */
        getValue<T = any>(key: string, defaultVal?: T): T;

        /**
         * Get full media URL path
         * @param path - Relative media path
         * @returns Full media URL
         */
        getMedia(path: string): string;

        /**
         * Get all configuration data
         * @returns All configuration data
         */
        getAll(): Record<string, any>;

        /**
         * Check if a key exists in configuration
         * @param key - Configuration key
         * @returns True if key exists
         */
        has(key: string): boolean;
    }

    // ==================== Default Export ====================

    /**
     * Default export is FormValidator
     */
    const defaultExport: typeof FormValidator;
    export default defaultExport;
}

// ==================== Global Augmentation ====================

/**
 * Extend Window interface for global axios
 */
declare global {
    interface Window {
        axios?: any;
        HashtagCms?: {
            configData?: any;
            [key: string]: any;
        };
    }
}
