import FormValidator from '../../src/helpers/forms';

describe('FormValidator', () => {
    let form;
    
    beforeEach(() => {
        document.body.innerHTML = `
            <form id="test-form">
                <input type="email" name="email" id="email" required>
                <input type="text" name="name" id="name" minlength="3" maxlength="20">
                <input type="password" name="password" id="password" data-validate="required|minlength:8">
                <input type="tel" name="phone" id="phone" data-validate="phone">
                <button type="submit">Submit</button>
            </form>
        `;
        form = document.getElementById('test-form');
    });
    
    afterEach(() => {
        document.body.innerHTML = '';
    });
    
    describe('Initialization', () => {
        it('should initialize with form element', () => {
            const validator = new FormValidator(form);
            expect(validator.form).toBe(form);
        });
        
        it('should initialize with form selector', () => {
            const validator = new FormValidator('#test-form');
            expect(validator.form).toBe(form);
        });
        
        it('should throw error if form not found', () => {
            expect(() => {
                new FormValidator('#non-existent');
            }).toThrow();
        });
    });
    
    describe('Field Validation', () => {
        it('should validate required fields', () => {
            const validator = new FormValidator(form);
            const emailField = form.querySelector('[name="email"]');
            
            emailField.value = '';
            expect(validator.validateField(emailField)).toBe(false);
            
            emailField.value = 'test@example.com';
            expect(validator.validateField(emailField)).toBe(true);
        });
        
        it('should validate email format', () => {
            const validator = new FormValidator(form);
            const emailField = form.querySelector('[name="email"]');
            
            emailField.value = 'invalid-email';
            expect(validator.validateField(emailField)).toBe(false);
            
            emailField.value = 'valid@example.com';
            expect(validator.validateField(emailField)).toBe(true);
        });
        
        it('should validate minlength', () => {
            const validator = new FormValidator(form);
            const nameField = form.querySelector('[name="name"]');
            
            nameField.value = 'ab';
            expect(validator.validateField(nameField)).toBe(false);
            
            nameField.value = 'abc';
            expect(validator.validateField(nameField)).toBe(true);
        });
        
        it('should validate maxlength', () => {
            const validator = new FormValidator(form);
            const nameField = form.querySelector('[name="name"]');
            
            nameField.value = 'a'.repeat(21);
            expect(validator.validateField(nameField)).toBe(false);
            
            nameField.value = 'a'.repeat(20);
            expect(validator.validateField(nameField)).toBe(true);
        });
        
        it('should validate custom data-validate rules', () => {
            const validator = new FormValidator(form);
            const passwordField = form.querySelector('[name="password"]');
            
            passwordField.value = 'short';
            expect(validator.validateField(passwordField)).toBe(false);
            
            passwordField.value = 'longenough';
            expect(validator.validateField(passwordField)).toBe(true);
        });
    });
    
    describe('Form Validation', () => {
        it('should validate entire form', () => {
            const validator = new FormValidator(form);
            
            // Empty form should be invalid
            expect(validator.validate()).toBe(false);
            
            // Fill required fields
            form.querySelector('[name="email"]').value = 'test@example.com';
            form.querySelector('[name="password"]').value = 'password123';
            
            expect(validator.validate()).toBe(true);
        });
        
        it('should call callback with validation results', (done) => {
            const validator = new FormValidator(form);
            
            form.querySelector('[name="email"]').value = 'test@example.com';
            form.querySelector('[name="password"]').value = 'password123';
            
            validator.validate((isValid, errors, formData) => {
                expect(isValid).toBe(true);
                expect(errors).toEqual({});
                expect(formData.email).toBe('test@example.com');
                done();
            });
        });
    });
    
    describe('Error Handling', () => {
        it('should collect errors for invalid fields', () => {
            const validator = new FormValidator(form);
            
            validator.validate();
            const errors = validator.getErrors();
            
            expect(Object.keys(errors).length).toBeGreaterThan(0);
            expect(errors.email).toBeDefined();
        });
        
        it('should return isValid status', () => {
            const validator = new FormValidator(form);
            
            // Before validation, isValid should return false (no validation run yet)
            validator.validate();
            expect(validator.isValid()).toBe(false);
            
            // After filling required fields and validating
            form.querySelector('[name="email"]').value = 'test@example.com';
            form.querySelector('[name="password"]').value = 'password123';
            validator.validate();
            
            expect(validator.isValid()).toBe(true);
        });
    });
    
    describe('Form Data', () => {
        it('should extract form data as object', () => {
            const validator = new FormValidator(form);
            
            form.querySelector('[name="email"]').value = 'test@example.com';
            form.querySelector('[name="name"]').value = 'John Doe';
            
            const formData = validator.getFormData();
            
            expect(formData.email).toBe('test@example.com');
            expect(formData.name).toBe('John Doe');
        });
    });
    
    describe('Reset', () => {
        it('should reset form and clear errors', () => {
            const validator = new FormValidator(form);
            
            form.querySelector('[name="email"]').value = 'test@example.com';
            validator.validate();
            
            validator.reset();
            
            expect(form.querySelector('[name="email"]').value).toBe('');
            expect(validator.getErrors()).toEqual({});
        });
    });
    
    describe('Custom Rules', () => {
        it('should add and use custom validation rules', () => {
            const validator = new FormValidator(form);
            
            validator.addRule('uppercase', (value) => {
                return /[A-Z]/.test(value);
            }, 'Must contain uppercase letter');
            
            const nameField = form.querySelector('[name="name"]');
            nameField.setAttribute('data-validate', 'uppercase');
            
            nameField.value = 'lowercase';
            expect(validator.validateField(nameField)).toBe(false);
            
            nameField.value = 'Uppercase';
            expect(validator.validateField(nameField)).toBe(true);
        });
    });
});
