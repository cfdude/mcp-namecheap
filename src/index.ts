#!/usr/bin/env node --no-warnings

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { NamecheapClient } from './namecheap-client.js';
import { namecheapTools } from './tools.js';
import type {
  DomainsListParams,
  DomainsCheckParams,
  DomainsGetInfoParams,
  DomainsGetContactsParams,
  DomainsCreateParams,
  DomainsGetTldListParams,
  DomainsSetContactsParams,
  DomainsReactivateParams,
  DomainsRenewParams,
  DomainsGetRegistrarLockParams,
  DomainsSetRegistrarLockParams,
  DnsGetListParams,
  DnsSetCustomParams,
  DnsSetHostsParams
} from './types.js';

// Load environment variables from .env file for development
// Claude Desktop will pass them directly via config
dotenv.config();

const USE_SANDBOX = process.env.NAMECHEAP_USE_SANDBOX === 'true';
const API_KEY = USE_SANDBOX 
  ? process.env.NAMECHEAP_SANDBOX_API_KEY 
  : process.env.NAMECHEAP_API_KEY;
const API_USER = process.env.NAMECHEAP_API_USER;
const CLIENT_IP = process.env.NAMECHEAP_CLIENT_IP;

if (!API_KEY || !API_USER || !CLIENT_IP) {
  // Write to stderr to avoid interfering with MCP protocol on stdout
  process.stderr.write('Missing required environment variables: NAMECHEAP_API_KEY/NAMECHEAP_SANDBOX_API_KEY, NAMECHEAP_API_USER, NAMECHEAP_CLIENT_IP\n');
  process.stderr.write(`Current env: USE_SANDBOX=${USE_SANDBOX}, API_KEY=${API_KEY ? 'set' : 'missing'}, API_USER=${API_USER || 'missing'}, CLIENT_IP=${CLIENT_IP || 'missing'}\n`);
  process.stderr.write(`Working directory: ${process.cwd()}\n`);
  process.exit(1);
}

