import { createErrorResult } from '../../src/utils/error-handler.js';

describe('error-handler', () => {
  describe('createErrorResult', () => {
    it('should create a proper error result object', () => {
      // Arrange
      const error = new Error('Test error');
      const url = '/test/url';
      const method = 'GET';
      const responseData = {
        status: 404,
        headers: { 'content-type': 'application/json' },
        data: { 
          error: {
            message: 'Resource not found'
          }
        }
      };

      // Act
      const result = createErrorResult(error, url, method, responseData);

      // Assert
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('isError', true);
      expect(result).toHaveProperty('error');
      expect(result.error).toHaveProperty('code', 404);
      expect(result.error).toHaveProperty('message', 'Test error');
      expect(result.error).toHaveProperty('details', responseData.data.error);
      
      // Check that the error text contains all the important information
      const errorText = result.content[0].text;
      expect(errorText).toContain('Test error');
      expect(errorText).toContain('GET');
      expect(errorText).toContain('/test/url');
      expect(errorText).toContain('404');
    });

    it('should handle missing response data gracefully', () => {
      // Arrange
      const error = new Error('Test error');
      const url = '/test/url';
      const method = 'POST';
      const responseData = {};

      // Act
      const result = createErrorResult(error, url, method, responseData);

      // Assert
      expect(result).toHaveProperty('isError', true);
      expect(result.error).toHaveProperty('code', 500); // Default code when not provided
      expect(result.error).toHaveProperty('details', 'Unknown error occurred');
    });
  });
});