import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const namecheapTools: Tool[] = [
  {
    name: 'namecheap_domains_list',
    description: 'Get a list of domains in your Namecheap account',
    inputSchema: {
      type: 'object',
      properties: {
        listType: {
          type: 'string',
          description: 'Type of list: ALL, EXPIRING, EXPIRED',
          enum: ['ALL', 'EXPIRING', 'EXPIRED'],
          default: 'ALL',
        },
        searchTerm: {
          type: 'string',
          description: 'Filter domains by search term',
        },
        page: {
          type: 'number',
          description: 'Page number (pagination)',
          default: 1,
        },
        pageSize: {
          type: 'number',
          description: 'Number of domains per page',
          default: 20,
        },
      },
    },
  },
  {
    name: 'namecheap_domains_check',
    description: 'Check if domains are available for registration',
    inputSchema: {
      type: 'object',
      properties: {
        domains: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'List of domain names to check',
        },
      },
      required: ['domains'],
    },
  },
  {
    name: 'namecheap_domains_getinfo',
    description: 'Get detailed information about a specific domain',
    inputSchema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          description: 'Domain name to get information for',
        },
      },
      required: ['domain'],
    },
  },
  {
    name: 'namecheap_dns_getlist',
    description: 'Get DNS host records for a domain',
    inputSchema: {
      type: 'object',
      properties: {
        sld: {
          type: 'string',
          description: 'Second level domain (e.g., "example" from "example.com")',
        },
        tld: {
          type: 'string',
          description: 'Top level domain (e.g., "com" from "example.com")',
        },
      },
      required: ['sld', 'tld'],
    },
  },
  {
    name: 'namecheap_dns_setcustom',
    description: 'Set custom nameservers for a domain',
    inputSchema: {
      type: 'object',
      properties: {
        sld: {
          type: 'string',
          description: 'Second level domain',
        },
        tld: {
          type: 'string',
          description: 'Top level domain',
        },
        nameservers: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'List of nameserver addresses',
        },
      },
      required: ['sld', 'tld', 'nameservers'],
    },
  },
  {
    name: 'namecheap_dns_sethosts',
    description: 'Set DNS host records for a domain',
    inputSchema: {
      type: 'object',
      properties: {
        sld: {
          type: 'string',
          description: 'Second level domain',
        },
        tld: {
          type: 'string',
          description: 'Top level domain',
        },
        hosts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              hostname: {
                type: 'string',
                description: 'Subdomain or @ for root',
              },
              recordType: {
                type: 'string',
                enum: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV', 'CAA'],
                description: 'DNS record type',
              },
              address: {
                type: 'string',
                description: 'Value for the DNS record',
              },
              mxPriority: {
                type: 'number',
                description: 'Priority for MX records',
              },
              ttl: {
                type: 'number',
                description: 'Time to live in seconds',
                default: 1800,
              },
            },
            required: ['hostname', 'recordType', 'address'],
          },
          description: 'Array of DNS host records',
        },
      },
      required: ['sld', 'tld', 'hosts'],
    },
  },
];