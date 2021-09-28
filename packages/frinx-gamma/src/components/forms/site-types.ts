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

export type SiteManagementType = 'point-to-point' | 'provider-managed' | 'co-managed' | 'customer-managed';
export type SiteVpnFlavor = 'site-vpn-flavor-single' | 'site-vpn-flavor-sub' | 'site-vpn-flavor-nni';

export type VpnSite = {
  siteId?: string;
  customerLocations: CustomerLocation[];
  siteDevices: SiteDevice[];
  siteManagementType: SiteManagementType;
  siteVpnFlavor: SiteVpnFlavor;
  siteServiceQosProfile: string;
  enableBgpPicFastReroute: boolean;
};
