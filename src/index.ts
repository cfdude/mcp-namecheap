#!/usr/bin/env node
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
  DnsGetListParams,
  DnsSetCustomParams,
  DnsSetHostsParams
} from './types.js';

dotenv.config();

const API_KEY = process.env.NAMECHEAP_API_KEY;
const API_USER = process.env.NAMECHEAP_API_USER;
const CLIENT_IP = process.env.NAMECHEAP_CLIENT_IP;
const USE_SANDBOX = process.env.NAMECHEAP_USE_SANDBOX === 'true';

if (!API_KEY || !API_USER || !CLIENT_IP) {
  console.error('Missing required environment variables: NAMECHEAP_API_KEY, NAMECHEAP_API_USER, NAMECHEAP_CLIENT_IP');
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
    
    this.server.onerror = (error) => console.error('[MCP Error]', error);
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
    const { domains } = args;
    if (!domains || !Array.isArray(domains)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'domains parameter must be an array'
      );
    }
    
    const result = await this.namecheapClient.domainsCheck(domains);
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
    const { domain } = args;
    if (!domain) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'domain parameter is required'
      );
    }
    
    const result = await this.namecheapClient.domainsGetInfo(domain);
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
    console.error('Namecheap MCP server running on stdio');
  }
}

const server = new NamecheapMcpServer();
server.run().catch(console.error);