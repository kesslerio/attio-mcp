/**
 * Simple HTTP server for Docker health checks
 */
import http from 'http';

// Default port for health check server
const DEFAULT_PORT = 3000;

/**
 * Creates and starts a simple HTTP server for health checks
 * 
 * @param port - Port to listen on (defaults to 3000)
 * @returns The HTTP server instance
 */
export function startHealthServer(port: number = DEFAULT_PORT): http.Server {
  const server = http.createServer((req, res) => {
    // Handle health check endpoint
    if (req.url === '/health') {
      const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '0.0.2'
      };
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(healthStatus));
      return;
    }
    
    // Simple root response
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Attio MCP Server is running. Use /health for health checks.');
      return;
    }
    
    // Handle 404 for other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });
  
  // Start listening on the specified port
  server.listen(port, () => {
    console.log(`Health check server listening on port ${port}`);
  });
  
  return server;
}