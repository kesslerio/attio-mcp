import axios from "axios";

/**
 * Creates and returns an Axios client configured for Attio API access
 * 
 * @returns Configured Axios instance
 */
export function getAttioClient() {
  // Configure Axios instance with Attio API credentials from environment
  return axios.create({
    baseURL: "https://api.attio.com/v2",
    headers: {
      "Authorization": `Bearer ${process.env.ATTIO_API_KEY}`,
      "Content-Type": "application/json",
    },
  });
}