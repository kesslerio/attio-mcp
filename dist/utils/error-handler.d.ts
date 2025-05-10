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
export declare function createErrorResult(error: Error, url: string, method: string, responseData: any): {
    content: {
        type: string;
        text: string;
    }[];
    isError: boolean;
    error: {
        code: any;
        message: string;
        details: any;
    };
};
//# sourceMappingURL=error-handler.d.ts.map