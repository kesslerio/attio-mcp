import { 
  AttioApiError, 
  createApiErrorFromAxiosError,
  createApiErrorFromStatus 
} from "../errors/api-errors.js";
import { AttioErrorResponse } from "../types/attio.js";

/**
 * Creates a detailed error response for API errors, suitable for returning to MCP clients
 * 
 * @param error - The caught error
 * @param url - The API URL that was called
 * @param method - The HTTP method used
 * @param responseData - Any response data received
 * @returns Formatted error result
 */
export function createErrorResult(
  error: Error, 
  url: string, 
  method: string, 
  responseData: AttioErrorResponse = {}
) {
  // If it's already an AttioApiError, use it directly
  if (error instanceof AttioApiError) {
    return formatErrorResponse(error);
  }
  
  // For Axios errors with response data
  if (responseData && responseData.status) {
    // Convert to our error hierarchy
    const apiError = createApiErrorFromStatus(
      responseData.status,
      error.message,
      url,
      method,
      responseData
    );
    return formatErrorResponse(apiError);
  }
  
  // If it's a generic error with axios error structure
  if ((error as any).response?.status) {
    const apiError = createApiErrorFromAxiosError(error, url, method);
    return formatErrorResponse(apiError);
  }
  
  // For other errors, create a generic response
  return {
    content: [
      {
        type: "text",
        text: `ERROR: ${error.message}\n\n` +
          `=== Request Details ===\n` +
          `- Method: ${method}\n` +
          `- URL: ${url}\n\n` +
          `=== Response Details ===\n` +
          `- Status: ${responseData.status || 'Unknown'}\n` +
          `- Data: ${JSON.stringify(responseData.data || {}, null, 2)}\n`
      },
    ],
    isError: true,
    error: {
      code: responseData.status || 500,
      message: error.message,
      details: responseData.error || "Unknown error occurred"
    }
  };
}

/**
 * Format an AttioApiError into a standardized error response for MCP
 * 
 * @param error - The API error to format
 * @returns Formatted error response
 */
function formatErrorResponse(error: AttioApiError) {
  return {
    content: [
      {
        type: "text",
        text: `ERROR: ${error.message}\n\n` +
          `=== Request Details ===\n` +
          `- Method: ${error.method}\n` +
          `- URL: ${error.endpoint}\n\n` +
          `=== Response Details ===\n` +
          `- Status: ${error.statusCode}\n` +
          `- Error Type: ${error.name}\n` +
          `- Details: ${JSON.stringify(error.details || {}, null, 2)}\n`
      },
    ],
    isError: true,
    error: {
      code: error.statusCode,
      message: error.message,
      details: error.details?.error || error.details || "Unknown error occurred"
    }
  };
}