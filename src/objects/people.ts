import { 
  searchObject, 
  listObjects, 
  getObjectDetails, 
  getObjectNotes, 
  createObjectNote 
} from "../api/attio-operations.js";
import { 
  ResourceType, 
  Person, 
  AttioNote 
} from "../types/attio.js";

/**
 * Searches for people by name
 * 
 * @param query - Search query string
 * @returns Array of person results
 */
export async function searchPeople(query: string): Promise<Person[]> {
  return searchObject<Person>(ResourceType.PEOPLE, query);
}

/**
 * Lists all people with optional limit and sorting
 * 
 * @param limit - Maximum number of results to return
 * @returns Array of people
 */
export async function listPeople(limit: number = 20): Promise<Person[]> {
  return listObjects<Person>(ResourceType.PEOPLE, limit);
}

/**
 * Gets detailed information for a specific person
 * 
 * @param personId - ID of the person
 * @returns Person details
 */
export async function getPersonDetails(personId: string): Promise<Person> {
  return getObjectDetails<Person>(ResourceType.PEOPLE, personId);
}

/**
 * Gets notes for a specific person
 * 
 * @param personId - ID of the person
 * @param limit - Maximum number of notes to return
 * @param offset - Number of notes to skip
 * @returns Array of person notes
 */
export async function getPersonNotes(
  personId: string, 
  limit: number = 10, 
  offset: number = 0
): Promise<AttioNote[]> {
  return getObjectNotes(ResourceType.PEOPLE, personId, limit, offset);
}

/**
 * Creates a new note for a person
 * 
 * @param personId - ID of the person
 * @param noteTitle - Title of the note
 * @param noteText - Content of the note
 * @returns Created note response
 */
export async function createPersonNote(
  personId: string, 
  noteTitle: string, 
  noteText: string
): Promise<AttioNote> {
  return createObjectNote(ResourceType.PEOPLE, personId, noteTitle, noteText);
}