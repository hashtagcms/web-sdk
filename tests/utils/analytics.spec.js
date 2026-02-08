import Analytics from '../../src/utils/analytics';
import axios from 'axios';

jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve({ data: {} })),
    get: jest.fn(() => Promise.resolve({ data: {} })),
    defaults: {
        headers: {
            common: {}
        }
    }
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

    it('publishes data via axios', async () => {
        const data = { event: 'test', value: 123 };
        require('axios').post.mockResolvedValue({ data: { success: true } });

        const result = await analytics.publish(data);

        expect(require('axios').post).toHaveBeenCalledWith('/api/hashtagcms/public/kpi/v1/publish', data);
        expect(result).toEqual({ success: true });
    });

    it('submits data via axios', async () => {
        const url = '/api/hashtagcms/public/kpi/v1/publish';
        const data = { test: 'data' };
        require('axios').post.mockResolvedValue({ data: { success: true } });

        const result = await analytics.submit('post', url, data);

        expect(require('axios').post).toHaveBeenCalledWith(url, data);
        expect(result).toEqual({ success: true });
    });
    
    it('handles axios errors in submit', async () => {
        const url = '/api/hashtagcms/public/kpi/v1/publish';
        const data = { test: 'data' };
        require('axios').post.mockRejectedValue({ response: { data: { error: 'failed' } } });

        try {
            await analytics.submit('post', url, data);
        } catch (e) {
            expect(e).toEqual({ error: 'failed' });
        }
    });

    it('tracks CMS page view with valid data', async () => {
        const data = { categoryId: 2, pageId: 123 };
        require('axios').post.mockResolvedValue({ data: { success: true } });

        const result = await analytics.trackCmsPage(data);

        expect(require('axios').post).toHaveBeenCalledWith('/api/hashtagcms/public/kpi/v1/publish', { ...data, event: 'category_page_view' });
        expect(result).toEqual({ success: true });
    });

    it('tracks CMS page view without pageId', async () => {
        const data = { categoryId: 8 }; // Contact page
        require('axios').post.mockResolvedValue({ data: { success: true } });

        const result = await analytics.trackCmsPage(data);

        expect(require('axios').post).toHaveBeenCalledWith('/api/hashtagcms/public/kpi/v1/publish', { ...data, event: 'category_page_view' });
        expect(result).toEqual({ success: true });
    });

    it('normalizes pageId < 1 to null in trackCmsPage', async () => {
        const data = { categoryId: 8, pageId: -1 }; 
        require('axios').post.mockResolvedValue({ data: { success: true } });

        const result = await analytics.trackCmsPage(data);

        // Should normalize pageId to null
        expect(require('axios').post).toHaveBeenCalledWith('/api/hashtagcms/public/kpi/v1/publish', { categoryId: 8, pageId: null, event: 'category_page_view' });
        expect(result).toEqual({ success: true });
    });

    it('normalizes pageId = 0 to null in trackCmsPage', async () => {
        const data = { categoryId: 8, pageId: 0 };
        require('axios').post.mockResolvedValue({ data: { success: true } });

        const result = await analytics.trackCmsPage(data);

        // Should normalize pageId to null
        expect(require('axios').post).toHaveBeenCalledWith('/api/hashtagcms/public/kpi/v1/publish', { categoryId: 8, pageId: null, event: 'category_page_view' });
        expect(result).toEqual({ success: true });
    });

    it('keeps valid pageId >= 1 in trackCmsPage', async () => {
        const data = { categoryId: 8, pageId: 123 };
        require('axios').post.mockResolvedValue({ data: { success: true } });

        const result = await analytics.trackCmsPage(data);

        // Should keep valid pageId
        expect(require('axios').post).toHaveBeenCalledWith('/api/hashtagcms/public/kpi/v1/publish', { categoryId: 8, pageId: 123, event: 'category_page_view' });
        expect(result).toEqual({ success: true });
    });

    it('throws error when categoryId is missing in trackCmsPage', async () => {
        const data = { pageId: 123 };

        try {
            await analytics.trackCmsPage(data);
            fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).toBe('trackCmsPage: categoryId is required');
        }
    });

    it('throws error when categoryId is not an integer in trackCmsPage', async () => {
        const data = { categoryId: '2', pageId: 123 };

        try {
            await analytics.trackCmsPage(data);
            fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).toBe('trackCmsPage: categoryId must be an integer');
        }
    });

    it('throws error when pageId is not an integer in trackCmsPage', async () => {
        const data = { categoryId: 2, pageId: '123' };

        try {
            await analytics.trackCmsPage(data);
            fail('Should have thrown an error');
        } catch (error) {
            expect(error.message).toBe('trackCmsPage: pageId must be an integer');
        }
    });

    it('master trackPageView calls google.trackPageView', () => {
        const url = '/master-page';
        const cb = jest.fn();
        const spy = jest.spyOn(analytics.google, 'trackPageView');

        analytics.trackPageView(url, cb);

        expect(spy).toHaveBeenCalledWith(url, cb);
    });

    it('tracks event view with Google Analytics helper', () => {
        const category = 'Button';
        const action = 'Click';
        const value = 'SignUp';
        const cb = jest.fn();

        analytics.google.trackEventView(category, action, value, cb);

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

    it('tracks page view with Google Analytics helper', () => {
        const page = '/about-us';
        const cb = jest.fn();

        analytics.google.trackPageView(page, cb);

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
