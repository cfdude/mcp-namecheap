export interface DomainsListParams {
  listType?: 'ALL' | 'EXPIRING' | 'EXPIRED';
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export interface DomainsCheckParams {
  domains: string[];
}

export interface DomainsGetInfoParams {
  domain: string;
}

export interface DnsGetListParams {
  domain?: string;
  sld: string;
  tld: string;
}

export interface DnsSetCustomParams {
  sld: string;
  tld: string;
  nameservers: string[];
}

export interface DnsHost {
  hostname: string;
  recordType: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV' | 'CAA';
  address: string;
  mxPriority?: number;
  ttl?: number;
}

export interface DnsSetHostsParams {
  sld: string;
  tld: string;
  hosts: DnsHost[];
}

export interface NamecheapResponse {
  ApiResponse: {
    Status: string;
    Errors: {
      Error?: Array<{
        Number: string;
        Text: string;
      }>;
    };
    Warnings: unknown;
    RequestedCommand: string;
    CommandResponse: unknown;
  };
}