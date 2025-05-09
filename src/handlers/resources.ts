/**
 * Handlers for resource-related requests
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { createErrorResult } from "../utils/error-handler.js";
import { listCompanies, getCompanyDetails } from "../objects/companies.js";

/**
 * Registers resource-related request handlers with the server
 * 
 * @param server - The MCP server instance
 */
export function registerResourceHandlers(server: Server): void {
  // Handler for listing resources (Companies)
  server.setRequestHandler(ListResourcesRequestSchema, async (request) => {
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
  });

  // Handler for reading resource details (Companies)
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
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
  });
}