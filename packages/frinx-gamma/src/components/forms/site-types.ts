export type CountryCode = 'UK' | 'Ireland';
export type CustomerLocation = {
  locationId?: string;
  street: string;
  postalCode: string;
  state: string;
  city: string;
  countryCode: CountryCode;
};

export type SiteDevice = {
  deviceId?: string;
  locationId: string | null;
  managementIP: string;
};

export type VpnSite = {
  siteId?: string;
  customerLocations: CustomerLocation[];
  siteDevices: SiteDevice[];
  siteManagementType: 'provider-managed' | 'co-managed' | 'customer-managed';
  siteVpnFlavor: 'single' | 'sub' | 'nni';
  siteServiceQosProfile: string;
  enableBgpPicFastReroute: 'yes' | 'no';
};
