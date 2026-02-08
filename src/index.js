// Main entry point for the web-sdk
import Newsletter from './components/newsletter';
import Contact from './components/contact';
import Analytics from './utils/analytics';
import { AppConfig } from './helpers/common';
import FormValidator, { validateForm } from './helpers/forms';

// Export individual components
export {
    Newsletter,
    Newsletter as Subscribe,
    Newsletter as FormSubmitter,
    Contact,
    Analytics,
    AppConfig,
    FormValidator,
    validateForm
};

// Create a combined object
const HashtagCms = {
    Newsletter,
    Subscribe: Newsletter,
    FormSubmitter: Newsletter,
    Contact,
    Analytics,
    AppConfig,
    FormValidator,
    validateForm
};

// Expose globally for UMD/browser environments
if (typeof window !== 'undefined') {
    window.HashtagCms = HashtagCms;
}

export default HashtagCms;