class NamecheapMcpServer {
  private server: Server;
  private namecheapClient: NamecheapClient;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-namecheap',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.namecheapClient = new NamecheapClient(
      API_KEY!,
      API_USER!,
      CLIENT_IP!,
      USE_SANDBOX
    );

    this.setupHandlers();
    
    this.server.onerror = (error) => process.stderr.write(`[MCP Error] ${error}\n`);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: namecheapTools,
    }));

    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request) => {
        const { name, arguments: args } = request.params;

        try {
          switch (name) {
            case 'namecheap_domains_list':
              return await this.handleDomainsList((args as unknown as DomainsListParams) || {});
            
            case 'namecheap_domains_check':
              return await this.handleDomainsCheck(args as unknown as DomainsCheckParams);
            
            case 'namecheap_domains_getinfo':
              return await this.handleDomainsGetInfo(args as unknown as DomainsGetInfoParams);
            
            case 'namecheap_domains_getcontacts':
              return await this.handleDomainsGetContacts(args as unknown as DomainsGetContactsParams);
            
            case 'namecheap_domains_create':
              return await this.handleDomainsCreate(args as unknown as DomainsCreateParams);
            
            case 'namecheap_domains_gettldlist':
              return await this.handleDomainsGetTldList(args as unknown as DomainsGetTldListParams);
            
            case 'namecheap_domains_setcontacts':
              return await this.handleDomainsSetContacts(args as unknown as DomainsSetContactsParams);
            
            case 'namecheap_domains_reactivate':
              return await this.handleDomainsReactivate(args as unknown as DomainsReactivateParams);
            
            case 'namecheap_domains_renew':
              return await this.handleDomainsRenew(args as unknown as DomainsRenewParams);
            
            case 'namecheap_domains_getregistrarlock':
              return await this.handleDomainsGetRegistrarLock(args as unknown as DomainsGetRegistrarLockParams);
            
            case 'namecheap_domains_setregistrarlock':
              return await this.handleDomainsSetRegistrarLock(args as unknown as DomainsSetRegistrarLockParams);
            
            case 'namecheap_dns_getlist':
              return await this.handleDnsGetList(args as unknown as DnsGetListParams);
            
            case 'namecheap_dns_setcustom':
              return await this.handleDnsSetCustom(args as unknown as DnsSetCustomParams);
            
            case 'namecheap_dns_sethosts':
              return await this.handleDnsSetHosts(args as unknown as DnsSetHostsParams);
            
            default:
              throw new McpError(
                ErrorCode.MethodNotFound,
                `Unknown tool: ${name}`
              );
          }
        } catch (error) {
          if (error instanceof McpError) throw error;
          
          throw new McpError(
            ErrorCode.InternalError,
            `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }
    );
  }

  private async handleDomainsList(args: DomainsListParams) {
    const result = await this.namecheapClient.domainsList(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleDomainsCheck(args: DomainsCheckParams) {
    const { domainList } = args;
    if (!domainList || !Array.isArray(domainList)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'domainList parameter must be an array'
      );
    }
    
    const result = await this.namecheapClient.domainsCheck(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleDomainsGetInfo(args: DomainsGetInfoParams) {
    const { domainName } = args;
    if (!domainName) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'domainName parameter is required'
      );
    }
    
    const result = await this.namecheapClient.domainsGetInfo(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleDomainsGetContacts(args: DomainsGetContactsParams) {
    const { domainName } = args;
    if (!domainName) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'domainName parameter is required'
      );
    }
    
    const result = await this.namecheapClient.domainsGetContacts(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleDomainsCreate(args: DomainsCreateParams) {
    const result = await this.namecheapClient.domainsCreate(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleDomainsGetTldList(args: DomainsGetTldListParams) {
    const result = await this.namecheapClient.domainsGetTldList(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleDomainsSetContacts(args: DomainsSetContactsParams) {
    const { domainName } = args;
    if (!domainName) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'domainName parameter is required'
      );
    }
    
    const result = await this.namecheapClient.domainsSetContacts(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleDomainsReactivate(args: DomainsReactivateParams) {
    const { domainName } = args;
    if (!domainName) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'domainName parameter is required'
      );
    }
    
    const result = await this.namecheapClient.domainsReactivate(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleDomainsRenew(args: DomainsRenewParams) {
    const { domainName, years } = args;
    if (!domainName || !years) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'domainName and years parameters are required'
      );
    }
    
    const result = await this.namecheapClient.domainsRenew(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleDomainsGetRegistrarLock(args: DomainsGetRegistrarLockParams) {
    const { domainName } = args;
    if (!domainName) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'domainName parameter is required'
      );
    }
    
    const result = await this.namecheapClient.domainsGetRegistrarLock(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleDomainsSetRegistrarLock(args: DomainsSetRegistrarLockParams) {
    const { domainName, lockAction } = args;
    if (!domainName || !lockAction) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'domainName and lockAction parameters are required'
      );
    }
    
    const result = await this.namecheapClient.domainsSetRegistrarLock(args);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleDnsGetList(args: DnsGetListParams) {
    const { sld, tld } = args;
    if (!sld || !tld) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'sld and tld parameters are required'
      );
    }
    
    const result = await this.namecheapClient.dnsGetList(sld, tld);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleDnsSetCustom(args: DnsSetCustomParams) {
    const { sld, tld, nameservers } = args;
    if (!sld || !tld || !nameservers || !Array.isArray(nameservers)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'sld, tld, and nameservers (array) parameters are required'
      );
    }
    
    const result = await this.namecheapClient.dnsSetCustom(sld, tld, nameservers);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleDnsSetHosts(args: DnsSetHostsParams) {
    const { sld, tld, hosts } = args;
    if (!sld || !tld || !hosts || !Array.isArray(hosts)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'sld, tld, and hosts (array) parameters are required'
      );
    }
    
    const result = await this.namecheapClient.dnsSetHosts(sld, tld, hosts);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    // Use stderr for status messages
    process.stderr.write('Namecheap MCP server running on stdio\n');
  }
}

const server = new NamecheapMcpServer();
server.run().catch((error) => {
  process.stderr.write(`Server error: ${error}\n`);
  process.exit(1);
});