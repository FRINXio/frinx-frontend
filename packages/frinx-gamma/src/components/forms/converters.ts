import { VpnService, DefaultCVlanEnum, VpnServiceTopology } from './service-types';
import { VpnServicesOutput } from '../../api/unistore/network-types';

export function apiVpnServiceToClientVpnService(apiVpnService: VpnServicesOutput): VpnService[] {
  return apiVpnService['vpn-services']['vpn-service'].map((vpn) => {
    const extranetVpns = vpn['extranet-vpns']['extranet-vpn']
      ? vpn['extranet-vpns']['extranet-vpn'].map((ex) => {
          return ex['vpn-id'];
        })
      : [];

    return {
      vpnId: vpn['vpn-id'],
      customerName: vpn['customer-name'],
      vpnServiceTopology: vpn['vpn-service-topology'] as VpnServiceTopology,
      defaultCVlan: DefaultCVlanEnum.L3VPN,
      maximumRoutes: 1000,
      extranetVpns,
    };
  });
}
