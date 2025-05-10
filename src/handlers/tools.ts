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
import { parseResourceUri } from "../utils/uri-parser.js";
import { ResourceType, AttioRecord, AttioNote } from "../types/attio.js";

// Tool Configuration Types
interface ToolConfig {
  name: string;
  handler: (...args: any[]) => Promise<any>;
}

interface SearchToolConfig extends ToolConfig {
  formatResult: (results: AttioRecord[]) => string;
}

interface DetailsToolConfig extends ToolConfig {
}

interface NotesToolConfig extends ToolConfig {
}

interface CreateNoteToolConfig extends ToolConfig {
  idParam: string;
}

// Configuration for all tools by resource type
const TOOL_CONFIGS: Record<ResourceType, {
  search: SearchToolConfig;
  details: DetailsToolConfig;
  notes: NotesToolConfig;
  createNote: CreateNoteToolConfig;
}> = {
  [ResourceType.COMPANIES]: {
    search: {
      name: "search-companies",
      handler: searchCompanies,
      formatResult: (results) => results.map((company) => {
        const companyName = company.values?.name?.[0]?.value || "Unknown Company";
        const companyId = company.id?.record_id || "Record ID not found";
        return `${companyName}: attio://companies/${companyId}`;
      }).join("\n"),
    },
    details: {
      name: "read-company-details",
      handler: getCompanyDetails,
    },
    notes: {
      name: "read-company-notes",
      handler: getCompanyNotes,
    },
    createNote: {
      name: "create-company-note",
      handler: createCompanyNote,
      idParam: "companyId",
    },
  },
  [ResourceType.PEOPLE]: {
    search: {
      name: "search-people",
      handler: searchPeople,
      formatResult: (results) => results.map((person) => {
        const personName = person.values?.name?.[0]?.value || "Unknown Person";
        const personId = person.id?.record_id || "Record ID not found";
        return `${personName}: attio://people/${personId}`;
      }).join("\n"),
    },
    details: {
      name: "read-person-details",
      handler: getPersonDetails,
    },
    notes: {
      name: "read-person-notes",
      handler: getPersonNotes,
    },
    createNote: {
      name: "create-person-note",
      handler: createPersonNote,
      idParam: "personId",
    },
  },
};

// Tool definitions including schemas, organized by resource type
const TOOL_DEFINITIONS: Record<ResourceType, Array<{
  name: string;
  description: string;
  inputSchema: any;
}>> = {
  [ResourceType.COMPANIES]: [
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
    }
  ],
  [ResourceType.PEOPLE]: [
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
    }
  ]
};

/**
 * Find the tool config for a given tool name
 * 
 * @param toolName - The name of the tool
 * @returns Tool configuration or undefined if not found
 */
function findToolConfig(toolName: string): { 
  resourceType: ResourceType; 
  toolConfig: ToolConfig; 
  toolType: string;
} | undefined {
  const toolTypes = ['search', 'details', 'notes', 'createNote'] as const;
  
  for (const resourceType of Object.values(ResourceType)) {
    const resourceConfig = TOOL_CONFIGS[resourceType];
    
    for (const toolType of toolTypes) {
      if (resourceConfig[toolType]?.name === toolName) {
        return {
          resourceType,
          toolConfig: resourceConfig[toolType],
          toolType
        };
      }
    }
  }
  return undefined;
}

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
        ...TOOL_DEFINITIONS[ResourceType.COMPANIES],
        ...TOOL_DEFINITIONS[ResourceType.PEOPLE]
      ],
    };
  });

  // Handler for calling tools
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    try {
      const toolInfo = findToolConfig(toolName);
      
      if (!toolInfo) {
        throw new Error(`Tool not found: ${toolName}`);
      }
      
      const { resourceType, toolConfig, toolType } = toolInfo;
      
      // Handle search tools
      if (toolType === 'search') {
        const query = request.params.arguments?.query as string;
        try {
          const searchToolConfig = toolConfig as SearchToolConfig;
          const results = await searchToolConfig.handler(query);
          const formattedResults = searchToolConfig.formatResult(results);
          
          return {
            content: [
              {
                type: "text",
                text: `Found ${results.length} ${resourceType}:\n${formattedResults}`,
              },
            ],
            isError: false,
          };
        } catch (error) {
          return createErrorResult(
            error instanceof Error ? error : new Error("Unknown error"),
            `/objects/${resourceType}/records/query`,
            "POST",
            (error as any).response?.data || {}
          );
        }
      }
      
      // Handle details tools
      if (toolType === 'details') {
        const uri = request.params.arguments?.uri as string;
        
        try {
          const [uriType, id] = parseResourceUri(uri);
          if (uriType !== resourceType) {
            throw new Error(`URI type mismatch: Expected ${resourceType}, got ${uriType}`);
          }
          
          const details = await toolConfig.handler(id);
          return {
            content: [
              {
                type: "text",
                text: `${resourceType.slice(0, -1).charAt(0).toUpperCase() + resourceType.slice(1, -1)} details for ${id}:\n${JSON.stringify(details, null, 2)}`,
              },
            ],
            isError: false,
          };
        } catch (error) {
          return createErrorResult(
            error instanceof Error ? error : new Error("Unknown error"),
            uri,
            "GET",
            (error as any).response?.data || {}
          );
        }
      }
      
      // Handle notes tools
      if (toolType === 'notes') {
        const uri = request.params.arguments?.uri as string;
        const limit = request.params.arguments?.limit as number || 10;
        const offset = request.params.arguments?.offset as number || 0;
        
        try {
          const [uriType, id] = parseResourceUri(uri);
          if (uriType !== resourceType) {
            throw new Error(`URI type mismatch: Expected ${resourceType}, got ${uriType}`);
          }
          
          const notes = await toolConfig.handler(id, limit, offset);
          
          return {
            content: [
              {
                type: "text",
                text: `Found ${notes.length} notes for ${resourceType.slice(0, -1)} ${id}:\n${notes.map((note: any) => JSON.stringify(note)).join("----------\n")}`,
              },
            ],
            isError: false,
          };
        } catch (error) {
          return createErrorResult(
            error instanceof Error ? error : new Error("Unknown error"),
            uri,
            "GET",
            (error as any).response?.data || {}
          );
        }
      }
      
      // Handle create note tools
      if (toolType === 'createNote') {
        const createNoteConfig = toolConfig as CreateNoteToolConfig;
        const idParam = createNoteConfig.idParam;
        const id = request.params.arguments?.[idParam] as string;
        const noteTitle = request.params.arguments?.noteTitle as string;
        const noteText = request.params.arguments?.noteText as string;
        
        try {
          const response = await toolConfig.handler(id, noteTitle, noteText);
          
          return {
            content: [
              {
                type: "text",
                text: `Note added to ${resourceType.slice(0, -1)} ${id}: attio://notes/${response?.id?.note_id}`,
              },
            ],
            isError: false,
          };
        } catch (error) {
          return createErrorResult(
            error instanceof Error ? error : new Error("Unknown error"),
            "/notes",
            "POST",
            (error as any).response?.data || {}
          );
        }
      }
      
      throw new Error(`Tool handler not implemented for tool type: ${toolType}`);
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
