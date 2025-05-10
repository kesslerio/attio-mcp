/**
 * People-related functionality
 */
import { getAttioClient } from "../api/attio-client.js";
/**
 * Searches for people by name
 *
 * @param query - Search query string
 * @returns Array of person results
 */
export async function searchPeople(query) {
    const api = getAttioClient();
    const path = "/objects/people/records/query";
    try {
        const response = await api.post(path, {
            filter: {
                name: { "$contains": query },
            }
        });
        return response.data.data || [];
    }
    catch (error) {
        throw error;
    }
}
/**
 * Lists people sorted by most recent interaction
 *
 * @param limit - Maximum number of people to return (default: 20)
 * @returns Array of person results
 */
export async function listPeople(limit = 20) {
    const api = getAttioClient();
    const path = "/objects/people/records/query";
    try {
        const response = await api.post(path, {
            limit,
            sorts: [{ attribute: 'last_interaction', field: 'interacted_at', direction: 'desc' }]
        });
        return response.data.data || [];
    }
    catch (error) {
        throw error;
    }
}
/**
 * Gets details for a specific person
 *
 * @param personId - The ID of the person
 * @returns Person details
 */
export async function getPersonDetails(personId) {
    const api = getAttioClient();
    const path = `/objects/people/records/${personId}`;
    try {
        const response = await api.get(path);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
/**
 * Gets notes for a specific person
 *
 * @param personId - The ID of the person
 * @param limit - Maximum number of notes to fetch (default: 10)
 * @param offset - Number of notes to skip (default: 0)
 * @returns Array of notes
 */
export async function getPersonNotes(personId, limit = 10, offset = 0) {
    const api = getAttioClient();
    const path = `/notes?limit=${limit}&offset=${offset}&parent_object=people&parent_record_id=${personId}`;
    try {
        const response = await api.get(path);
        return response.data.data || [];
    }
    catch (error) {
        throw error;
    }
}
/**
 * Creates a note for a specific person
 *
 * @param personId - The ID of the person
 * @param title - The title of the note
 * @param content - The content of the note
 * @returns The created note
 */
export async function createPersonNote(personId, title, content) {
    const api = getAttioClient();
    const path = 'notes';
    try {
        const response = await api.post(path, {
            data: {
                format: "plaintext",
                parent_object: "people",
                parent_record_id: personId,
                title: `[AI] ${title}`,
                content: content
            },
        });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
//# sourceMappingURL=people.js.map