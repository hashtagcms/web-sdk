import Contact from '../../src/components/contact';
import axios from 'axios';

jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    defaults: {
        headers: {
            common: {}
        }
    }
}));

describe('Contact Component', () => {
    let contact;
    let mockForm;
    let mockMessage;
    let mockMessageHolder;

    beforeEach(() => {
        // Mock global axios for the component
        global.axios = require('axios'); // Use the mocked version

        // Setup DOM
        document.body.innerHTML = `
            <div data-message-holder="contact-message-holder" style="display:none;">
                <span data-class="contact-message"></span>
                <span data-class="contact-close">x</span>
            </div>
            <form data-form="contact-form">
                <input type="text" name="name" value="John Doe" required>
                <input type="email" name="email" value="john@example.com" required>
                <textarea name="comment" required>Hello</textarea>
            </form>
        `;

        // Mock Elements
        mockForm = document.querySelector('form[data-form="contact-form"]');
        mockMessage = document.querySelector('span[data-class="contact-message"]');
        mockMessageHolder = document.querySelector('div[data-message-holder="contact-message-holder"]');

        // Reset mock
        require('axios').post.mockReset();

        contact = new Contact();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('initializes in legacy mode', () => {
        expect(contact.form).toBe(mockForm);
        expect(contact.validator).toBeDefined();
    });

    it('handles successful submission', async () => {
        const responseData = { success: true, message: 'Message sent successfully!' };
        require('axios').post.mockResolvedValue({ data: responseData });

        await contact.submit();

        // Verify API call was made
        expect(require('axios').post).toHaveBeenCalled();

        // Verify UI updates
        expect(mockMessageHolder.style.display).toBe('');
        expect(mockMessage.innerText).toBe('Message sent successfully!');
        expect(mockMessage.classList.contains('text-success')).toBe(true);
    });

    it('handles submission error', async () => {
        const errorData = { success: false, message: 'Submission failed' };
        require('axios').post.mockResolvedValue({ data: errorData });

        await contact.submit();

        // Verify UI updates
        expect(mockMessageHolder.style.display).toBe('');
        expect(mockMessage.innerText).toBe('Submission failed');
        expect(mockMessage.classList.contains('text-danger')).toBe(true);
    });

    it('handles axios network error', async () => {
        const errorResponse = { response: { data: { success: false, message: 'Network Error' } } };
        require('axios').post.mockRejectedValue(errorResponse);

        try {
            await contact.submit();
        } catch (error) {
            // Error is expected
        }

        expect(mockMessage.innerText).toBe('Network Error');
        expect(mockMessage.classList.contains('text-danger')).toBe(true);
    });

    it('can close message holder', () => {
        mockMessageHolder.style.display = 'block';
        contact.close();
        expect(mockMessageHolder.style.display).toBe('none');
    });

    it('can show message holder', () => {
        mockMessageHolder.style.display = 'none';
        contact.show();
        expect(mockMessageHolder.style.display).toBe('');
    });
});
