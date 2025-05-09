import { createErrorResult } from '../../src/utils/error-handler.js';
import { 
  AttioApiError, 
  AuthenticationError,
  ResourceNotFoundError 
} from '../../src/errors/api-errors.js';

describe('error-handler', () => {
  describe('createErrorResult', () => {
    it('should format an AttioApiError correctly', () => {
      const error = new AttioApiError('Test error', 500, '/test', 'GET', { detail: 'test detail' });
      const result = createErrorResult(error, '/unused', 'UNUSED');
      
      expect(result.isError).toBe(true);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('ERROR: Test error');
      expect(result.content[0].text).toContain('Method: GET');
      expect(result.content[0].text).toContain('URL: /test');
      expect(result.content[0].text).toContain('Status: 500');
      expect(result.content[0].text).toContain('Error Type: AttioApiError');
      expect(result.error.code).toBe(500);
      expect(result.error.message).toBe('Test error');
      expect(result.error.details).toEqual({ detail: 'test detail' });
    });

    it('should format specialized errors with appropriate details', () => {
      const error = new AuthenticationError('Auth failed', '/auth', 'POST', { reason: 'invalid_key' });
      const result = createErrorResult(error, '/unused', 'UNUSED');
      
      expect(result.content[0].text).toContain('ERROR: Auth failed');
      expect(result.content[0].text).toContain('Error Type: AuthenticationError');
      expect(result.error.code).toBe(401);
      expect(result.error.details).toEqual({ reason: 'invalid_key' });
    });

    it('should handle ResponseData when error is not an AttioApiError', () => {
      const error = new Error('Generic error');
      const responseData = {
        status: 404,
        data: { message: 'Not found' }
      };
      
      const result = createErrorResult(error, '/api/resource', 'GET', responseData);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('ERROR:');
      expect(result.content[0].text).toContain('Status: 404');
      expect(result.error.code).toBe(404);
    });

    it('should handle Axios error structure', () => {
      const error = new Error('Request failed');
      (error as any).response = {
        status: 400,
        data: { message: 'Bad request' }
      };
      
      const result = createErrorResult(error, '/api', 'POST');
      
      expect(result.isError).toBe(true);
      expect(result.error.code).toBe(400);
    });

    it('should handle errors without response data', () => {
      const error = new Error('Network error');
      const result = createErrorResult(error, '/api', 'GET');
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('ERROR: Network error');
      expect(result.content[0].text).toContain('Status: Unknown');
      expect(result.error.code).toBe(500);
    });
  });
});