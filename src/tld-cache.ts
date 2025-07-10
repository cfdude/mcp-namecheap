import { NamecheapClient } from './namecheap-client.js';

interface TldInfo {
  name: string;
  isApiRegisterable: boolean;
  isRenewalAllowed: boolean;
  minRegisterYears: number;
  maxRegisterYears: number;
  minRenewYears: number;
  maxRenewYears: number;
  isTransferrable: boolean;
  transferLockDays: number;
  isPrivacyProtectionAllowed: boolean;
  isIdnSupported: boolean;
  supportedIdnLanguages?: string[];
  categories?: string[];
  isPremium?: boolean;
}

export class TldCache {
  private cache: TldInfo[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly client: NamecheapClient;

  constructor(client: NamecheapClient) {
    this.client = client;
  }

  private async fetchAndParseTldList(): Promise<TldInfo[]> {
    const response = await this.client.domainsGetTldList();
    const tlds: TldInfo[] = [];
    
    // Parse the XML response to extract TLD information
    if (response && typeof response === 'object' && 'raw' in response && typeof response.raw === 'string') {
      // Simple regex parsing for demonstration
      // In production, use a proper XML parser
      const tldMatches = response.raw.matchAll(/<Tld Name="([^"]+)"[^>]*>/g);
      
      for (const match of tldMatches) {
        const tldElement = match[0];
        const name = match[1];
        
        tlds.push({
          name,
          isApiRegisterable: tldElement.includes('IsApiRegisterable="true"'),
          isRenewalAllowed: tldElement.includes('IsApiRenewalAllowed="true"'),
          minRegisterYears: parseInt(tldElement.match(/MinRegisterYears="(\d+)"/)?.[1] || '1'),
          maxRegisterYears: parseInt(tldElement.match(/MaxRegisterYears="(\d+)"/)?.[1] || '10'),
          minRenewYears: parseInt(tldElement.match(/MinRenewYears="(\d+)"/)?.[1] || '1'),
          maxRenewYears: parseInt(tldElement.match(/MaxRenewYears="(\d+)"/)?.[1] || '10'),
          isTransferrable: !tldElement.includes('IsApiTransferrable="false"'),
          transferLockDays: parseInt(tldElement.match(/TransferLockDays="(\d+)"/)?.[1] || '60'),
          isPrivacyProtectionAllowed: !tldElement.includes('IsPrivacyProtectionAllowed="false"'),
          isIdnSupported: tldElement.includes('IsIdnSupported="true"'),
          isPremium: tldElement.includes('IsPremiumTLD="true"'),
        });
      }
    }
    
    return tlds;
  }

  private async ensureCache(): Promise<TldInfo[]> {
    const now = Date.now();
    
    if (!this.cache || (now - this.cacheTimestamp) > this.CACHE_DURATION) {
      this.cache = await this.fetchAndParseTldList();
      this.cacheTimestamp = now;
    }
    
    return this.cache;
  }

  async getTlds(options?: {
    search?: string;
    category?: string;
    registerable?: boolean;
    page?: number;
    pageSize?: number;
    sortBy?: 'name' | 'popularity';
  }): Promise<{
    tlds: TldInfo[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const allTlds = await this.ensureCache();
    
    // Apply filters
    let filteredTlds = [...allTlds];
    
    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      filteredTlds = filteredTlds.filter(tld => 
        tld.name.toLowerCase().includes(searchLower)
      );
    }
    
    if (options?.registerable !== undefined) {
      filteredTlds = filteredTlds.filter(tld => 
        tld.isApiRegisterable === options.registerable
      );
    }
    
    if (options?.category) {
      filteredTlds = filteredTlds.filter(tld => 
        tld.categories?.includes(options.category!)
      );
    }
    
    // Sort
    if (options?.sortBy === 'name') {
      filteredTlds.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Paginate
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 50;
    const totalCount = filteredTlds.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedTlds = filteredTlds.slice(startIndex, endIndex);
    
    return {
      tlds: paginatedTlds,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  }

  async refreshCache(): Promise<void> {
    this.cache = null;
    this.cacheTimestamp = 0;
    await this.ensureCache();
  }
}