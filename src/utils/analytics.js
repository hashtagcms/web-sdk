import GoogleAnalyticsHelper from '../helpers/google-analytics.js';

export default class Analytics {
    /**
     * Create an Analytics instance
     * @param {Object} options - Configuration options
     * @param {string} options.publishUrl - URL for publishing analytics (default: '/analytics/publish')
     * @param {Function} options.onPublish - Callback after analytics publish
     * @param {Function} options.onError - Callback on publish error
     * @param {Function} options.onPageView - Callback after page view tracking
     * @param {Function} options.onEvent - Callback after event tracking
     * @param {boolean} options.enableGoogleAnalytics - Enable Google Analytics integration (default: true)
     * @param {boolean} options.enableBeacon - Use sendBeacon API (default: true)
     */
    constructor(options = {}) {
        this.options = {
            publishUrl: options.publishUrl || '/analytics/publish',
            onPublish: options.onPublish || null,
            onError: options.onError || null,
            onPageView: options.onPageView || null,
            onEvent: options.onEvent || null,
            enableGoogleAnalytics: options.enableGoogleAnalytics !== false,
            enableBeacon: options.enableBeacon !== false,  // Default: true
            ...options
        };

        // Initialize Google Analytics helper
        this.google = new GoogleAnalyticsHelper({
            enabled: this.options.enableGoogleAnalytics,
            onPageView: this.options.onPageView,
            onEvent: this.options.onEvent
        });
    }

    /**
     * Publish analytics data to server
     * Uses sendBeacon if enabled and available, otherwise falls back to axios
     * @param {Object} data - Analytics data
     * @param {Function} callback - Optional callback
     * @returns {Promise}
     */
    publish(data, callback) {
        const url = this.options.publishUrl;

        // Use sendBeacon if enabled and available
        if (this.options.enableBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
            try {
                const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                const sent = navigator.sendBeacon(url, blob);
                
                if (sent) {
                    console.log('Analytics: sendBeacon sent successfully');
                    
                    if (this.options.onPublish) {
                        this.options.onPublish(data, null, { beaconSent: true });
                    }
                    
                    if (callback) {
                        callback(null, { success: true, beaconSent: true });
                    }
                    
                    return Promise.resolve({ success: true, beaconSent: true });
                } else {
                    console.warn('Analytics: sendBeacon failed (returned false)');
                }
            } catch (error) {
                console.warn('Analytics: sendBeacon error, falling back to axios', error);
            }
        }

        // Fallback to axios (when beacon is disabled, not supported, or failed)
        return this.submit('post', url, data)
            .then(response => {
                if (this.options.onPublish) {
                    this.options.onPublish(data, response, { beaconSent: false });
                }
                
                if (callback) {
                    callback(null, response);
                }
                
                return response;
            })
            .catch(error => {
                if (this.options.onError) {
                    this.options.onError(error, data);
                }
                
                if (callback) {
                    callback(error);
                }
                
                throw error;
            });
    }

    /**
     * Submit HTTP request
     * @param {string} requestType - HTTP method (get, post, etc.)
     * @param {string} url - Request URL
     * @param {Object} data - Request data
     * @returns {Promise}
     */
    submit(requestType, url, data) {
        return new Promise((resolve, reject) => {
            axios[requestType](url, data)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error.response ? error.response.data : error);
                });
        });
    }

    /**
     * Track a page view across all configured systems (Google Analytics, Callbacks, etc.)
     * This is the "Master" method for URL-based tracking.
     * @param {string} url - Page URL
     * @param {Function} [callback] - Optional callback
     */
    trackPageView(url, callback) {
        return this.google.trackPageView(url, callback);
    }

    /**
     * Track a CMS-specific category page view for the HashtagCMS server
     * @param {Object} data - Page view data
     * @param {number} data.categoryId - Category ID (required)
     * @param {number} [data.pageId] - Page ID (optional, values < 1 are treated as null)
     * @param {Function} callback - Optional callback
     * @returns {Promise}
     * @throws {Error} If categoryId is missing or invalid
     */
    trackCmsPage(data, callback) {
        // Validate required categoryId
        if (!data || typeof data !== 'object') {
            const error = new Error('trackCmsPage: data must be an object');
            if (callback) {
                callback(error);
                return Promise.reject(error);
            }
            throw error;
        }

        if (!data.categoryId) {
            const error = new Error('trackCmsPage: categoryId is required');
            if (callback) {
                callback(error);
                return Promise.reject(error);
            }
            throw error;
        }

        if (!Number.isInteger(data.categoryId)) {
            const error = new Error('trackCmsPage: categoryId must be an integer');
            if (callback) {
                callback(error);
                return Promise.reject(error);
            }
            throw error;
        }

        // Validate optional pageId
        if (data.pageId !== undefined && data.pageId !== null && !Number.isInteger(data.pageId)) {
            const error = new Error('trackCmsPage: pageId must be an integer');
            if (callback) {
                callback(error);
                return Promise.reject(error);
            }
            throw error;
        }

        // Normalize pageId: treat values < 1 as null
        const normalizedData = { ...data };
        if (normalizedData.pageId !== undefined && normalizedData.pageId !== null && normalizedData.pageId < 1) {
            normalizedData.pageId = null;
        }
        // add fixed event type for HashtagCMS server
        normalizedData.event = 'category_page_view';

        return this.publish(normalizedData, callback);
    }

    /**
     * Set configuration option
     * @param {string} key - Option key
     * @param {*} value - Option value
     */
    setOption(key, value) {
        this.options[key] = value;
        
        // Update google helper if enableGoogleAnalytics is changed
        if (key === 'enableGoogleAnalytics') {
            this.google.setEnabled(value);
        }
    }

    /**
     * Get configuration option
     * @param {string} key - Option key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Option value
     */
    getOption(key, defaultValue) {
        return this.options[key] !== undefined ? this.options[key] : defaultValue;
    }
}
