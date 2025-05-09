/**
 * Handlers for resource-related requests
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { createErrorResult } from "../utils/error-handler.js";
import { listCompanies, getCompanyDetails } from "../objects/companies.js";
import { listPeople, getPersonDetails } from "../objects/people.js";

/**
 * Registers resource-related request handlers with the server
 * 
 * @param server - The MCP server instance
 */
export function registerResourceHandlers(server: Server): void {
  // Handler for listing resources (Companies and People)
  server.setRequestHandler(ListResourcesRequestSchema, async (request) => {
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
    } else {
      // Default to companies when no specific type is requested
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
    }
  });

  // Handler for reading resource details (Companies and People)
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    // Handle people resources
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
          `/objects/people/records/${personId}`,
          "GET",
          (error as any).response?.data || {}
        );
      }
    } else if (request.params.uri.startsWith("attio://companies/")) {
      // Handle company resources
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
          `/objects/companies/records/${companyId}`,
          "GET",
          (error as any).response?.data || {}
        );
      }
    } else {
      // Handle unknown resource type
      return createErrorResult(
        new Error("Unsupported resource type"),
        request.params.uri,
        "GET",
        { status: 400 }
      );
    }
  });
}