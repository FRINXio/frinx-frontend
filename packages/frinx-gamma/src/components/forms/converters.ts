import { VpnService, DefaultCVlanEnum, VpnServiceTopology } from './service-types';
import { CountryCode, SiteManagementType, SiteVpnFlavor, VpnSite } from './site-types';
import {
  VpnServicesOutput,
  VpnSitesOutput,
  CreateVpnServiceInput,
  CreateVpnSiteInput,
} from '../../api/unistore/network-types';
import unwrap from '../../helpers/unwrap';

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

export function clientVpnServiceToApiVpnService(clientVpnService: VpnService): CreateVpnServiceInput {
  const extranetVpns = clientVpnService.extranetVpns.map((vpn) => {
    return {
      'vpn-id': vpn,
      'local-sites-role': '',
    };
  });
  return {
    'vpn-service': [
      {
        'vpn-id': '',
        'customer-name': clientVpnService.customerName,
        'extranet-vpns': {
          'extranet-vpn': extranetVpns,
        },
        'vpn-service-topology': clientVpnService.vpnServiceTopology,
        'default-c-vlan': clientVpnService.defaultCVlan,
      },
    ],
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function apiVpnSitesToClientVpnSite(apiVpnSite: VpnSitesOutput): VpnSite[] {
  return apiVpnSite.sites.site.map((site) => {
    const managementType: unknown = site.management.type.split(':')[1];
    const siteVpnFlavor: unknown = site['site-vpn-flavor'].split(':')[1];
    return {
      siteId: site['site-id'],
      siteDevices: site.devices.device.map((device) => {
        return {
          deviceId: device['device-id'],
          locationId: device.location,
          managementIP: device.management.address,
        };
      }),
      customerLocations: site.locations.location.map((l) => {
        const countryCode: CountryCode =
          l['country-code'] === 'UK' || l['country-code'] === 'Ireland' ? l['country-code'] : 'UK';
        return {
          locationId: l['location-id'],
          street: l.address,
          city: l.city,
          postalCode: l['postal-code'],
          countryCode,
          state: l.state,
        };
      }),
      siteManagementType: managementType as SiteManagementType,
      siteVpnFlavor: siteVpnFlavor as SiteVpnFlavor,
      siteServiceQosProfile: '',
      enableBgpPicFastReroute: site['traffic-protection'].enabled,
    };
  });
}

export function clientVpnSiteToApiVpnSite(vpnSite: VpnSite): CreateVpnSiteInput {
  const apiDevices = vpnSite.siteDevices.map((device) => {
    return {
      'device-id': device.deviceId || '',
      management: {
        address: device.managementIP,
      },
      location: device.locationId || '',
    };
  });

  const apiLocations = vpnSite.customerLocations.map((location) => {
    return {
      'location-id': location.locationId || '',
      'postal-code': location.postalCode,
      state: location.state,
      address: location.street,
      city: location.city,
      'country-code': location.countryCode,
    };
  });

  return {
    site: [
      {
        'site-id': unwrap(vpnSite.siteId),
        devices: {
          device: apiDevices,
        },
        // 'site-network-accesses': {
        //   'site-network-access': [],
        // },
        // 'maximum-routes': {
        //   'address-family': [
        //     {
        //       af: 'ipv4',
        //       'maximum-routes': 1000,
        //     },
        //   ],
        // },
        'site-vpn-flavor': vpnSite.siteVpnFlavor,
        'traffic-protection': { enabled: vpnSite.enableBgpPicFastReroute },
        management: { type: vpnSite.siteManagementType },
        locations: { location: apiLocations },
        // 'vpn-policies': {
        //   'vpn-policy': [],
        // },
        service: {
          qos: {
            'qos-profile': {
              'qos-profile': [
                {
                  profile: vpnSite.siteServiceQosProfile,
                },
              ],
            },
          },
        },
      },
    ],
  };
}
