import './bootstrap';
import Newsletter from './components/newsletter';
import Analytics from './utils/analytics';
import { AppConfig } from './helpers/common';
import FormValidator, { validateForm } from './helpers/forms';

export {
    Newsletter,
    Newsletter as Subscribe,      // Alias for backward compatibility
    Newsletter as FormSubmitter,  // Generic form submission handler alias
    Analytics,
    AppConfig,
    FormValidator,
    validateForm
};

export default FormValidator;
