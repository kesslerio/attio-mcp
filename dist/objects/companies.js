/**
 * Company-related functionality
 */
import { getAttioClient } from "../api/attio-client.js";
/**
 * Searches for companies by name
 *
 * @param query - Search query string
 * @returns Array of company results
 */
export async function searchCompanies(query) {
    const api = getAttioClient();
    const path = "/objects/companies/records/query";
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
 * Lists companies sorted by most recent interaction
 *
 * @param limit - Maximum number of companies to return (default: 20)
 * @returns Array of company results
 */
export async function listCompanies(limit = 20) {
    const api = getAttioClient();
    const path = "/objects/companies/records/query";
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
 * Gets details for a specific company
 *
 * @param companyId - The ID of the company
 * @returns Company details
 */
export async function getCompanyDetails(companyId) {
    const api = getAttioClient();
    const path = `/objects/companies/records/${companyId}`;
    try {
        const response = await api.get(path);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}
/**
 * Gets notes for a specific company
 *
 * @param companyId - The ID of the company
 * @param limit - Maximum number of notes to fetch (default: 10)
 * @param offset - Number of notes to skip (default: 0)
 * @returns Array of notes
 */
export async function getCompanyNotes(companyId, limit = 10, offset = 0) {
    const api = getAttioClient();
    const path = `/notes?limit=${limit}&offset=${offset}&parent_object=companies&parent_record_id=${companyId}`;
    try {
        const response = await api.get(path);
        return response.data.data || [];
    }
    catch (error) {
        throw error;
    }
}
/**
 * Creates a note for a specific company
 *
 * @param companyId - The ID of the company
 * @param title - The title of the note
 * @param content - The content of the note
 * @returns The created note
 */
export async function createCompanyNote(companyId, title, content) {
    const api = getAttioClient();
    const path = 'notes';
    try {
        const response = await api.post(path, {
            data: {
                format: "plaintext",
                parent_object: "companies",
                parent_record_id: companyId,
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
//# sourceMappingURL=companies.js.map