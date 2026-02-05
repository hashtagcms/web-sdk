# TypeScript Support

The `@hashtagcms/web-sdk` package includes comprehensive TypeScript definitions for better IDE support and type safety.

## 📋 What's Included

TypeScript definitions are provided for all exported classes and functions:

- ✅ **FormValidator** - Form validation with type-safe options
- ✅ **FormSubmitter / Newsletter** - Form submission handler
- ✅ **Analytics** - Analytics tracking
- ✅ **AppConfig** - Configuration management
- ✅ **validateForm** - Simple validation function

## 🚀 Usage

### JavaScript Projects

Even if you're writing JavaScript, you'll get autocomplete and type hints in VS Code and other TypeScript-enabled editors:

```javascript
import { FormValidator, FormSubmitter } from '@hashtagcms/web-sdk';

// IDE will show all available options with descriptions
const validator = new FormValidator('#form', {
    validateOnBlur: true,  // ← Autocomplete suggests: boolean
    errorClass: 'error',   // ← Autocomplete suggests: string
    // ... IDE shows all other options
});

// Method signatures are shown on hover
validator.validate((isValid, errors, formData) => {
    // isValid: boolean
    // errors: ValidationErrors
    // formData: Record<string, any>
});
```

### TypeScript Projects

Full type safety with TypeScript:

```typescript
import { 
    FormValidator, 
    FormSubmitter, 
    FormValidatorOptions,
    ValidationCallback 
} from '@hashtagcms/web-sdk';

// Type-safe options
const options: FormValidatorOptions = {
    validateOnBlur: true,
    customRules: {
        strongPassword: (value: string) => /[A-Z]/.test(value)
    }
};

const validator = new FormValidator('#form', options);

// Type-safe callback
const callback: ValidationCallback = (isValid, errors, formData) => {
    if (isValid) {
        console.log('Form data:', formData);
    } else {
        console.error('Errors:', errors);
    }
};

validator.validate(callback);
```

## 📚 Type Definitions

### FormValidator

```typescript
class FormValidator {
    constructor(form: string | HTMLFormElement, options?: FormValidatorOptions);
    validate(callback?: ValidationCallback): boolean;
    validateField(field: HTMLElement): boolean;
    addRule(name: string, validator: ValidatorFunction, message?: string): void;
    getErrors(): ValidationErrors;
    getFormData(): Record<string, any>;
    reset(): void;
    isValid(): boolean;
}

interface FormValidatorOptions {
    validateOnBlur?: boolean;
    validateOnInput?: boolean;
    validateOnSubmit?: boolean;
    showErrors?: boolean;
    errorClass?: string;
    successClass?: string;
    errorMessageClass?: string;
    scrollToError?: boolean;
    focusOnError?: boolean;
    customRules?: Record<string, ValidatorFunction>;
    customMessages?: Record<string, string>;
}

type ValidatorFunction = (
    value: any,
    param?: any,
    field?: HTMLElement
) => boolean;

type ValidationCallback = (
    isValid: boolean,
    errors: ValidationErrors,
    formData: Record<string, any>
) => void;

interface ValidationErrors {
    [fieldName: string]: {
        field: HTMLElement;
        rule: string;
        message: string;
    };
}
```

### FormSubmitter / Newsletter

```typescript
class FormSubmitter {
    constructor(options?: FormSubmitterOptions);
    submit(): Promise<any>;
    showMessage(message: string, type?: 'success' | 'error'): void;
    show(): void;
    close(): void;
    newsletterNow(): Promise<any>;
    subscribeNow(): Promise<any>; // @deprecated
}

interface FormSubmitterOptions {
    form: string | HTMLFormElement;
    messageHolder?: string | HTMLElement;
    submitUrl?: string;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    validatorOptions?: FormValidatorOptions;
}

// Aliases
class Newsletter extends FormSubmitter {}
class Subscribe extends FormSubmitter {} // @deprecated
```

### Analytics

