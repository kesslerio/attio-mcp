import { getAttioClient } from "../api/attio-client.js";

/**
 * Searches for people by name
 * 
 * @param query - Search query string
 * @returns Array of person results
 */
export async function searchPeople(query: string): Promise<any[]> {
  const api = getAttioClient();
  const path = "/objects/people/records/query";
  
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
 * Lists all people with optional limit and sorting
 * 
 * @param limit - Maximum number of results to return
 * @returns Array of people
 */
export async function listPeople(limit: number = 20): Promise<any[]> {
  const api = getAttioClient();
  const path = "/objects/people/records/query";
  
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
 * Gets detailed information for a specific person
 * 
 * @param personId - ID of the person
 * @returns Person details
 */
export async function getPersonDetails(personId: string): Promise<any> {
  const api = getAttioClient();
  const path = `/objects/people/records/${personId}`;
  
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Gets notes for a specific person
 * 
 * @param personId - ID of the person
 * @param limit - Maximum number of notes to return
 * @param offset - Number of notes to skip
 * @returns Array of person notes
 */
export async function getPersonNotes(personId: string, limit: number = 10, offset: number = 0): Promise<any[]> {
  const api = getAttioClient();
  const path = `/notes?limit=${limit}&offset=${offset}&parent_object=people&parent_record_id=${personId}`;
  
  try {
    const response = await api.get(path);
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
}

/**
 * Creates a new note for a person
 * 
 * @param personId - ID of the person
 * @param noteTitle - Title of the note
 * @param noteText - Content of the note
 * @returns Created note response
 */
export async function createPersonNote(personId: string, noteTitle: string, noteText: string): Promise<any> {
  const api = getAttioClient();
  const path = "/notes";
  
  try {
    const response = await api.post(path, {
      data: {
        format: "plaintext",
        parent_object: "people",
        parent_record_id: personId,
        title: `[AI] ${noteTitle}`,
        content: noteText
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}