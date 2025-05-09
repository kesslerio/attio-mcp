/**
 * Searches for companies by name
 *
 * @param query - Search query string
 * @returns Array of company results
 */
export declare function searchCompanies(query: string): Promise<any[]>;
/**
 * Lists companies sorted by most recent interaction
 *
 * @param limit - Maximum number of companies to return (default: 20)
 * @returns Array of company results
 */
export declare function listCompanies(limit?: number): Promise<any[]>;
/**
 * Gets details for a specific company
 *
 * @param companyId - The ID of the company
 * @returns Company details
 */
export declare function getCompanyDetails(companyId: string): Promise<any>;
/**
 * Gets notes for a specific company
 *
 * @param companyId - The ID of the company
 * @param limit - Maximum number of notes to fetch (default: 10)
 * @param offset - Number of notes to skip (default: 0)
 * @returns Array of notes
 */
export declare function getCompanyNotes(companyId: string, limit?: number, offset?: number): Promise<any[]>;
/**
 * Creates a note for a specific company
 *
 * @param companyId - The ID of the company
 * @param title - The title of the note
 * @param content - The content of the note
 * @returns The created note
 */
export declare function createCompanyNote(companyId: string, title: string, content: string): Promise<any>;
//# sourceMappingURL=companies.d.ts.map