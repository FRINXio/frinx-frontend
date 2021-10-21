export type ProviderIdentifiers = {
  bfdIdentifiers: string[];
  qosIdentifiers: string[];
  bgpIdentifiers: string[];
};
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

export type SiteNetworkAccessType = 'point-to-point' | 'multipoint';
// eslint-disable-next-line no-shadow
export enum AccessPriority {
  'Primary Ethernet' = '150',
  'Backup Ethernet' = '100',
  PDSL = '90',
  'Backup PDSL' = '80',
  '4G' = '70',
  'Backup 4G' = '60',
}

// eslint-disable-next-line no-shadow
export enum RequestedCVlan {
  l3vpn = '400',
  Pseudowire = '100',
  'Local Internet Breakout' = '200',
  DMZ = '300',
}

export type MaximumRoutes = 1000 | 2000 | 5000 | 10000;

export type RoutingProtocolType = 'bgp' | 'static';
export type VrrpRoutingType = 'ipv4';
export type LanTag = 'lan' | 'lan-tag' | 'next-hop';
export type StaticRoutingType = {
  lan: string;
  nextHop: string;
  lanTag?: LanTag;
};
export type BgpRoutingType = {
  addressFamily: 'ipv4';
  autonomousSystem: string;
  bgpProfile: string | null;
};
export type RoutingProtocol = {
  type: RoutingProtocolType;
  vrrp?: VrrpRoutingType;
  static?: StaticRoutingType[];
  bgp?: BgpRoutingType;
};

export type Bearer = {
  alwaysOn: boolean;
  bearerReference: string;
  requestedCLan: RequestedCVlan;
  requestedType: {
    requestedType: string;
    strict: boolean;
  };
};

export type Service = {
  svcInputBandwidth: number;
  svcOutputBandwidth: number;
  qosProfiles: [string];
};

export type IPConnection = {
  oam?: {
    bfd?: {
      enabled?: boolean;
      profileName?: string;
    };
  };
  ipv4?: {
    addressAllocationType?: string;
    addresses?: {
      customerAddress?: string;
      prefixLength?: number;
      providerAddress?: string;
    };
  };
};

export type SiteNetworkAccess = {
  siteNetworkAccessId: string;
  siteNetworkAccessType: SiteNetworkAccessType;
  ipConnection?: IPConnection;
  accessPriority: AccessPriority;
  maximumRoutes: MaximumRoutes;
  routingProtocols: RoutingProtocol[];
  locationReference: string | null;
  deviceReference: string | null;
  bearer: Bearer;
  service: Service;
  vpnAttachment: string | null;
};

export type VpnSite = {
  siteId?: string;
  customerLocations: CustomerLocation[];
  siteDevices: SiteDevice[];
  siteManagementType: SiteManagementType;
  siteVpnFlavor: SiteVpnFlavor;
  siteServiceQosProfile: string | null;
  enableBgpPicFastReroute: boolean;
  siteNetworkAccesses: SiteNetworkAccess[];
  maximumRoutes: MaximumRoutes;
};
