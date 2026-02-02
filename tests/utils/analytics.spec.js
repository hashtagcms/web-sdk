import Analytics from '../../src/utils/analytics';
import axios from 'axios';

jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve({ data: {} })),
    get: jest.fn(() => Promise.resolve({ data: {} }))
}));

describe('Analytics Utility', () => {
    let analytics;

    beforeEach(() => {
        // Mock global axios for the component
        global.axios = require('axios');

        analytics = new Analytics();
        // Mock global GA objects
        global._gaq = [];
        global.ga = jest.fn();
        
        // Reset mocks
        require('axios').post.mockClear();
    });

    it('initializes and submits data', () => {
        const spySubmit = jest.spyOn(analytics, 'submit');
        const data = { page: 'home', user: 'guest' };

        analytics.init(data);

        expect(spySubmit).toHaveBeenCalledWith('post', '/analytics/publish', data);
    });

    it('submits data via axios', async () => {
        const url = '/analytics/publish';
        const data = { test: 'data' };
        require('axios').post.mockResolvedValue({ data: { success: true } });

        const result = await analytics.submit('post', url, data);

        expect(require('axios').post).toHaveBeenCalledWith(url, data);
        expect(result).toEqual({ success: true });
    });
    
    it('handles axios errors in submit', async () => {
        const url = '/analytics/publish';
        const data = { test: 'data' };
        require('axios').post.mockRejectedValue({ response: { data: { error: 'failed' } } });

        try {
            await analytics.submit('post', url, data);
        } catch (e) {
            expect(e).toEqual({ error: 'failed' });
        }
    });

    it('tracks event view (legacy GA)', () => {
        const category = 'Button';
        const action = 'Click';
        const value = 'SignUp';
        const cb = jest.fn();

        analytics.trackEventView(category, action, value, cb);

        // Check _gaq
        expect(global._gaq).toContainEqual(['_trackEvent', category, action, value]);
        
        // Check ga
        expect(global.ga).toHaveBeenCalledWith('send', {
            hitType: 'event',
            eventCategory: category,
            eventAction: action,
            eventLabel: value
        });

        // Check callback
        expect(cb).toHaveBeenCalled();
    });

    it('tracks page view (legacy GA)', () => {
        const page = '/about-us';
        const cb = jest.fn();

        analytics.trackPageView(page, cb);

        // Check _gaq
        expect(global._gaq).toContainEqual(['_trackPageview', page]);
        
        // Check ga
        expect(global.ga).toHaveBeenCalledWith('send', {
            hitType: 'pageview',
            page: page
        });
        
        // Check callback
        expect(cb).toHaveBeenCalled();
    });
});
