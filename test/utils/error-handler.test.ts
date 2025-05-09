import { createErrorResult } from '../../src/utils/error-handler.js';

describe('error-handler', () => {
  describe('createErrorResult', () => {
    it('should create a properly formatted error result', () => {
      const error = new Error('Test error');
      const url = '/test/url';
      const method = 'GET';
      const responseData = {
        status: 400,
        headers: { 'content-type': 'application/json' },
        data: { error: 'Bad request' }
      };

      const result = createErrorResult(error, url, method, responseData);

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: expect.stringContaining('ERROR: Test error')
          }
        ],
        isError: true,
        error: {
          code: 400,
          message: 'Test error',
          details: 'Bad request'
        }
      });

      // Check that all required information is included in the text
      const text = result.content[0].text;
      expect(text).toContain('Method: GET');
      expect(text).toContain('URL: /test/url');
      expect(text).toContain('Status: 400');
      expect(text).toContain('"content-type": "application/json"');
      expect(text).toContain('"error": "Bad request"');
    });

    it('should handle missing response data', () => {
      const error = new Error('Test error');
      const url = '/test/url';
      const method = 'GET';
      const responseData = {};

      const result = createErrorResult(error, url, method, responseData);

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: expect.stringContaining('ERROR: Test error')
          }
        ],
        isError: true,
        error: {
          code: 500,
          message: 'Test error',
          details: 'Unknown error occurred'
        }
      });
    });
  });
});