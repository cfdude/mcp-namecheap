import axios, { AxiosInstance } from 'axios';
import type { DnsHost, DomainsListParams } from './types.js';

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

  async domainsCheck(domains: string[]) {
    const domainList = domains.join(',');
    
    const response = await this.axios.get('', {
      params: {
        Command: 'namecheap.domains.check',
        DomainList: domainList,
      },
    });

    return this.parseXmlToJson(response.data);
  }

  async domainsGetInfo(domainName: string) {
    const response = await this.axios.get('', {
      params: {
        Command: 'namecheap.domains.getInfo',
        DomainName: domainName,
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