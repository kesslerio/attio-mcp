/**
 * Error handling utility for creating consistent error responses
 */

/**
 * Creates a detailed error response for API errors
 * 
 * @param error - The error object
 * @param url - The URL that was called
 * @param method - The HTTP method used
 * @param responseData - The error response data
 * @returns A formatted error response
 */
export function createErrorResult(error: Error, url: string, method: string, responseData: any) {
  return {
    content: [
      {
        type: "text",
        text: `ERROR: ${error.message}\n\n` +
          `=== Request Details ===\n` +
          `- Method: ${method}\n` +
          `- URL: ${url}\n\n` +
          `=== Response Details ===\n` +
          `- Status: ${responseData.status}\n` +
          `- Headers: ${JSON.stringify(responseData.headers || {}, null, 2)}\n` +
          `- Data: ${JSON.stringify(responseData.data || {}, null, 2)}\n`
      },
    ],
    isError: true,
    error: {
      code: responseData.status || 500,
      message: error.message,
      details: responseData.data?.error || "Unknown error occurred"
    }
  };
}