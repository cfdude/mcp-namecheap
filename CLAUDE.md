# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server for integrating with Namecheap's API. It provides tools for domain management, DNS configuration, and domain availability checking.

## Development Commands

```bash
# Install dependencies
npm install

# Run in development mode with hot reload
npm run dev

# Build the TypeScript project
npm run build

# Start the production server
npm start
```

## Architecture

### Key Components

1. **`src/index.ts`** - Main MCP server implementation
   - Handles stdio transport for MCP protocol
   - Sets up tool handlers for each Namecheap operation
   - Manages server lifecycle

2. **`src/namecheap-client.ts`** - Namecheap API client
   - Encapsulates all Namecheap API interactions
   - Handles authentication and request formatting
   - Parses XML responses from Namecheap

3. **`src/tools.ts`** - MCP tool definitions
   - Defines available tools and their schemas
   - Documents parameters for each operation

### Environment Configuration

The server requires these environment variables (set in `.env`):
- `NAMECHEAP_API_KEY` - API key from Namecheap
- `NAMECHEAP_API_USER` - API username
- `NAMECHEAP_CLIENT_IP` - Whitelisted IP address
- `NAMECHEAP_USE_SANDBOX` - Use sandbox API (true/false)

### Available Tools

- `namecheap_domains_list` - List domains in account
- `namecheap_domains_check` - Check domain availability
- `namecheap_domains_getinfo` - Get domain details
- `namecheap_dns_getlist` - Get DNS records
- `namecheap_dns_setcustom` - Set custom nameservers
- `namecheap_dns_sethosts` - Set DNS host records

## Important Notes

- The server uses stdio transport for MCP communication
- XML parsing in the client is simplified - consider using a proper XML parser for production
- IP whitelisting is required in Namecheap API settings
- The project supports both Docker deployment and direct Node.js execution