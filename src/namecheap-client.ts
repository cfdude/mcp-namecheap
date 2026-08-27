import axios, { AxiosInstance } from 'axios';
import type { 
  DnsHost, 
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
  DomainsSetRegistrarLockParams
} from './types.js';

export class NamecheapClient {
  private axios: AxiosInstance;
  private apiUser: string;
  private apiKey: string;
  private clientIp: string;

  constructor(apiKey: string, apiUser: string, clientIp: string, useSandbox = false) {
    this.apiKey = apiKey;
    this.apiUser = apiUser;
    this.clientIp = clientIp;
    
    const baseURL = useSandbox 
      ? 'https://api.sandbox.namecheap.com/xml.response'
      : 'https://api.namecheap.com/xml.response';

    this.axios = axios.create({
      baseURL,
      params: {
        ApiUser: this.apiUser,
        ApiKey: this.apiKey,
        UserName: this.apiUser,
        ClientIp: this.clientIp,
      },
    });
  }

  private parseXmlToJson(xml: string): unknown {
    // Simple XML to JSON conversion for Namecheap responses
    // In production, you might want to use a proper XML parser
    const jsonStr = xml
      .replace(/(<\/)([^>]+)(>)/g, '"}$3')
      .replace(/(<)([^>]+)(>)([^<]+)?/g, '{"$2":"$4"')
      .replace(/"\s+"/g, '","')
      .replace(/(<)([^>]+)(>)/g, '{"$2":{')
      .replace(/}/g, '},')
      .replace(/,}/g, '}')
      .replace(/,$/g, '');
    
    try {
      return JSON.parse(jsonStr);
    } catch {
      // Fallback to returning the XML if parsing fails
      return { raw: xml };
    }
  }

  async domainsList(options: DomainsListParams = {}) {
    const response = await this.axios.get('', {
      params: {
        Command: 'namecheap.domains.getList',
        ListType: options.listType || 'ALL',
        SearchTerm: options.searchTerm || '',
        Page: options.page || 1,
        PageSize: options.pageSize || 20,
      },
    });

    return this.parseXmlToJson(response.data);
  }

  async domainsCheck(params: DomainsCheckParams) {
    const domainList = params.domainList.join(',');
    
    const response = await this.axios.get('', {
      params: {
        Command: 'namecheap.domains.check',
        DomainList: domainList,
      },
    });

    return this.parseXmlToJson(response.data);
  }

  async domainsGetInfo(params: DomainsGetInfoParams) {
    const response = await this.axios.get('', {
      params: {
        Command: 'namecheap.domains.getInfo',
        DomainName: params.domainName,
        HostName: params.hostName,
      },
    });

    return this.parseXmlToJson(response.data);
  }

  async domainsGetContacts(params: DomainsGetContactsParams) {
    const response = await this.axios.get('', {
      params: {
        Command: 'namecheap.domains.getContacts',
        DomainName: params.domainName,
      },
    });

    return this.parseXmlToJson(response.data);
  }

  async domainsCreate(params: DomainsCreateParams) {
    const apiParams: Record<string, string | number | boolean | undefined> = {
      Command: 'namecheap.domains.create',
      DomainName: params.domainName,
      Years: params.years,
    };

    // Add all registrant information
    Object.keys(params).forEach(key => {
      if (key !== 'domainName' && key !== 'years' && params[key as keyof DomainsCreateParams] !== undefined) {
        // Convert camelCase to PascalCase for API
        const apiKey = key.charAt(0).toUpperCase() + key.slice(1);
        apiParams[apiKey] = params[key as keyof DomainsCreateParams];
      }
    });

    const response = await this.axios.get('', { params: apiParams });
    return this.parseXmlToJson(response.data);
  }

  async domainsGetTldList(_params?: DomainsGetTldListParams) {
    const response = await this.axios.get('', {
      params: {
        Command: 'namecheap.domains.getTldList',
      },
    });

    return this.parseXmlToJson(response.data);
  }

  async domainsSetContacts(params: DomainsSetContactsParams) {
    const apiParams: Record<string, string | undefined> = {
      Command: 'namecheap.domains.setContacts',
      DomainName: params.domainName,
    };

    // Add all contact information
    Object.keys(params).forEach(key => {
      if (key !== 'domainName' && params[key as keyof DomainsSetContactsParams] !== undefined) {
        // Convert camelCase to PascalCase for API
        const apiKey = key.charAt(0).toUpperCase() + key.slice(1);
        apiParams[apiKey] = params[key as keyof DomainsSetContactsParams];
      }
    });

    const response = await this.axios.get('', { params: apiParams });
    return this.parseXmlToJson(response.data);
  }

  async domainsReactivate(params: DomainsReactivateParams) {
    const response = await this.axios.get('', {
      params: {
        Command: 'namecheap.domains.reactivate',
        DomainName: params.domainName,
        IsPremiumDomain: params.isPremiumDomain,
      },
    });

    return this.parseXmlToJson(response.data);
  }

  async domainsRenew(params: DomainsRenewParams) {
    const response = await this.axios.get('', {
      params: {
        Command: 'namecheap.domains.renew',
        DomainName: params.domainName,
        Years: params.years,
        IsPremiumDomain: params.isPremiumDomain,
      },
    });

    return this.parseXmlToJson(response.data);
  }

  async domainsGetRegistrarLock(params: DomainsGetRegistrarLockParams) {
    const response = await this.axios.get('', {
      params: {
        Command: 'namecheap.domains.getRegistrarLock',
        DomainName: params.domainName,
      },
    });

    return this.parseXmlToJson(response.data);
  }

  async domainsSetRegistrarLock(params: DomainsSetRegistrarLockParams) {
    const response = await this.axios.get('', {
      params: {
        Command: 'namecheap.domains.setRegistrarLock',
        DomainName: params.domainName,
        LockAction: params.lockAction,
      },
    });

    return this.parseXmlToJson(response.data);
  }

  async dnsGetList(sld: string, tld: string) {
    const response = await this.axios.get('', {
      params: {
        Command: 'namecheap.domains.dns.getList',
        SLD: sld,
        TLD: tld,
      },
    });

    return this.parseXmlToJson(response.data);
  }

  /**
   * Read the domain's DNS host records.
   *
   * REQUIRED BEFORE dnsSetHosts. Namecheap's setHosts REPLACES the entire record
   * set -- it is not an upsert -- so writing without first reading deletes every
   * record you did not resend. Note this is a different API command from
   * dnsGetList, which returns NAMESERVERS, not records.
   */
  async dnsGetHosts(sld: string, tld: string) {
    const response = await this.axios.get('', {
      params: {
        Command: 'namecheap.domains.dns.getHosts',
        SLD: sld,
        TLD: tld,
      },
    });

    const parsed = this.parseXmlToJson(response.data);

    // Also surface the records in exactly the shape dnsSetHosts accepts, so a
    // read-modify-write needs no hand translation between the two (the field
    // names differ: Namecheap returns Name/Type/Address/MXPref/TTL).
    const hosts: DnsHost[] = [];
    const raw = typeof parsed === 'object' && parsed !== null ? (parsed as { raw?: string }).raw : undefined;
    const xml = raw ?? (typeof response.data === 'string' ? response.data : '');
    for (const m of xml.matchAll(/<host\b[^>]*\/>/gi)) {
      const tag = m[0];
      const attr = (name: string) => {
        const a = tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'));
        return a ? a[1] : undefined;
      };
      const hostname = attr('Name');
      const recordType = attr('Type');
      const address = attr('Address');
      if (!hostname || !recordType || address === undefined) continue;
      const host: DnsHost = { hostname, recordType: recordType as DnsHost['recordType'], address };
      const mx = attr('MXPref');
      if (mx !== undefined && mx !== '' && recordType.toUpperCase() === 'MX') host.mxPriority = Number(mx);
      const ttl = attr('TTL');
      if (ttl !== undefined && ttl !== '') host.ttl = Number(ttl);
      hosts.push(host);
    }

    return { ...(parsed as Record<string, unknown>), hosts };
  }

  async dnsSetCustom(sld: string, tld: string, nameservers: string[]) {
    // Namecheap expects ONE comma-separated `Nameservers` parameter. This previously sent
    // indexed NameServers1/NameServers2 (the shape setHosts uses for records), which the API
    // silently ignores -- every call failed with "Parameter Nameservers is Missing".
    const params: Record<string, string> = {
      Command: 'namecheap.domains.dns.setCustom',
      SLD: sld,
      TLD: tld,
      Nameservers: nameservers.join(','),
    };

    const response = await this.axios.get('', { params });

    return this.parseXmlToJson(response.data);
  }

  /**
   * Revert the domain to Namecheap's own (BasicDNS) nameservers.
   *
   * This is the correct call for "put DNS back at the registrar" -- setCustom with
   * dns1/dns2.registrar-servers.com hand-typed is not the same thing and leaves the domain
   * flagged as CUSTOM.
   */
  async dnsSetDefault(sld: string, tld: string) {
    const response = await this.axios.get('', {
      params: {
        Command: 'namecheap.domains.dns.setDefault',
        SLD: sld,
        TLD: tld,
      },
    });

    return this.parseXmlToJson(response.data);
  }

  /**
   * DESTRUCTIVE: replaces the domain's ENTIRE record set with `hosts`.
   * Any record not present in this array is DELETED. Always dnsGetHosts first
   * and pass back the full set with your modification applied.
   */
  async dnsSetHosts(sld: string, tld: string, hosts: DnsHost[]) {
    const params: Record<string, string | number> = {
      Command: 'namecheap.domains.dns.setHosts',
      SLD: sld,
      TLD: tld,
    };

    // Add host records
    hosts.forEach((host, index) => {
      const idx = index + 1;
      params[`HostName${idx}`] = host.hostname;
      params[`RecordType${idx}`] = host.recordType;
      params[`Address${idx}`] = host.address;
      
      if (host.mxPriority !== undefined) {
        params[`MXPref${idx}`] = host.mxPriority;
      }
      
      if (host.ttl !== undefined) {
        params[`TTL${idx}`] = host.ttl;
      }
    });

    const response = await this.axios.get('', { params });

    return this.parseXmlToJson(response.data);
  }
}