# MCP Namecheap Server

A Model Context Protocol (MCP) server that provides tools for interacting with the Namecheap API. This server allows AI assistants to manage domains, check availability, and configure DNS records through Namecheap.

## Features

- **Domain Management**: List domains, check availability, get domain information
- **DNS Management**: Get and set DNS records, configure custom nameservers
- **Secure**: API keys stored in environment variables
- **Flexible**: Supports both production and sandbox Namecheap APIs
- **MCP Compatible**: Works with any MCP-compatible client

## Prerequisites

- Node.js 20 or higher
- Namecheap account with API access enabled
- API key from Namecheap (get it from https://ap.www.namecheap.com/settings/tools/apiaccess/)

## Installation

### From Source

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mcp-namecheap.git
cd mcp-namecheap
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Namecheap API credentials:
```env
NAMECHEAP_API_KEY=your_api_key_here
NAMECHEAP_API_USER=your_api_username_here
NAMECHEAP_CLIENT_IP=your_whitelisted_ip_here
NAMECHEAP_USE_SANDBOX=true
```

**Important**: You must whitelist your IP address in the Namecheap API settings.

5. Build the project:
```bash
npm run build
```

### Using Docker

1. Build the Docker image:
```bash
docker build -t mcp-namecheap .
```

2. Run with environment variables:
```bash
docker run -i \
  -e NAMECHEAP_API_KEY=your_api_key \
  -e NAMECHEAP_API_USER=your_username \
  -e NAMECHEAP_CLIENT_IP=your_ip \
  -e NAMECHEAP_USE_SANDBOX=true \
  mcp-namecheap
```

## Configuration

### MCP Client Configuration

Add the server to your MCP client configuration:

#### For Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "namecheap": {
      "command": "node",
      "args": ["/path/to/mcp-namecheap/dist/index.js"],
      "env": {
        "NAMECHEAP_API_KEY": "your_api_key",
        "NAMECHEAP_API_USER": "your_username",
        "NAMECHEAP_CLIENT_IP": "your_ip",
        "NAMECHEAP_USE_SANDBOX": "true"
      }
    }
  }
}
```

#### For Smithery

The server is configured to work with Smithery installation. Simply use:

```bash
smithery install mcp-namecheap
```

## Available Tools

### `namecheap_domains_list`
Lists all domains in your Namecheap account.

Parameters:
- `listType` (optional): "ALL", "EXPIRING", or "EXPIRED"
- `searchTerm` (optional): Filter domains by search term
- `page` (optional): Page number for pagination
- `pageSize` (optional): Number of results per page

### `namecheap_domains_check`
Checks if domains are available for registration.

Parameters:
- `domains` (required): Array of domain names to check

### `namecheap_domains_getinfo`
Gets detailed information about a specific domain.

Parameters:
- `domain` (required): Domain name to get information for

### `namecheap_dns_getlist`
Retrieves DNS host records for a domain.

Parameters:
- `sld` (required): Second level domain (e.g., "example" from "example.com")
- `tld` (required): Top level domain (e.g., "com" from "example.com")

### `namecheap_dns_setcustom`
Sets custom nameservers for a domain.

Parameters:
- `sld` (required): Second level domain
- `tld` (required): Top level domain
- `nameservers` (required): Array of nameserver addresses

### `namecheap_dns_sethosts`
Sets DNS host records for a domain.

Parameters:
- `sld` (required): Second level domain
- `tld` (required): Top level domain
- `hosts` (required): Array of DNS records with:
  - `hostname`: Subdomain or "@" for root
  - `recordType`: "A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV", or "CAA"
  - `address`: Value for the DNS record
  - `mxPriority` (optional): Priority for MX records
  - `ttl` (optional): Time to live in seconds

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building

```bash
npm run build
```

### Testing with MCP Inspector

You can test the server using the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector dist/index.js
```

## Security Notes

- Never commit your `.env` file or expose your API keys
- Always use environment variables for sensitive data
- Whitelist only necessary IP addresses in Namecheap
- Use the sandbox API for testing

## Troubleshooting

### "Error 10: Unknown command" 
Make sure your API access is enabled in Namecheap and you're using the correct API endpoint.

### "Error 11: Authentication failed"
Check that:
- Your API key is correct
- Your username matches the API user
- Your IP is whitelisted in Namecheap

### Connection Issues
Ensure the server is running and your MCP client is properly configured with the correct path.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.