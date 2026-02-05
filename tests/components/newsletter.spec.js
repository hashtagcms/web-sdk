import Newsletter from '../../src/components/newsletter';
import axios from 'axios';

jest.mock('axios', () => ({
    post: jest.fn()
}));

describe('Newsletter Component', () => {
    let newsletter;
    let mockForm;
    let mockEmailInput;
    let mockMessage;
    let mockMessageHolder;

    beforeEach(() => {
        // Mock global axios for the component
        global.axios = require('axios'); // Use the mocked version

        // Setup DOM
        document.body.innerHTML = `
            <div data-message-holder="newsletter-message-holder" style="display:none;">
                <span data-class="newsletter-message"></span>
                <span data-class="newsletter-close">x</span>
            </div>
            <form data-form="newsletter-form">
                <input type="email" name="email" value="test@example.com" required>
            </form>
        `;

        // Mock Elements
        mockForm = document.querySelector('form[data-form="newsletter-form"]');
        mockEmailInput = mockForm.querySelector('input');
        mockMessage = document.querySelector('span[data-class="newsletter-message"]');
        mockMessageHolder = document.querySelector('div[data-message-holder="newsletter-message-holder"]');

        // Reset mock
        require('axios').post.mockReset();

        newsletter = new Newsletter();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('initializes in legacy mode', () => {
        expect(newsletter.form).toBe(mockForm);
        expect(newsletter.validator).toBeDefined();
    });

    it('handles successful subscription', async () => {
        const responseData = { success: true, message: 'Subscribed successfully!' };
        require('axios').post.mockResolvedValue({ data: responseData });

        await newsletter.submit();

        // Verify API call was made
        expect(require('axios').post).toHaveBeenCalled();

        // Verify UI updates
        expect(mockMessageHolder.style.display).toBe('');
        expect(mockMessage.innerText).toBe('Subscribed successfully!');
        expect(mockMessage.classList.contains('text-success')).toBe(true);
        // Note: form.reset() is called, but jsdom might not fully support it
    });

    it('handles subscription error', async () => {
        const errorData = { success: false, message: 'Invalid email' };
        require('axios').post.mockResolvedValue({ data: errorData });

        await newsletter.submit();

        // Verify UI updates
        expect(mockMessageHolder.style.display).toBe('');
        expect(mockMessage.innerText).toBe('Invalid email');
        expect(mockMessage.classList.contains('text-danger')).toBe(true);
    });
    
    it('handles subscription error with complex message object', async () => {
        const errorData = { success: false, message: { email: ['Email already exists'] } };
        require('axios').post.mockResolvedValue({ data: errorData });

        await newsletter.submit();

        expect(mockMessage.innerText).toBe('Email already exists');
        expect(mockMessage.classList.contains('text-danger')).toBe(true);
    });

    it('handles axios network error', async () => {
        const errorResponse = { response: { data: { success: false, message: 'Network Error' } } };
        require('axios').post.mockRejectedValue(errorResponse);

        try {
            await newsletter.submit();
        } catch (error) {
            // Error is expected
        }

        expect(mockMessage.innerText).toBe('Network Error');
        expect(mockMessage.classList.contains('text-danger')).toBe(true);
    });

    it('can close message holder', () => {
        mockMessageHolder.style.display = 'block';
        newsletter.close();
        expect(mockMessageHolder.style.display).toBe('none');
    });

    it('can show message holder', () => {
        mockMessageHolder.style.display = 'none';
        newsletter.show();
        expect(mockMessageHolder.style.display).toBe('');
    });

    it('validates form before submission', async () => {
        mockEmailInput.value = ''; // Invalid email
        
        const result = await newsletter.submit();
        
        expect(result).toBe(false);
        expect(require('axios').post).not.toHaveBeenCalled();
    });
});
