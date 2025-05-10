# attio-mcp

This is a fork of [hmk/attio-mcp-server](https://github.com/hmk/attio-mcp-server) with enhanced functionality, adding People object support to the original Attio MCP server.

This MCP server allows Claude and other MCP clients to connect to the [Attio](https://attio.com/) API, an AI-native CRM.

## Current Capabilities

### Company Object Support
- ✅ Search for companies by name using `search-companies`
- ✅ Retrieve company details using `read-company-details`
- ✅ List company notes using `read-company-notes`
- ✅ Create notes for companies using `create-company-note`

### People Object Support
- ✅ Search for people by name using `search-people`
- ✅ Retrieve person details using `read-person-details`
- ✅ List person notes using `read-person-notes`
- ✅ Create notes for people using `create-person-note`

### Future Enhancements (Planned)
- ⬜ Activity tracking and management
- ⬜ Deal/opportunity management
- ⬜ Lists and collections support
- ⬜ Custom field support
- ⬜ Webhook management

## Usage

You will need:

- `ATTIO_API_KEY` 

This is expected to be a *bearer token* which you can get through the [API Explorer](https://developers.attio.com/reference/get_v2-objects) on the right hand side or by configuring OAuth and retrieving one through the Attio API.

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "attio": {
      "command": "npx",
      "args": ["attio-mcp"],
      "env": {
        "ATTIO_API_KEY": "YOUR_ATTIO_API_KEY"
      }
    }
  }
}
```

## Development

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (recommended v22 or higher)
- npm
- git
- dotenv

### Setting up Development Environment

To set up the development environment, follow these steps:

1. Fork the repository

   - Click the "Fork" button in the top-right corner of this repository
   - This creates your own copy of the repository under your Github account

2. Clone Your Fork:

   ```sh
   git clone https://github.com/YOUR_USERNAME/attio-mcp.git
   cd attio-mcp
   ```

3. Add Upstream Remote
   ```sh
   git remote add upstream https://github.com/hmk/attio-mcp-server.git
   ```

4. Copy the dotenv file
    ```sh
    cp .env.template .env
    ```

5. Install dependencies:

   ```sh
   npm install
   ```

6. Run watch to keep files updated during development:

   ```sh
   npm run build:watch
   ```

7. Start the model context protocol development server:

   ```sh
   dotenv npx @modelcontextprotocol/inspector node dist/index.js
   ```

8. If the development server did not load the environment variable correctly, set the `ATTIO_API_KEY` on the left-hand side of the MCP inspector.

## API Features

### Companies API
- `search-companies`: Search for companies by name
- `read-company-details`: Get details for a specific company
- `read-company-notes`: Get notes for a company
- `create-company-note`: Add notes to company records

### People API
- `search-people`: Search for people by name
- `read-person-details`: Get details for a specific person
- `read-person-notes`: Get notes for a person
- `create-person-note`: Add notes to people records

## Contributing

See the [CONTRIBUTING.md](./CONTRIBUTING.md) file for details on how to contribute to this project.