```typescript
class Analytics {
    google: GoogleAnalyticsHelper;
    constructor(options?: AnalyticsOptions);
    publish(data: any, callback?: AnalyticsCallback): Promise<any>;
    trackPageView(
        data: {
            categoryId: number;
            pageId?: number;
            [key: string]: any;
        },
        callback?: AnalyticsCallback
    ): Promise<any>;
    setOption(key: string, value: any): void;
    getOption(key: string, defaultValue?: any): any;
}

interface GoogleAnalyticsHelper {
    trackPageView(url: string, callback?: () => void): void;
    trackEventView(
        category: string,
        action: string,
        value: string,
        callback?: () => void
    ): void;
}
```

### AppConfig

```typescript
class AppConfig {
    constructor(data?: any);
    setConfigData(data: any): void;
    getValue<T = any>(key: string, defaultVal?: T): T;
    getMedia(path: string): string;
    getAll(): Record<string, any>;
    has(key: string): boolean;
}
```

## 💡 Examples

### Example 1: Type-Safe Form Validation

```typescript
import { FormValidator, ValidationErrors } from '@hashtagcms/web-sdk';

const validator = new FormValidator('#contact-form', {
    validateOnBlur: true,
    showErrors: true,
    customRules: {
        phone: (value: string) => /^\d{10}$/.test(value)
    },
    customMessages: {
        phone: 'Please enter a valid 10-digit phone number'
    }
});

validator.validate((isValid: boolean, errors: ValidationErrors) => {
    if (!isValid) {
        Object.keys(errors).forEach(fieldName => {
            console.log(`${fieldName}: ${errors[fieldName].message}`);
        });
    }
});
```

### Example 2: Type-Safe Form Submission

```typescript
import { FormSubmitter, FormSubmitterOptions } from '@hashtagcms/web-sdk';

interface NewsletterResponse {
    success: boolean;
    message: string;
    subscriber_id?: number;
}

const options: FormSubmitterOptions = {
    form: '#newsletter-form',
    messageHolder: '#messages',
    submitUrl: '/api/newsletter',
    onSuccess: (data: NewsletterResponse) => {
        console.log('Subscriber ID:', data.subscriber_id);
    },
    onError: (error: any) => {
        console.error('Subscription failed:', error);
    }
};

const newsletter = new FormSubmitter(options);
```

### Example 3: Type-Safe Config Management

```typescript
import { AppConfig } from '@hashtagcms/web-sdk';

interface SiteConfig {
    site_name: string;
    version: string;
    media: {
        http_path: string;
    };
}

const configData: SiteConfig = {
    site_name: 'My Site',
    version: '1.0.0',
    media: {
        http_path: 'https://cdn.example.com'
    }
};

const config = new AppConfig(configData);

// Type-safe getValue with generic
const siteName = config.getValue<string>('site_name', 'Default Site');
const version = config.getValue<string>('version');
```

## 🎯 Benefits

### For JavaScript Developers:
- ✅ **Autocomplete** - See all available options and methods
- ✅ **Inline Documentation** - Hover over methods to see descriptions
- ✅ **Parameter Hints** - Know what parameters to pass
- ✅ **Error Prevention** - Catch typos before runtime

### For TypeScript Developers:
- ✅ **Type Safety** - Compile-time type checking
- ✅ **Refactoring Support** - Rename symbols safely
- ✅ **Better IntelliSense** - Rich IDE support
- ✅ **Self-Documenting Code** - Types serve as documentation

## 🔧 IDE Support

TypeScript definitions work in:

- ✅ **Visual Studio Code** - Full support
- ✅ **WebStorm / IntelliJ IDEA** - Full support
- ✅ **Sublime Text** - With TypeScript plugin
- ✅ **Atom** - With atom-typescript
- ✅ **Vim/Neovim** - With CoC or ALE

## 📝 Notes

1. **No TypeScript Required** - Definitions work in JavaScript projects too
2. **Zero Runtime Cost** - Type definitions are only used during development
3. **Always Up-to-Date** - Definitions are maintained alongside the code
4. **Comprehensive** - All public APIs are fully typed

## 🐛 Reporting Issues

If you find any issues with the type definitions:

1. Check if you're using the latest version
2. Report on GitHub Issues with:
   - TypeScript version
   - Code example
   - Expected vs actual behavior

## 📚 Learn More

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
