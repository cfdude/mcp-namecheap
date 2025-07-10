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
        sortBy: {
          type: 'string',
          description: 'Sort order for results',
          enum: ['NAME', 'NAME_DESC', 'EXPIREDATE', 'EXPIREDATE_DESC', 'CREATEDATE', 'CREATEDATE_DESC'],
        },
      },
    },
  },
  {
    name: 'namecheap_domains_check',
    description: 'Check if domains are available for registration (supports bulk checks)',
    inputSchema: {
      type: 'object',
      properties: {
        domainList: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'List of domain names to check (supports bulk lookup)',
        },
      },
      required: ['domainList'],
    },
  },
  {
    name: 'namecheap_domains_getinfo',
    description: 'Get detailed information about a specific domain',
    inputSchema: {
      type: 'object',
      properties: {
        domainName: {
          type: 'string',
          description: 'Domain name to get information for',
        },
        hostName: {
          type: 'string',
          description: 'Hosted domain name for which domain information needs to be requested',
        },
      },
      required: ['domainName'],
    },
  },
  {
    name: 'namecheap_domains_getcontacts',
    description: 'Get contact information for a domain',
    inputSchema: {
      type: 'object',
      properties: {
        domainName: {
          type: 'string',
          description: 'Domain name to get contacts for',
        },
      },
      required: ['domainName'],
    },
  },
  {
    name: 'namecheap_domains_create',
    description: 'Register a new domain name',
    inputSchema: {
      type: 'object',
      properties: {
        domainName: {
          type: 'string',
          description: 'Domain name to register',
        },
        years: {
          type: 'number',
          description: 'Number of years to register (1-10)',
          minimum: 1,
          maximum: 10,
        },
        registrantFirstName: {
          type: 'string',
          description: 'Registrant first name',
        },
        registrantLastName: {
          type: 'string',
          description: 'Registrant last name',
        },
        registrantAddress1: {
          type: 'string',
          description: 'Registrant address line 1',
        },
        registrantCity: {
          type: 'string',
          description: 'Registrant city',
        },
        registrantStateProvince: {
          type: 'string',
          description: 'Registrant state/province',
        },
        registrantPostalCode: {
          type: 'string',
          description: 'Registrant postal code',
        },
        registrantCountry: {
          type: 'string',
          description: 'Registrant country code (e.g., US)',
        },
        registrantPhone: {
          type: 'string',
          description: 'Registrant phone number',
        },
        registrantEmailAddress: {
          type: 'string',
          description: 'Registrant email address',
        },
        registrantOrganizationName: {
          type: 'string',
          description: 'Registrant organization name (optional)',
        },
        techFirstName: {
          type: 'string',
          description: 'Tech contact first name (optional, defaults to registrant)',
        },
        techLastName: {
          type: 'string',
          description: 'Tech contact last name (optional)',
        },
        techEmailAddress: {
          type: 'string',
          description: 'Tech contact email (optional)',
        },
        adminFirstName: {
          type: 'string',
          description: 'Admin contact first name (optional, defaults to registrant)',
        },
        adminLastName: {
          type: 'string',
          description: 'Admin contact last name (optional)',
        },
        adminEmailAddress: {
          type: 'string',
          description: 'Admin contact email (optional)',
        },
        nameservers: {
          type: 'string',
          description: 'Comma-separated list of nameservers (optional)',
        },
        addFreeWhoisguard: {
          type: 'string',
          enum: ['yes', 'no'],
          description: 'Add free WhoisGuard privacy protection',
          default: 'yes',
        },
        wgEnabled: {
          type: 'string',
          enum: ['yes', 'no'],
          description: 'Enable WhoisGuard privacy protection',
          default: 'yes',
        },
      },
      required: [
        'domainName',
        'years',
        'registrantFirstName',
        'registrantLastName',
        'registrantAddress1',
        'registrantCity',
        'registrantStateProvince',
        'registrantPostalCode',
        'registrantCountry',
        'registrantPhone',
        'registrantEmailAddress',
      ],
    },
  },
  {
    name: 'namecheap_domains_gettldlist',
    description: 'Get a list of all supported TLDs with filtering and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search for TLDs containing this text (e.g., "com", "org", "tech")',
        },
        registerable: {
          type: 'boolean',
          description: 'Filter to only show TLDs that can be registered via API',
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          default: 1,
        },
        pageSize: {
          type: 'number',
          description: 'Number of TLDs per page (default: 50, max: 200)',
          default: 50,
          maximum: 200,
        },
        sortBy: {
          type: 'string',
          enum: ['name', 'popularity'],
          description: 'Sort TLDs by name or popularity',
          default: 'name',
        },
      },
    },
  },
  {
    name: 'namecheap_domains_setcontacts',
    description: 'Update contact information for a domain',
    inputSchema: {
      type: 'object',
      properties: {
        domainName: {
          type: 'string',
          description: 'Domain name to update contacts for',
        },
        registrantFirstName: {
          type: 'string',
          description: 'Registrant first name',
        },
        registrantLastName: {
          type: 'string',
          description: 'Registrant last name',
        },
        registrantAddress1: {
          type: 'string',
          description: 'Registrant address',
        },
        registrantCity: {
          type: 'string',
          description: 'Registrant city',
        },
        registrantStateProvince: {
          type: 'string',
          description: 'Registrant state/province',
        },
        registrantPostalCode: {
          type: 'string',
          description: 'Registrant postal code',
        },
        registrantCountry: {
          type: 'string',
          description: 'Registrant country code',
        },
        registrantPhone: {
          type: 'string',
          description: 'Registrant phone',
        },
        registrantEmailAddress: {
          type: 'string',
          description: 'Registrant email',
        },
        techFirstName: {
          type: 'string',
          description: 'Tech contact first name',
        },
        techLastName: {
          type: 'string',
          description: 'Tech contact last name',
        },
        techEmailAddress: {
          type: 'string',
          description: 'Tech contact email',
        },
        adminFirstName: {
          type: 'string',
          description: 'Admin contact first name',
        },
        adminLastName: {
          type: 'string',
          description: 'Admin contact last name',
        },
        adminEmailAddress: {
          type: 'string',
          description: 'Admin contact email',
        },
      },
      required: ['domainName'],
    },
  },
  {
    name: 'namecheap_domains_reactivate',
    description: 'Reactivate an expired domain',
    inputSchema: {
      type: 'object',
      properties: {
        domainName: {
          type: 'string',
          description: 'Domain name to reactivate',
        },
        isPremiumDomain: {
          type: 'boolean',
          description: 'Whether this is a premium domain',
          default: false,
        },
      },
      required: ['domainName'],
    },
  },
  {
    name: 'namecheap_domains_renew',
    description: 'Renew an expiring domain',
    inputSchema: {
      type: 'object',
      properties: {
        domainName: {
          type: 'string',
          description: 'Domain name to renew',
        },
        years: {
          type: 'number',
          description: 'Number of years to renew (1-10)',
          minimum: 1,
          maximum: 10,
        },
        isPremiumDomain: {
          type: 'boolean',
          description: 'Whether this is a premium domain',
          default: false,
        },
      },
      required: ['domainName', 'years'],
    },
  },
  {
    name: 'namecheap_domains_getregistrarlock',
    description: 'Get the registrar lock status of a domain',
    inputSchema: {
      type: 'object',
      properties: {
        domainName: {
          type: 'string',
          description: 'Domain name to check lock status',
        },
      },
      required: ['domainName'],
    },
  },
  {
    name: 'namecheap_domains_setregistrarlock',
    description: 'Set the registrar lock status for a domain',
    inputSchema: {
      type: 'object',
      properties: {
        domainName: {
          type: 'string',
          description: 'Domain name to lock/unlock',
        },
        lockAction: {
          type: 'string',
          enum: ['LOCK', 'UNLOCK'],
          description: 'Lock or unlock the domain',
        },
      },
      required: ['domainName', 'lockAction'],
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