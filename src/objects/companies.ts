import { 
  searchObject, 
  listObjects, 
  getObjectDetails, 
  getObjectNotes, 
  createObjectNote 
} from "../api/attio-operations.js";
import { 
  ResourceType, 
  Company, 
  AttioNote 
} from "../types/attio.js";

/**
 * Searches for companies by name
 * 
 * @param query - Search query string
 * @returns Array of company results
 */
export async function searchCompanies(query: string): Promise<Company[]> {
  return searchObject<Company>(ResourceType.COMPANIES, query);
}

/**
 * Lists all companies with optional limit and sorting
 * 
 * @param limit - Maximum number of results to return
 * @returns Array of companies
 */
export async function listCompanies(limit: number = 20): Promise<Company[]> {
  return listObjects<Company>(ResourceType.COMPANIES, limit);
}

/**
 * Gets detailed information for a specific company
 * 
 * @param companyId - ID of the company
 * @returns Company details
 */
export async function getCompanyDetails(companyId: string): Promise<Company> {
  return getObjectDetails<Company>(ResourceType.COMPANIES, companyId);
}

/**
 * Gets notes for a specific company
 * 
 * @param companyId - ID of the company
 * @param limit - Maximum number of notes to return
 * @param offset - Number of notes to skip
 * @returns Array of company notes
 */
export async function getCompanyNotes(
  companyId: string, 
  limit: number = 10, 
  offset: number = 0
): Promise<AttioNote[]> {
  return getObjectNotes(ResourceType.COMPANIES, companyId, limit, offset);
}

/**
 * Creates a new note for a company
 * 
 * @param companyId - ID of the company
 * @param noteTitle - Title of the note
 * @param noteText - Content of the note
 * @returns Created note response
 */
export async function createCompanyNote(
  companyId: string, 
  noteTitle: string, 
  noteText: string
): Promise<AttioNote> {
  return createObjectNote(ResourceType.COMPANIES, companyId, noteTitle, noteText);
}