export type VpnServiceTopology = 'any-to-any' | 'hub-spoke' | 'hub-spoke-disjointed' | 'custom';

// eslint-disable-next-line no-shadow
export enum DefaultCVlanEnum {
  L3VPN = '400',
  SIP = '50',
  LocalInternet = '300',
  AldiWifi = '1000',
}

export type AddressFamily = 'ipv4' | 'ipv6';
export type MaximumRoutes = 1000 | 2000 | 5000 | 10000 | 1000000;

export type VpnService = {
  vpnId?: string;
  customerName: string;
  vpnServiceTopology: VpnServiceTopology;
  defaultCVlan: DefaultCVlanEnum;
  maximumRoutes: MaximumRoutes;
  extranetVpns: string[];
};
