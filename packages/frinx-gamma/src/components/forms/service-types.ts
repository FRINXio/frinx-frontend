/* eslint-disable @typescript-eslint/naming-convention */
export type VpnServiceTopology = 'any-to-any' | 'hub-spoke' | 'hub-spoke-disjointed' | 'custom';

// eslint-disable-next-line no-shadow
export enum DefaultCVlanEnum {
  'Main Corporate VPN' = '400',
  'Guest Wifi VPN' = '1000',
  'Dedicated SIP VPN' = '50',
  'Custom C-VLAN' = 'custom',
}

export type AddressFamily = 'ipv4' | 'ipv6';

export type VpnService = {
  vpnId?: string;
  customerName: string;
  vpnServiceTopology: VpnServiceTopology;
  defaultCVlan: DefaultCVlanEnum;
  customCVlan?: number;
  extranetVpns: string[];
};
