/**
 * Google Analytics Helper Class
 * Handles all Google Analytics tracking functionality
 */
export default class GoogleAnalyticsHelper {
    /**
     * Create a GoogleAnalyticsHelper instance
     * @param {Object} options - Configuration options
     * @param {boolean} options.enabled - Whether Google Analytics is enabled
     * @param {Function} options.onPageView - Callback after page view tracking
     * @param {Function} options.onEvent - Callback after event tracking
     */
    constructor(options = {}) {
        this.options = {
            enabled: options.enabled !== false,
            onPageView: options.onPageView || null,
            onEvent: options.onEvent || null
        };
    }

    /**
     * Track a page view (Google Analytics + callbacks)
     * @param {string} url - Page URL to track
     * @param {Function} callback - Optional callback
     */
    trackPageView(url, callback) {
        // Track with Google Analytics if enabled
        if (this.options.enabled) {
            this._trackGooglePageView(url);
        }

        // Call onPageView callback if provided
        if (this.options.onPageView) {
            this.options.onPageView({ url });
        }

        // Call custom callback if provided
        if (callback) {
            callback.apply(this, arguments);
        }
    }

    /**
     * Track an event (Google Analytics + callbacks)
     * @param {string} category - Event category
     * @param {string} action - Event action
     * @param {string} value - Event value/label
     * @param {Function} callback - Optional callback
     */
    trackEventView(category, action, value, callback) {
        // Track with Google Analytics if enabled
        if (this.options.enabled) {
            this._trackGoogleEvent(category, action, value);
        }

        // Call onEvent callback if provided
        if (this.options.onEvent) {
            this.options.onEvent({ category, action, value });
        }

        // Call custom callback if provided
        if (callback) {
            callback.apply(this, arguments);
        }
    }

    /**
     * Track event with Google Analytics only
     * @private
     * @param {string} category - Event category
     * @param {string} action - Event action
     * @param {string} value - Event value/label
     */
    _trackGoogleEvent(category, action, value) {
        if (typeof window === 'undefined') return;

        // Legacy Google Analytics (_gaq)
        try {
            if (typeof window._gaq !== 'undefined') {
                window._gaq.push(['_trackEvent', category, action, value]);
            }
        } catch (e) {
            // Silently fail
        }

        // Universal Analytics (ga)
        try {
            if (typeof window.ga !== 'undefined') {
                window.ga('send', {
                    hitType: 'event',
                    eventCategory: category,
                    eventAction: action,
                    eventLabel: value
                });
            }
        } catch (e) {
            // Silently fail
        }

        // Google Analytics 4 (gtag)
        try {
            if (typeof window.gtag !== 'undefined') {
                window.gtag('event', action, {
                    event_category: category,
                    event_label: value
                });
            }
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Track page view with Google Analytics only
     * @private
     * @param {string} url - Page URL
     */
    _trackGooglePageView(url) {
        if (typeof window === 'undefined') return;

        // Legacy Google Analytics (_gaq)
        try {
            if (typeof window._gaq !== 'undefined') {
                window._gaq.push(['_trackPageview', url]);
            }
        } catch (e) {
            // Silently fail
        }

        // Universal Analytics (ga)
        try {
            if (typeof window.ga !== 'undefined') {
                window.ga('send', {
                    hitType: 'pageview',
                    page: url
                });
            }
        } catch (e) {
            // Silently fail
        }

        // Google Analytics 4 (gtag)
        try {
            if (typeof window.gtag !== 'undefined') {
                window.gtag('config', window.GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID', {
                    page_path: url
                });
            }
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Enable or disable Google Analytics
     * @param {boolean} enabled - Whether to enable GA
     */
    setEnabled(enabled) {
        this.options.enabled = enabled;
    }

    /**
     * Check if Google Analytics is enabled
     * @returns {boolean} True if enabled
     */
    isEnabled() {
        return this.options.enabled;
    }
}
