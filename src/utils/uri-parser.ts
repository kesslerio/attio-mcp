import { ResourceType } from "../types/attio.js";

/**
 * Parses an Attio resource URI into its components
 * 
 * @param uri - The URI to parse (e.g., "attio://companies/abc123")
 * @returns A tuple containing the resource type and ID
 * @throws Error if the URI is invalid
 */
export function parseResourceUri(uri: string): [ResourceType, string] {
  if (!uri || typeof uri !== 'string') {
    throw new Error('Invalid URI: URI must be a non-empty string');
  }
  
  // Check URI format
  const match = uri.match(/^attio:\/\/([a-z]+)\/([^\/]+)$/);
  if (!match) {
    throw new Error(`Invalid Attio URI format: ${uri}. Expected format: attio://<resource_type>/<resource_id>`);
  }
  
  const [, resourceTypeStr, resourceId] = match;
  
  // Validate resource type
  if (!Object.values(ResourceType).includes(resourceTypeStr as ResourceType)) {
    throw new Error(`Invalid resource type: ${resourceTypeStr}. Supported types: ${Object.values(ResourceType).join(', ')}`);
  }
  
  return [resourceTypeStr as ResourceType, resourceId];
}