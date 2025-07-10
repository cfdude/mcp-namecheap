# MCP Namecheap Server

A Model Context Protocol (MCP) server that provides tools for interacting with the Namecheap API. This server allows AI assistants to manage domains, check availability, and configure DNS records through Namecheap.

## Features

- **Domain Management**: List domains, check availability, get domain information
- **DNS Management**: Get and set DNS records, configure custom nameservers
- **Secure**: API keys stored in environment variables
- **Flexible**: Supports both production and sandbox Namecheap APIs
- **MCP Compatible**: Works with any MCP-compatible client

## Prerequisites

- Node.js 18 or higher
- Namecheap account with API access enabled
- Production API key from Namecheap (get it from https://ap.www.namecheap.com/settings/tools/apiaccess/)
- Sandbox API key for testing (register at https://www.sandbox.namecheap.com and enable API access)

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
# Production API Key (from Namecheap account settings)
NAMECHEAP_API_KEY=your_production_api_key_here

# Sandbox API Key (from https://www.sandbox.namecheap.com)
NAMECHEAP_SANDBOX_API_KEY=your_sandbox_api_key_here

NAMECHEAP_API_USER=your_api_username_here
NAMECHEAP_CLIENT_IP=your_whitelisted_ip_here

# Set to 'true' to use sandbox API, 'false' for production
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
  -e NAMECHEAP_API_KEY=your_production_api_key \
  -e NAMECHEAP_SANDBOX_API_KEY=your_sandbox_api_key \
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
        "NAMECHEAP_API_KEY": "your_production_api_key",
        "NAMECHEAP_SANDBOX_API_KEY": "your_sandbox_api_key",
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

### Domain Management Tools

#### `namecheap_domains_list`
Lists all domains in your Namecheap account.

Parameters:
- `listType` (optional): "ALL", "EXPIRING", or "EXPIRED"
- `searchTerm` (optional): Filter domains by search term
- `page` (optional): Page number for pagination
- `pageSize` (optional): Number of results per page
- `sortBy` (optional): Sort order - "NAME", "NAME_DESC", "EXPIREDATE", "EXPIREDATE_DESC", "CREATEDATE", "CREATEDATE_DESC"

#### `namecheap_domains_check`
Checks if domains are available for registration. **Supports bulk checking!**

Parameters:
- `domainList` (required): Array of domain names to check (can check multiple domains at once)

#### `namecheap_domains_getinfo`
Gets detailed information about a specific domain.

Parameters:
- `domainName` (required): Domain name to get information for
- `hostName` (optional): Hosted domain name for which domain information needs to be requested

#### `namecheap_domains_getcontacts`
Gets contact information for a domain.

Parameters:
- `domainName` (required): Domain name to get contacts for

#### `namecheap_domains_create`
Registers a new domain name.

Parameters:
- `domainName` (required): Domain name to register
- `years` (required): Number of years to register (1-10)
- `registrantFirstName` (required): Registrant first name
- `registrantLastName` (required): Registrant last name
- `registrantAddress1` (required): Registrant address
- `registrantCity` (required): Registrant city
- `registrantStateProvince` (required): Registrant state/province
- `registrantPostalCode` (required): Registrant postal code
- `registrantCountry` (required): Registrant country code (e.g., "US")
- `registrantPhone` (required): Registrant phone number
- `registrantEmailAddress` (required): Registrant email address
- Additional optional contact fields for admin, tech, and billing contacts
- `nameservers` (optional): Comma-separated list of nameservers
- `addFreeWhoisguard` (optional): "yes" or "no" (default: "yes")
- `wgEnabled` (optional): Enable WhoisGuard privacy protection "yes" or "no" (default: "yes")

#### `namecheap_domains_gettldlist`
Gets a list of all supported TLDs (Top Level Domains).

No parameters required.

#### `namecheap_domains_setcontacts`
Updates contact information for a domain.

Parameters:
- `domainName` (required): Domain name to update
- Various contact fields (all optional) for registrant, admin, tech, and billing contacts

#### `namecheap_domains_reactivate`
Reactivates an expired domain.

Parameters:
- `domainName` (required): Domain name to reactivate
- `isPremiumDomain` (optional): Whether this is a premium domain (default: false)

#### `namecheap_domains_renew`
Renews an expiring domain.

Parameters:
- `domainName` (required): Domain name to renew
- `years` (required): Number of years to renew (1-10)
- `isPremiumDomain` (optional): Whether this is a premium domain (default: false)

#### `namecheap_domains_getregistrarlock`
Gets the registrar lock status of a domain.

Parameters:
- `domainName` (required): Domain name to check lock status

#### `namecheap_domains_setregistrarlock`
Sets the registrar lock status for a domain.

Parameters:
- `domainName` (required): Domain name to lock/unlock
- `lockAction` (required): "LOCK" or "UNLOCK"

### DNS Management Tools

#### `namecheap_dns_getlist`
Retrieves DNS host records for a domain.

Parameters:
- `sld` (required): Second level domain (e.g., "example" from "example.com")
- `tld` (required): Top level domain (e.g., "com" from "example.com")

#### `namecheap_dns_setcustom`
Sets custom nameservers for a domain.

Parameters:
- `sld` (required): Second level domain
- `tld` (required): Top level domain
- `nameservers` (required): Array of nameserver addresses

#### `namecheap_dns_sethosts`
Sets DNS host records for a domain.

Parameters:
- `sld` (required): Second level domain
- `tld` (required): Top level domain
- `hosts` (required): Array of DNS records with:
  - `hostname`: Subdomain or "@" for root
  - `recordType`: "A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV", or "CAA"
  - `address`: Value for the DNS record
  - `mxPriority` (optional): Priority for MX records
  - `ttl` (optional): Time to live in seconds (default: 1800)

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