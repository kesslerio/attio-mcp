import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { listCompanies, getCompanyDetails } from "../objects/companies.js";
import { listPeople, getPersonDetails } from "../objects/people.js";
import { createErrorResult } from "../utils/error-handler.js";

/**
 * Handles requests to list resources
 * Currently supports:
 * - Companies
 * - People
 * 
 * @param request - The request to handle
 * @returns Resource listing result
 */
export async function handleListResources(request: typeof ListResourcesRequestSchema._type) {
  try {
    // If resource type specified in request is 'people' 
    if (request.params?.type === 'people') {
      try {
        const people = await listPeople();

        return {
          resources: people.map((person: any) => ({
            uri: `attio://people/${person.id?.record_id}`,
            name: person.values?.name?.[0]?.value || "Unknown Person",
            mimeType: "application/json",
          })),
          description: `Found ${people.length} people that you have interacted with most recently`,
        };
      } catch (error) {
        return createErrorResult(
          error instanceof Error ? error : new Error("Unknown error"),
          "/objects/people/records/query",
          "POST",
          (error as any).response?.data || {}
        );
      }
    }
    
    // Default to companies if no specific type is requested
    try {
      const companies = await listCompanies();

      return {
        resources: companies.map((company: any) => ({
          uri: `attio://companies/${company.id?.record_id}`,
          name: company.values?.name?.[0]?.value || "Unknown Company",
          mimeType: "application/json",
        })),
        description: `Found ${companies.length} companies that you have interacted with most recently`,
      };
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error : new Error("Unknown error"),
        "/objects/companies/records/query",
        "POST",
        (error as any).response?.data || {}
      );
    }
  } catch (error) {
    return createErrorResult(
      error instanceof Error ? error : new Error("Unknown error"),
      "unknown",
      "unknown",
      {}
    );
  }
}

/**
 * Handles requests to read a specific resource
 * Currently supports:
 * - Companies
 * - People
 * 
 * @param request - The request to handle 
 * @returns Resource data result
 */
export async function handleReadResource(request: typeof ReadResourceRequestSchema._type) {
  try {
    // Handle requests for people resources
    if (request.params.uri.startsWith("attio://people/")) {
      const personId = request.params.uri.replace("attio://people/", "");
      try {
        const person = await getPersonDetails(personId);
        
        return {
          contents: [
            {
              uri: request.params.uri,
              text: JSON.stringify(person, null, 2),
              mimeType: "application/json",
            },
          ],
        };
      } catch (error) {
        return createErrorResult(
          error instanceof Error ? error : new Error("Unknown error"),
          `/objects/people/${personId}`,
          "GET",
          (error as any).response?.data || {}
        );
      }
    }
    
    // Handle requests for company resources
    if (request.params.uri.startsWith("attio://companies/")) {
      const companyId = request.params.uri.replace("attio://companies/", "");
      try {
        const company = await getCompanyDetails(companyId);
        
        return {
          contents: [
            {
              uri: request.params.uri,
              text: JSON.stringify(company, null, 2),
              mimeType: "application/json",
            },
          ],
        };
      } catch (error) {
        return createErrorResult(
          error instanceof Error ? error : new Error("Unknown error"),
          `/objects/companies/${companyId}`,
          "GET",
          (error as any).response?.data || {}
        );
      }
    }
    
    throw new Error(`Unsupported resource URI: ${request.params.uri}`);
  } catch (error) {
    return createErrorResult(
      error instanceof Error ? error : new Error("Unknown error"),
      request.params.uri,
      "GET",
      {}
    );
  }
}