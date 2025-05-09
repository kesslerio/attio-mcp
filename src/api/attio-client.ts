/**
 * Attio API client and related utilities
 */
import axios, { AxiosInstance } from "axios";

// Global API client instance
let apiInstance: AxiosInstance | null = null;

/**
 * Creates and configures an Axios instance for the Attio API
 * 
 * @param apiKey - The Attio API key
 * @returns Configured Axios instance
 */
export function createAttioClient(apiKey: string): AxiosInstance {
  return axios.create({
    baseURL: "https://api.attio.com/v2",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Initializes the global API client with the provided API key
 * 
 * @param apiKey - The Attio API key
 */
export function initializeAttioClient(apiKey: string): void {
  apiInstance = createAttioClient(apiKey);
}

/**
 * Gets the global API client instance
 * 
 * @returns The Axios instance for the Attio API
 * @throws If the API client hasn't been initialized
 */
export function getAttioClient(): AxiosInstance {
  if (!apiInstance) {
    throw new Error("API client not initialized. Call initializeAttioClient first.");
  }
  return apiInstance;
}