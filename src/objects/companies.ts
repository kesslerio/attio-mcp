import { getAttioClient } from "../api/attio-client.js";

/**
 * Searches for companies by name
 * 
 * @param query - Search query string
 * @returns Array of company results
 */
export async function searchCompanies(query: string): Promise<any[]> {
  const api = getAttioClient();
  const path = "/objects/companies/records/query";
  
  try {
    const response = await api.post(path, {
      filter: {
        name: { "$contains": query },
      }
    });
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
}

/**
 * Lists all companies with optional limit and sorting
 * 
 * @param limit - Maximum number of results to return
 * @returns Array of companies
 */
export async function listCompanies(limit: number = 20): Promise<any[]> {
  const api = getAttioClient();
  const path = "/objects/companies/records/query";
  
  try {
    const response = await api.post(path, {
      limit,
      sorts: [{ attribute: 'last_interaction', field: 'interacted_at', direction: 'desc' }]
    });
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
}

/**
 * Gets detailed information for a specific company
 * 
 * @param companyId - ID of the company
 * @returns Company details
 */
export async function getCompanyDetails(companyId: string): Promise<any> {
  const api = getAttioClient();
  const path = `/objects/companies/records/${companyId}`;
  
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Gets notes for a specific company
 * 
 * @param companyId - ID of the company
 * @param limit - Maximum number of notes to return
 * @param offset - Number of notes to skip
 * @returns Array of company notes
 */
export async function getCompanyNotes(companyId: string, limit: number = 10, offset: number = 0): Promise<any[]> {
  const api = getAttioClient();
  const path = `/notes?limit=${limit}&offset=${offset}&parent_object=companies&parent_record_id=${companyId}`;
  
  try {
    const response = await api.get(path);
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
}

/**
 * Creates a new note for a company
 * 
 * @param companyId - ID of the company
 * @param noteTitle - Title of the note
 * @param noteText - Content of the note
 * @returns Created note response
 */
export async function createCompanyNote(companyId: string, noteTitle: string, noteText: string): Promise<any> {
  const api = getAttioClient();
  const path = "/notes";
  
  try {
    const response = await api.post(path, {
      data: {
        format: "plaintext",
        parent_object: "companies",
        parent_record_id: companyId,
        title: `[AI] ${noteTitle}`,
        content: noteText
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}