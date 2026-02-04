import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { NamecheapClient } from './namecheap-client.js';
import { TldCache } from './tld-cache.js';
import type { DnsHost } from './types.js';

// Configuration schema for Smithery
export const configSchema = z.object({
  NAMECHEAP_API_KEY: z.string().describe("Namecheap API key"),
  NAMECHEAP_API_USER: z.string().describe("Namecheap API username"),
  NAMECHEAP_CLIENT_IP: z.string().describe("Whitelisted IP address for API access"),
  NAMECHEAP_USE_SANDBOX: z.boolean().optional().default(false).describe("Use sandbox API endpoint")
});

// Type helper to work around MCP SDK type inference depth limits
type ToolArgs = Record<string, unknown>;

export default function ({ config }: { config: z.infer<typeof configSchema> }) {
  const server = new McpServer({
    name: "mcp-namecheap",
    version: "1.0.0",
  });

  const namecheapClient = new NamecheapClient(
    config.NAMECHEAP_API_KEY,
    config.NAMECHEAP_API_USER,
    config.NAMECHEAP_CLIENT_IP,
    config.NAMECHEAP_USE_SANDBOX
  );

  const tldCache = new TldCache(namecheapClient);

  // Domain listing tool
  server.tool(
    "namecheap_domains_list",
    "Get a list of domains in your Namecheap account",
    {
      listType: z.enum(["ALL", "EXPIRING", "EXPIRED"]).optional().default("ALL").describe("Type of list to return"),
      page: z.number().optional().default(1).describe("Page number for pagination"),
      pageSize: z.number().optional().default(20).describe("Number of domains per page"),
      searchTerm: z.string().optional().describe("Filter domains by search term"),
      sortBy: z.enum(["NAME", "NAME_DESC", "EXPIREDATE", "EXPIREDATE_DESC", "CREATEDATE", "CREATEDATE_DESC"]).optional().describe("Sort order for results")
    },
    async (args: ToolArgs) => {
      const result = await namecheapClient.domainsList(args as unknown as Parameters<typeof namecheapClient.domainsList>[0]);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  // Domain availability check
  server.tool(
    "namecheap_domains_check",
    "Check if domains are available for registration (supports bulk checks)",
    {
      domainList: z.array(z.string()).describe("List of domain names to check availability")
    },
    async (args: ToolArgs) => {
      const result = await namecheapClient.domainsCheck(args as unknown as Parameters<typeof namecheapClient.domainsCheck>[0]);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  // Get domain information
  server.tool(
    "namecheap_domains_getinfo",
    "Get detailed information about a specific domain",
    {
      domainName: z.string().describe("Domain name to get information for"),
      hostName: z.string().optional().describe("Hosted domain name")
    },
    async (args: ToolArgs) => {
      const result = await namecheapClient.domainsGetInfo(args as unknown as Parameters<typeof namecheapClient.domainsGetInfo>[0]);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  // Get domain contacts
  server.tool(
    "namecheap_domains_getcontacts",
    "Get contact information for a domain",
    {
      domainName: z.string().describe("Domain name to get contacts for")
    },
    async (args: ToolArgs) => {
      const result = await namecheapClient.domainsGetContacts(args as unknown as Parameters<typeof namecheapClient.domainsGetContacts>[0]);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  // Register domain
  server.tool(
    "namecheap_domains_create",
    "Register a new domain name",
    {
      domainName: z.string().describe("Domain name to register"),
      years: z.number().min(1).max(10).describe("Number of years to register"),
      registrantFirstName: z.string().describe("Registrant first name"),
      registrantLastName: z.string().describe("Registrant last name"),
      registrantAddress1: z.string().describe("Registrant address line 1"),
      registrantCity: z.string().describe("Registrant city"),
      registrantStateProvince: z.string().describe("Registrant state/province"),
      registrantPostalCode: z.string().describe("Registrant postal code"),
      registrantCountry: z.string().describe("Registrant country code"),
      registrantPhone: z.string().describe("Registrant phone number"),
      registrantEmailAddress: z.string().describe("Registrant email address"),
      registrantOrganizationName: z.string().optional().describe("Registrant organization name"),
      techFirstName: z.string().optional().describe("Tech contact first name"),
      techLastName: z.string().optional().describe("Tech contact last name"),
      techEmailAddress: z.string().optional().describe("Tech contact email"),
      adminFirstName: z.string().optional().describe("Admin contact first name"),
      adminLastName: z.string().optional().describe("Admin contact last name"),
      adminEmailAddress: z.string().optional().describe("Admin contact email"),
      nameservers: z.string().optional().describe("Comma-separated list of nameservers"),
      addFreeWhoisguard: z.enum(["yes", "no"]).optional().default("yes").describe("Add free WhoisGuard privacy protection"),
      wgEnabled: z.enum(["yes", "no"]).optional().default("yes").describe("Enable WhoisGuard privacy protection")
    },
    async (args: ToolArgs) => {
      const result = await namecheapClient.domainsCreate(args as unknown as Parameters<typeof namecheapClient.domainsCreate>[0]);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  // Get TLD list
  server.tool(
    "namecheap_domains_gettldlist",
    "Get a list of all supported TLDs with filtering and pagination",
    {
      page: z.number().optional().default(1).describe("Page number for pagination"),
      pageSize: z.number().max(200).optional().default(50).describe("Number of TLDs per page"),
      search: z.string().optional().describe("Search for TLDs containing this text"),
      registerable: z.boolean().optional().describe("Filter to only show TLDs that can be registered via API"),
      sortBy: z.enum(["name", "popularity"]).optional().default("name").describe("Sort TLDs by name or popularity")
    },
    async (args: ToolArgs) => {
      const result = await tldCache.getTlds({
        search: args.search as string | undefined,
        registerable: args.registerable as boolean | undefined,
        page: args.page as number | undefined,
        pageSize: args.pageSize as number | undefined,
        sortBy: args.sortBy as "name" | "popularity" | undefined,
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  // Update domain contacts
  server.tool(
    "namecheap_domains_setcontacts",
    "Update contact information for a domain",
    {
      domainName: z.string().describe("Domain name to update contacts for"),
      registrantFirstName: z.string().describe("Registrant first name"),
      registrantLastName: z.string().describe("Registrant last name"),
      registrantAddress1: z.string().describe("Registrant address"),
      registrantCity: z.string().describe("Registrant city"),
      registrantStateProvince: z.string().describe("Registrant state/province"),
      registrantPostalCode: z.string().describe("Registrant postal code"),
      registrantCountry: z.string().describe("Registrant country code"),
      registrantPhone: z.string().describe("Registrant phone"),
      registrantEmailAddress: z.string().describe("Registrant email"),
      techFirstName: z.string().optional().describe("Tech contact first name"),
      techLastName: z.string().optional().describe("Tech contact last name"),
      techEmailAddress: z.string().optional().describe("Tech contact email"),
      adminFirstName: z.string().optional().describe("Admin contact first name"),
      adminLastName: z.string().optional().describe("Admin contact last name"),
      adminEmailAddress: z.string().optional().describe("Admin contact email")
    },
    async (args: ToolArgs) => {
      const result = await namecheapClient.domainsSetContacts(args as unknown as Parameters<typeof namecheapClient.domainsSetContacts>[0]);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  // Reactivate expired domain
  server.tool(
    "namecheap_domains_reactivate",
    "Reactivate an expired domain",
    {
      domainName: z.string().describe("Domain name to reactivate"),
      isPremiumDomain: z.boolean().optional().default(false).describe("Whether this is a premium domain")
    },
    async (args: ToolArgs) => {
      const result = await namecheapClient.domainsReactivate(args as unknown as Parameters<typeof namecheapClient.domainsReactivate>[0]);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  // Renew domain
  server.tool(
    "namecheap_domains_renew",
    "Renew an expiring domain",
    {
      domainName: z.string().describe("Domain name to renew"),
      years: z.number().min(1).max(10).describe("Number of years to renew"),
      isPremiumDomain: z.boolean().optional().default(false).describe("Whether this is a premium domain")
    },
    async (args: ToolArgs) => {
      const result = await namecheapClient.domainsRenew(args as unknown as Parameters<typeof namecheapClient.domainsRenew>[0]);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  // Get registrar lock status
  server.tool(
    "namecheap_domains_getregistrarlock",
    "Get the registrar lock status of a domain",
    {
      domainName: z.string().describe("Domain name to check lock status")
    },
    async (args: ToolArgs) => {
      const result = await namecheapClient.domainsGetRegistrarLock(args as unknown as Parameters<typeof namecheapClient.domainsGetRegistrarLock>[0]);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  // Set registrar lock status
  server.tool(
    "namecheap_domains_setregistrarlock",
    "Set the registrar lock status for a domain",
    {
      domainName: z.string().describe("Domain name to lock/unlock"),
      lockAction: z.enum(["LOCK", "UNLOCK"]).describe("Lock or unlock the domain")
    },
    async (args: ToolArgs) => {
      const result = await namecheapClient.domainsSetRegistrarLock(args as unknown as Parameters<typeof namecheapClient.domainsSetRegistrarLock>[0]);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  // DNS get list
  server.tool(
    "namecheap_dns_getlist",
    "Get DNS host records for a domain",
    {
      sld: z.string().describe("Second level domain (e.g., 'example' from 'example.com')"),
      tld: z.string().describe("Top level domain (e.g., 'com' from 'example.com')")
    },
    async (args: ToolArgs) => {
      const result = await namecheapClient.dnsGetList(args.sld as string, args.tld as string);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  // DNS set custom nameservers
  server.tool(
    "namecheap_dns_setcustom",
    "Set custom nameservers for a domain",
    {
      sld: z.string().describe("Second level domain"),
      tld: z.string().describe("Top level domain"),
      nameservers: z.array(z.string()).describe("List of nameserver addresses")
    },
    async (args: ToolArgs) => {
      const result = await namecheapClient.dnsSetCustom(args.sld as string, args.tld as string, args.nameservers as string[]);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  // DNS set host records
  server.tool(
    "namecheap_dns_sethosts",
    "Set DNS host records for a domain",
    {
      sld: z.string().describe("Second level domain"),
      tld: z.string().describe("Top level domain"),
      hosts: z.array(z.object({
        hostname: z.string().describe("Subdomain or @ for root"),
        recordType: z.enum(["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV", "CAA"]).describe("DNS record type"),
        address: z.string().describe("Value for the DNS record"),
        ttl: z.number().optional().default(1800).describe("Time to live in seconds"),
        mxPriority: z.number().optional().describe("Priority for MX records")
      })).describe("Array of DNS host records")
    },
    async (args: ToolArgs) => {
      const hosts = (args.hosts as Array<{
        hostname: string;
        recordType: string;
        address: string;
        ttl?: number;
        mxPriority?: number;
      }>).map(h => ({
        hostname: h.hostname,
        recordType: h.recordType as DnsHost['recordType'],
        address: h.address,
        ttl: h.ttl,
        mxPriority: h.mxPriority
      }));
      const result = await namecheapClient.dnsSetHosts(args.sld as string, args.tld as string, hosts);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }]
      };
    }
  );

  return server.server;
}
