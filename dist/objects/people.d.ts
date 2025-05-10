/**
 * Searches for people by name
 *
 * @param query - Search query string
 * @returns Array of person results
 */
export declare function searchPeople(query: string): Promise<any[]>;
/**
 * Lists people sorted by most recent interaction
 *
 * @param limit - Maximum number of people to return (default: 20)
 * @returns Array of person results
 */
export declare function listPeople(limit?: number): Promise<any[]>;
/**
 * Gets details for a specific person
 *
 * @param personId - The ID of the person
 * @returns Person details
 */
export declare function getPersonDetails(personId: string): Promise<any>;
/**
 * Gets notes for a specific person
 *
 * @param personId - The ID of the person
 * @param limit - Maximum number of notes to fetch (default: 10)
 * @param offset - Number of notes to skip (default: 0)
 * @returns Array of notes
 */
export declare function getPersonNotes(personId: string, limit?: number, offset?: number): Promise<any[]>;
/**
 * Creates a note for a specific person
 *
 * @param personId - The ID of the person
 * @param title - The title of the note
 * @param content - The content of the note
 * @returns The created note
 */
export declare function createPersonNote(personId: string, title: string, content: string): Promise<any>;
//# sourceMappingURL=people.d.ts.map