/**
 * Handlers for tool-related requests
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { createErrorResult } from "../utils/error-handler.js";
import { 
  searchCompanies, 
  getCompanyDetails, 
  getCompanyNotes, 
  createCompanyNote 
} from "../objects/companies.js";
import {
  searchPeople,
  getPersonDetails,
  getPersonNotes,
  createPersonNote
} from "../objects/people.js";

/**
 * Registers tool-related request handlers with the server
 * 
 * @param server - The MCP server instance
 */
export function registerToolHandlers(server: Server): void {
  // Handler for listing available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        // Company tools
        {
          name: "search-companies",
          description: "Search for companies by name",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Company name or keyword to search for",
              },
            },
            required: ["query"],
          },
        },
        {
          name: "read-company-details",
          description: "Read details of a company",
          inputSchema: {
            type: "object",
            properties: {
              uri: {
                type: "string",
                description: "URI of the company to read",
              },
            },
            required: ["uri"],
          },
        },
        {
          name: "read-company-notes",
          description: "Read notes for a company",
          inputSchema: {
            type: "object",
            properties: {
              uri: {
                type: "string",
                description: "URI of the company to read notes for",
              },
              limit: {
                type: "number",
                description: "Maximum number of notes to fetch (optional, default 10)",
              },
              offset: {
                type: "number",
                description: "Number of notes to skip (optional, default 0)",
              },
            },
            required: ["uri"],
          },
        },
        {
          name: "create-company-note",
          description: "Add a new note to a company",
          inputSchema: {
            type: "object",
            properties: {
              companyId: {
                type: "string",
                description: "ID of the company to add the note to",
              },
              noteTitle: {
                type: "string",
                description: "Title of the note",
              },
              noteText: {
                type: "string",
                description: "Text content of the note",
              },
            },
            required: ["companyId", "noteTitle", "noteText"],
          },
        },
        
        // People tools
        {
          name: "search-people",
          description: "Search for people by name",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Person name or keyword to search for",
              },
            },
            required: ["query"],
          },
        },
        {
          name: "read-person-details",
          description: "Read details of a person",
          inputSchema: {
            type: "object",
            properties: {
              uri: {
                type: "string",
                description: "URI of the person to read",
              },
            },
            required: ["uri"],
          },
        },
        {
          name: "read-person-notes",
          description: "Read notes for a person",
          inputSchema: {
            type: "object",
            properties: {
              uri: {
                type: "string",
                description: "URI of the person to read notes for",
              },
              limit: {
                type: "number",
                description: "Maximum number of notes to fetch (optional, default 10)",
              },
              offset: {
                type: "number",
                description: "Number of notes to skip (optional, default 0)",
              },
            },
            required: ["uri"],
          },
        },
        {
          name: "create-person-note",
          description: "Add a new note to a person",
          inputSchema: {
            type: "object",
            properties: {
              personId: {
                type: "string",
                description: "ID of the person to add the note to",
              },
              noteTitle: {
                type: "string",
                description: "Title of the note",
              },
              noteText: {
                type: "string",
                description: "Text content of the note",
              },
            },
            required: ["personId", "noteTitle", "noteText"],
          },
        },
      ],
    };
  });

  // Handler for calling tools
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    try {
      // Company tools
      if (toolName === "search-companies") {
        const query = request.params.arguments?.query as string;
        try {
          const results = await searchCompanies(query);

          const companies = results.map((company: any) => {
            const companyName = company.values?.name?.[0]?.value || "Unknown Company";
            const companyId = company.id?.record_id || "Record ID not found";
            return `${companyName}: attio://companies/${companyId}`;
          }).join("\n");
          
          return {
            content: [
              {
                type: "text",
                text: `Found ${results.length} companies:\n${companies}`,
              },
            ],
            isError: false,
          };
        } catch (error) {
          return createErrorResult(
            error instanceof Error ? error : new Error("Unknown error"),
            "/objects/companies/records/query",
            "GET",
            (error as any).response?.data || {}
          );
        }
      }

      if (toolName === "read-company-details") {
        const uri = request.params.arguments?.uri as string;
        const companyId = uri.replace("attio://companies/", "");
        try {
          const company = await getCompanyDetails(companyId);
          return {
            content: [
              {
                type: "text",
                text: `Company details for ${companyId}:\n${JSON.stringify(company, null, 2)}`,
              },
            ],
            isError: false,
          };
        } catch (error) {
          return createErrorResult(
            error instanceof Error ? error : new Error("Unknown error"),
            `/objects/companies/records/${companyId}`,
            "GET",
            (error as any).response?.data || {}
          );
        }
      }

      if (toolName === "read-company-notes") {
        const uri = request.params.arguments?.uri as string;
        const limit = request.params.arguments?.limit as number || 10;
        const offset = request.params.arguments?.offset as number || 0;
        const companyId = uri.replace("attio://companies/", "");
        try {
          const notes = await getCompanyNotes(companyId, limit, offset);
          return {
            content: [
              {
                type: "text",
                text: `Found ${notes.length} notes for company ${companyId}:\n${notes.map((note: any) => JSON.stringify(note)).join("----------\n")}`,
              },
            ],
            isError: false,
          };
        } catch (error) {
          return createErrorResult(
            error instanceof Error ? error : new Error("Unknown error"),
            `/notes?parent_object=companies&parent_record_id=${companyId}`,
            "GET",
            (error as any).response?.data || {}
          );
        }
      }

      if (toolName === "create-company-note") {
        const companyId = request.params.arguments?.companyId as string;
        const noteTitle = request.params.arguments?.noteTitle as string;
        const noteText = request.params.arguments?.noteText as string;
        try {
          const response = await createCompanyNote(companyId, noteTitle, noteText);
          return {
            content: [
              {
                type: "text",
                text: `Note added to company ${companyId}: attio://notes/${response?.id?.note_id}`,
              },
            ],
            isError: false,
          };
        } catch (error) {
          return createErrorResult(
            error instanceof Error ? error : new Error("Unknown error"),
            "notes",
            "POST",
            (error as any).response?.data || {}
          );
        }
      }

      // People tools
      if (toolName === "search-people") {
        const query = request.params.arguments?.query as string;
        try {
          const results = await searchPeople(query);

          const people = results.map((person: any) => {
            const personName = person.values?.name?.[0]?.value || "Unknown Person";
            const personId = person.id?.record_id || "Record ID not found";
            return `${personName}: attio://people/${personId}`;
          }).join("\n");
          
          return {
            content: [
              {
                type: "text",
                text: `Found ${results.length} people:\n${people}`,
              },
            ],
            isError: false,
          };
        } catch (error) {
          return createErrorResult(
            error instanceof Error ? error : new Error("Unknown error"),
            "/objects/people/records/query",
            "GET",
            (error as any).response?.data || {}
          );
        }
      }

      if (toolName === "read-person-details") {
        const uri = request.params.arguments?.uri as string;
        const personId = uri.replace("attio://people/", "");
        try {
          const person = await getPersonDetails(personId);
          return {
            content: [
              {
                type: "text",
                text: `Person details for ${personId}:\n${JSON.stringify(person, null, 2)}`,
              },
            ],
            isError: false,
          };
        } catch (error) {
          return createErrorResult(
            error instanceof Error ? error : new Error("Unknown error"),
            `/objects/people/records/${personId}`,
            "GET",
            (error as any).response?.data || {}
          );
        }
      }

      if (toolName === "read-person-notes") {
        const uri = request.params.arguments?.uri as string;
        const limit = request.params.arguments?.limit as number || 10;
        const offset = request.params.arguments?.offset as number || 0;
        const personId = uri.replace("attio://people/", "");
        try {
          const notes = await getPersonNotes(personId, limit, offset);
          return {
            content: [
              {
                type: "text",
                text: `Found ${notes.length} notes for person ${personId}:\n${notes.map((note: any) => JSON.stringify(note)).join("----------\n")}`,
              },
            ],
            isError: false,
          };
        } catch (error) {
          return createErrorResult(
            error instanceof Error ? error : new Error("Unknown error"),
            `/notes?parent_object=people&parent_record_id=${personId}`,
            "GET",
            (error as any).response?.data || {}
          );
        }
      }

      if (toolName === "create-person-note") {
        const personId = request.params.arguments?.personId as string;
        const noteTitle = request.params.arguments?.noteTitle as string;
        const noteText = request.params.arguments?.noteText as string;
        try {
          const response = await createPersonNote(personId, noteTitle, noteText);
          return {
            content: [
              {
                type: "text",
                text: `Note added to person ${personId}: attio://notes/${response?.id?.note_id}`,
              },
            ],
            isError: false,
          };
        } catch (error) {
          return createErrorResult(
            error instanceof Error ? error : new Error("Unknown error"),
            "notes",
            "POST",
            (error as any).response?.data || {}
          );
        }
      }

      throw new Error("Tool not found");
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error executing tool '${toolName}': ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  });
}