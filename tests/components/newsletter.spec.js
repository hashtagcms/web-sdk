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
    let mockCloseBtn;

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
                <input type="email" value="test@example.com">
            </form>
        `;

        // Mock Elements
        mockForm = document.querySelector('form[data-form="newsletter-form"]');
        mockEmailInput = mockForm.querySelector('input');
        mockMessage = document.querySelector('span[data-class="newsletter-message"]');
        mockMessageHolder = document.querySelector('div[data-message-holder="newsletter-message-holder"]');
        mockCloseBtn = document.querySelector('span[data-class="newsletter-close"]');

        // Reset mock
        require('axios').post.mockReset();

        newsletter = new Newsletter();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('initializes and attaches event listeners', () => {
        expect(mockCloseBtn).toBeTruthy();
        
        // Trigger click on close button
        mockMessageHolder.style.display = 'block';
        mockCloseBtn.click();
        
        expect(mockMessageHolder.style.display).toBe('none');
    });

    it('handles successful subscription', async () => {
        const responseData = { success: true, message: 'Subscribed successfully!' };
        require('axios').post.mockResolvedValue({ data: responseData });

        newsletter.newsletterNow();
        await new Promise(resolve => setTimeout(resolve, 0)); // Wait for axios callback

        // Verify API call
        expect(require('axios').post).toHaveBeenCalledWith('/common/newsletter', { email: 'test@example.com' });

        // Verify UI updates
        expect(mockMessageHolder.style.display).toBe('');
        expect(mockMessage.innerText).toBe('Subscribed successfully!');
        expect(mockMessage.classList.contains('text-success')).toBe(true);
        expect(mockEmailInput.value).toBe('');
    });

    it('handles subscription error', async () => {
        const errorData = { success: false, message: 'Invalid email' };
        require('axios').post.mockResolvedValue({ data: errorData });

        newsletter.newsletterNow();
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify UI updates
        expect(mockMessageHolder.style.display).toBe('');
        expect(mockMessage.innerText).toBe('Invalid email');
        expect(mockMessage.classList.contains('text-danger')).toBe(true);
    });
    
    it('handles subscription error with complex message object', async () => {
        const errorData = { success: false, message: { email: ['Email already exists'] } };
        require('axios').post.mockResolvedValue({ data: errorData });

        newsletter.newsletterNow();
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(mockMessage.innerText).toBe('Email already exists');
        expect(mockMessage.classList.contains('text-danger')).toBe(true);
    });

    it('handles axios network error', async () => {
        const errorResponse = { response: { data: { success: false, message: 'Network Error' } } };
        require('axios').post.mockRejectedValue(errorResponse);

        newsletter.newsletterNow();
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(mockMessage.innerText).toBe('Network Error');
        expect(mockMessage.classList.contains('text-danger')).toBe(true);
    });
});
