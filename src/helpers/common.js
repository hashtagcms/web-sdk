export class AppConfig {
    /**
     * Create an AppConfig instance
     * @param {Object|string} data - Configuration data (object or JSON string)
     */
    constructor(data) {
        this.configData = this._parseData(data);
    }

    /**
     * Parse configuration data from various formats
     * @private
     * @param {Object|string|null|undefined} data - Data to parse
     * @returns {Object} Parsed configuration object
     */
    _parseData(data) {
        // Handle null or undefined
        if (data === null || data === undefined) {
            return {};
        }

        // Handle string (JSON)
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                return typeof parsed === 'object' && parsed !== null ? parsed : {};
            } catch (e) {
                console.warn('AppConfig: Failed to parse JSON string, using empty config', e);
                return {};
            }
        }

        // Handle object
        if (typeof data === 'object' && data !== null) {
            return data;
        }

        // Handle other types (number, boolean, etc.)
        console.warn('AppConfig: Invalid data type, expected object or JSON string, got', typeof data);
        return {};
    }

    /**
     * Set configuration data
     * @param {Object|string} data - Configuration data (object or JSON string)
     */
    setConfigData(data) {
        this.configData = this._parseData(data);
    }

    /**
     * Get a configuration value by key (supports dot notation for nested keys)
     * @param {string} key - Configuration key (e.g., 'site.name')
     * @param {*} defaultVal - Default value if key not found
     * @returns {*} Configuration value or default
     */
    getValue(key, defaultVal) {
        if (!key) return defaultVal;
        
        try {
            return key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : undefined, this.configData) ?? defaultVal;
        } catch (e) {
            return defaultVal;
        }
    }

    /**
     * Get full media URL path
     * @param {string} path - Relative media path
     * @returns {string} Full media URL
     */
    getMedia(path) {
        const media = this.getValue("media");
        if (!media || !media.http_path) {
            console.warn('AppConfig: media.http_path not configured');
            return path;
        }
        return media.http_path + "/" + path;
    }

    /**
     * Get all configuration data
     * @returns {Object} All configuration data
     */
    getAll() {
        return this.configData;
    }

    /**
     * Check if a key exists in configuration
     * @param {string} key - Configuration key
     * @returns {boolean} True if key exists
     */
    has(key) {
        return key in this.configData;
    }
}
