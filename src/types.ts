export interface DomainsListParams {
  listType?: 'ALL' | 'EXPIRING' | 'EXPIRED';
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'NAME' | 'NAME_DESC' | 'EXPIREDATE' | 'EXPIREDATE_DESC' | 'CREATEDATE' | 'CREATEDATE_DESC';
}

export interface DomainsCheckParams {
  domainList: string[];
}

export interface DomainsGetInfoParams {
  domainName: string;
  hostName?: string;
}

export interface DomainsGetContactsParams {
  domainName: string;
}

export interface DomainsCreateParams {
  domainName: string;
  years: number;
  registrantFirstName: string;
  registrantLastName: string;
  registrantAddress1: string;
  registrantCity: string;
  registrantStateProvince: string;
  registrantPostalCode: string;
  registrantCountry: string;
  registrantPhone: string;
  registrantEmailAddress: string;
  registrantOrganizationName?: string;
  registrantJobTitle?: string;
  registrantAddress2?: string;
  registrantPhoneExt?: string;
  registrantFax?: string;
  techFirstName?: string;
  techLastName?: string;
  techAddress1?: string;
  techCity?: string;
  techStateProvince?: string;
  techPostalCode?: string;
  techCountry?: string;
  techPhone?: string;
  techEmailAddress?: string;
  techOrganizationName?: string;
  techJobTitle?: string;
  adminFirstName?: string;
  adminLastName?: string;
  adminAddress1?: string;
  adminCity?: string;
  adminStateProvince?: string;
  adminPostalCode?: string;
  adminCountry?: string;
  adminPhone?: string;
  adminEmailAddress?: string;
  adminOrganizationName?: string;
  adminJobTitle?: string;
  auxBillingFirstName?: string;
  auxBillingLastName?: string;
  auxBillingAddress1?: string;
  auxBillingCity?: string;
  auxBillingStateProvince?: string;
  auxBillingPostalCode?: string;
  auxBillingCountry?: string;
  auxBillingPhone?: string;
  auxBillingEmailAddress?: string;
  auxBillingOrganizationName?: string;
  auxBillingJobTitle?: string;
  billingFirstName?: string;
  billingLastName?: string;
  billingAddress1?: string;
  billingCity?: string;
  billingStateProvince?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  billingPhone?: string;
  billingEmailAddress?: string;
  billingOrganizationName?: string;
  billingJobTitle?: string;
  idnCode?: string;
  extendedAttributes?: string;
  nameservers?: string;
  addFreeWhoisguard?: 'yes' | 'no';
  wgEnabled?: 'yes' | 'no';
  isPremiumDomain?: boolean;
  premiumPrice?: number;
  eapFee?: number;
}

export type DomainsGetTldListParams = Record<string, never>;

export interface DomainsSetContactsParams {
  domainName: string;
  registrantFirstName?: string;
  registrantLastName?: string;
  registrantAddress1?: string;
  registrantCity?: string;
  registrantStateProvince?: string;
  registrantPostalCode?: string;
  registrantCountry?: string;
  registrantPhone?: string;
  registrantEmailAddress?: string;
  registrantOrganizationName?: string;
  registrantJobTitle?: string;
  techFirstName?: string;
  techLastName?: string;
  techAddress1?: string;
  techCity?: string;
  techStateProvince?: string;
  techPostalCode?: string;
  techCountry?: string;
  techPhone?: string;
  techEmailAddress?: string;
  techOrganizationName?: string;
  techJobTitle?: string;
  adminFirstName?: string;
  adminLastName?: string;
  adminAddress1?: string;
  adminCity?: string;
  adminStateProvince?: string;
  adminPostalCode?: string;
  adminCountry?: string;
  adminPhone?: string;
  adminEmailAddress?: string;
  adminOrganizationName?: string;
  adminJobTitle?: string;
  auxBillingFirstName?: string;
  auxBillingLastName?: string;
  auxBillingAddress1?: string;
  auxBillingCity?: string;
  auxBillingStateProvince?: string;
  auxBillingPostalCode?: string;
  auxBillingCountry?: string;
  auxBillingPhone?: string;
  auxBillingEmailAddress?: string;
  auxBillingOrganizationName?: string;
  auxBillingJobTitle?: string;
}

export interface DomainsReactivateParams {
  domainName: string;
  isPremiumDomain?: boolean;
}

export interface DomainsRenewParams {
  domainName: string;
  years: number;
  isPremiumDomain?: boolean;
}

export interface DomainsGetRegistrarLockParams {
  domainName: string;
}

export interface DomainsSetRegistrarLockParams {
  domainName: string;
  lockAction: 'LOCK' | 'UNLOCK';
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