// Simple script to debug MCP server
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, 'dist', 'index.js');

// Set environment variables for the server
process.env.ATTIO_API_KEY = process.env.ATTIO_API_KEY || 'd05f5fdc4eb331b9a4c0b49b873ced274f13ef3259da06db1792863cbe1160b2';
process.env.PORT = process.env.PORT || '9876';
process.env.DEBUG = 'true'; // Enable debug mode

console.log(`Starting MCP server with:`);
console.log(`- Server path: ${serverPath}`);
console.log(`- API Key: ${process.env.ATTIO_API_KEY?.substring(0, 5)}...`);
console.log(`- Port: ${process.env.PORT}`);

// Start the server process
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: process.env
});

server.on('error', (err) => {
  console.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});

// Handle process signals to gracefully shut down
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  server.kill('SIGTERM');
  process.exit(0);
});