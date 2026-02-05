import { AppConfig } from '../../src/helpers/common';

describe('AppConfig', () => {
    describe('Initialization', () => {
        it('should initialize with object data', () => {
            const config = new AppConfig({ site_name: 'Test Site' });
            expect(config.getValue('site_name')).toBe('Test Site');
        });
        
        it('should initialize with JSON string', () => {
            const jsonString = '{"site_name":"Test Site","version":"1.0"}';
            const config = new AppConfig(jsonString);
            
            expect(config.getValue('site_name')).toBe('Test Site');
            expect(config.getValue('version')).toBe('1.0');
        });
        
        it('should handle null data', () => {
            const config = new AppConfig(null);
            expect(config.getAll()).toEqual({});
        });
        
        it('should handle undefined data', () => {
            const config = new AppConfig();
            expect(config.getAll()).toEqual({});
        });
        
        it('should handle invalid JSON string', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            const config = new AppConfig('invalid json{');
            
            expect(config.getAll()).toEqual({});
            expect(consoleSpy).toHaveBeenCalled();
            
            consoleSpy.mockRestore();
        });
        
        it('should handle invalid data types', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            const config = new AppConfig(123);
            
            expect(config.getAll()).toEqual({});
            expect(consoleSpy).toHaveBeenCalled();
            
            consoleSpy.mockRestore();
        });
    });
    
    describe('getValue', () => {
        it('should get existing value', () => {
            const config = new AppConfig({ site_name: 'Test' });
            expect(config.getValue('site_name')).toBe('Test');
        });
        
        it('should return default value for missing key', () => {
            const config = new AppConfig({});
            expect(config.getValue('missing', 'default')).toBe('default');
        });
        
        it('should return undefined for missing key without default', () => {
            const config = new AppConfig({});
            expect(config.getValue('missing')).toBeUndefined();
        });
        
        it('should get nested values using dot notation', () => {
            const config = new AppConfig({
                site: { name: 'Test Site', settings: { theme: 'dark' } }
            });
            
            expect(config.getValue('site.name')).toBe('Test Site');
            expect(config.getValue('site.settings.theme')).toBe('dark');
            expect(config.getValue('site.missing.key', 'default')).toBe('default');
        });
        
        it('should get nested values using object manual access', () => {
            const config = new AppConfig({
                media: { http_path: 'https://cdn.example.com' }
            });
            
            const media = config.getValue('media');
            expect(media.http_path).toBe('https://cdn.example.com');
        });
    });
    
    describe('setConfigData', () => {
        it('should update config with object', () => {
            const config = new AppConfig({ old: 'value' });
            config.setConfigData({ new: 'value' });
            
            expect(config.getValue('new')).toBe('value');
            expect(config.getValue('old')).toBeUndefined();
        });
        
        it('should update config with JSON string', () => {
            const config = new AppConfig({});
            config.setConfigData('{"site_name":"Updated"}');
            
            expect(config.getValue('site_name')).toBe('Updated');
        });
    });
    
    describe('getMedia', () => {
        it('should return full media URL', () => {
            const config = new AppConfig({
                media: { http_path: 'https://cdn.example.com' }
            });
            
            const url = config.getMedia('images/logo.png');
            expect(url).toBe('https://cdn.example.com/images/logo.png');
        });
        
        it('should handle missing media config', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            const config = new AppConfig({});
            
            const url = config.getMedia('images/logo.png');
            expect(url).toBe('images/logo.png');
            expect(consoleSpy).toHaveBeenCalled();
            
            consoleSpy.mockRestore();
        });
        
        it('should handle missing http_path', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            const config = new AppConfig({ media: {} });
            
            const url = config.getMedia('images/logo.png');
            expect(url).toBe('images/logo.png');
            expect(consoleSpy).toHaveBeenCalled();
            
            consoleSpy.mockRestore();
        });
    });
    
    describe('getAll', () => {
        it('should return all configuration data', () => {
            const data = {
                site_name: 'Test',
                version: '1.0',
                media: { http_path: 'https://cdn.example.com' }
            };
            const config = new AppConfig(data);
            
            expect(config.getAll()).toEqual(data);
        });
        
        it('should return empty object for empty config', () => {
            const config = new AppConfig();
            expect(config.getAll()).toEqual({});
        });
    });
    
    describe('has', () => {
        it('should return true for existing key', () => {
            const config = new AppConfig({ site_name: 'Test' });
            expect(config.has('site_name')).toBe(true);
        });
        
        it('should return false for missing key', () => {
            const config = new AppConfig({ site_name: 'Test' });
            expect(config.has('missing')).toBe(false);
        });
        
        it('should return true for nested keys', () => {
            const config = new AppConfig({
                media: { http_path: 'https://cdn.example.com' }
            });
            expect(config.has('media')).toBe(true);
        });
    });
    
    describe('Complex Scenarios', () => {
        it('should handle localStorage JSON string', () => {
            const data = { site_name: 'Test', version: '1.0' };
            const jsonString = JSON.stringify(data);
            
            const config = new AppConfig(jsonString);
            expect(config.getValue('site_name')).toBe('Test');
            expect(config.getValue('version')).toBe('1.0');
        });
        
        it('should handle API response data', () => {
            const apiResponse = {
                success: true,
                data: {
                    site_name: 'API Site',
                    media: { http_path: 'https://api.cdn.com' }
                }
            };
            
            const config = new AppConfig(apiResponse.data);
            expect(config.getValue('site_name')).toBe('API Site');
            expect(config.getMedia('test.jpg')).toBe('https://api.cdn.com/test.jpg');
        });
        
        it('should handle multiple updates', () => {
            const config = new AppConfig({ v1: 'data' });
            
            config.setConfigData({ v2: 'data' });
            expect(config.has('v1')).toBe(false);
            expect(config.has('v2')).toBe(true);
            
            config.setConfigData('{"v3":"data"}');
            expect(config.has('v2')).toBe(false);
            expect(config.has('v3')).toBe(true);
        });
    });
});
