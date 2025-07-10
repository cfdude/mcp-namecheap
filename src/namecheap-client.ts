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

  async dnsSetCustom(sld: string, tld: string, nameservers: string[]) {
    const params: Record<string, string> = {
      Command: 'namecheap.domains.dns.setCustom',
      SLD: sld,
      TLD: tld,
    };

    // Add nameservers
    nameservers.forEach((ns, index) => {
      params[`NameServers${index + 1}`] = ns;
    });

    const response = await this.axios.get('', { params });

    return this.parseXmlToJson(response.data);
  }

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