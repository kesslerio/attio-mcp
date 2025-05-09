import { getAttioClient } from "./attio-client.js";
import { 
  AttioRecord, 
  AttioNote, 
  ResourceType, 
  AttioListResponse,
  AttioSingleResponse,
  Person,
  Company
} from "../types/attio.js";

/**
 * Generic function to search any object type by name
 * 
 * @param objectType - The type of object to search (people or companies)
 * @param query - Search query string
 * @returns Array of matching records
 */
export async function searchObject<T extends AttioRecord>(
  objectType: ResourceType, 
  query: string
): Promise<T[]> {
  const api = getAttioClient();
  const path = `/objects/${objectType}/records/query`;
  
  try {
    const response = await api.post<AttioListResponse<T>>(path, {
      filter: {
        name: { "$contains": query },
      }
    });
    return response.data.data || [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(`No ${objectType} found matching '${query}'`);
    }
    throw error;
  }
}

/**
 * Generic function to list any object type with pagination and sorting
 * 
 * @param objectType - The type of object to list (people or companies)
 * @param limit - Maximum number of results to return
 * @returns Array of records
 */
export async function listObjects<T extends AttioRecord>(
  objectType: ResourceType, 
  limit: number = 20
): Promise<T[]> {
  const api = getAttioClient();
  const path = `/objects/${objectType}/records/query`;
  
  try {
    const response = await api.post<AttioListResponse<T>>(path, {
      limit,
      sorts: [{ attribute: 'last_interaction', field: 'interacted_at', direction: 'desc' }]
    });
    return response.data.data || [];
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(`Invalid parameters when listing ${objectType}`);
    }
    throw error;
  }
}

/**
 * Generic function to get details for a specific record
 * 
 * @param objectType - The type of object to get (people or companies)
 * @param recordId - ID of the record
 * @returns Record details
 */
export async function getObjectDetails<T extends AttioRecord>(
  objectType: ResourceType, 
  recordId: string
): Promise<T> {
  const api = getAttioClient();
  const path = `/objects/${objectType}/records/${recordId}`;
  
  try {
    const response = await api.get<AttioSingleResponse<T>>(path);
    return response.data.data || response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(`${objectType.charAt(0).toUpperCase() + objectType.slice(1, -1)} with ID ${recordId} not found`);
    }
    throw error;
  }
}

/**
 * Generic function to get notes for a specific record
 * 
 * @param objectType - The type of parent object (people or companies)
 * @param recordId - ID of the parent record
 * @param limit - Maximum number of notes to return
 * @param offset - Number of notes to skip
 * @returns Array of notes
 */
export async function getObjectNotes(
  objectType: ResourceType, 
  recordId: string, 
  limit: number = 10, 
  offset: number = 0
): Promise<AttioNote[]> {
  const api = getAttioClient();
  const path = `/notes?limit=${limit}&offset=${offset}&parent_object=${objectType}&parent_record_id=${recordId}`;
  
  try {
    const response = await api.get<AttioListResponse<AttioNote>>(path);
    return response.data.data || [];
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(`Notes for ${objectType.slice(0, -1)} ${recordId} not found`);
    }
    throw error;
  }
}

/**
 * Generic function to create a note for any object type
 * 
 * @param objectType - The type of parent object (people or companies)
 * @param recordId - ID of the parent record
 * @param noteTitle - Title of the note
 * @param noteText - Content of the note
 * @returns Created note
 */
export async function createObjectNote(
  objectType: ResourceType, 
  recordId: string, 
  noteTitle: string, 
  noteText: string
): Promise<AttioNote> {
  const api = getAttioClient();
  const path = "/notes";
  
  try {
    const response = await api.post<AttioSingleResponse<AttioNote>>(path, {
      data: {
        format: "plaintext",
        parent_object: objectType,
        parent_record_id: recordId,
        title: `[AI] ${noteTitle}`,
        content: noteText
      },
    });
    return response.data.data || response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(`Failed to create note: ${error.response.data.message || 'Invalid parameters'}`);
    } else if (error.response?.status === 404) {
      throw new Error(`${objectType.charAt(0).toUpperCase() + objectType.slice(1, -1)} with ID ${recordId} not found`);
    }
    throw error;
  }
}