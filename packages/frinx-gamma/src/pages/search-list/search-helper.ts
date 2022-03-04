export type SearchItem = {
  /* eslint-disable @typescript-eslint/naming-convention */
  vpn_id: string;
  site_id: string;
  site_network_access_id: string;
  site_network_access_type: string | null;
  device_id: string | null;
  location_id: string | null;
  cvlan_id: string;
  provider_address_ipv4: string | null;
  customer_address_ipv4: string | null;
  bfd_profile: string;
  svc_input_bandwith: string | null;
  input_bandwidth: string | null;
  maximum_routes_ipv4: string | null;
  access_priority: number | null;
  site_role: string;
  customer_name: string;
  circuit_reference: string;
  description: string | null;
  sp_bearer_reference: string;
  bearer_reference: string;
  ne_id: string;
  port_id: string;
  carrier_name: string | null;
  carrier_reference: string | null;
  evc_type: string;
  svlan_id: number;
  admin_status: string | null;
  /* eslint-enable @typescript-eslint/naming-convention */
};

export type TableItem = {
  vpnId: string;
  siteId: string;
  siteNetworkAccessId: string;
  siteNetworkAccessType: string;
  deviceId: string;
  locationId: string;
  cvlanId: string;
  providerAddressIpv4: string;
  customerAddressIpv4: string;
  bfdProfile: string;
  svcInputBandwith: string;
  inputBandwidth: string;
  maximumRoutes: string;
  accessPriority: string;
  siteRole: string;
  customerName: string;
  circuitReference: string;
  description: string;
  spBearerReference: string;
  bearerReference: string;
  neId: string;
  portId: string;
  carrierName: string;
  carrierReference: string;
  evcType: string;
  svlanId: number;
  adminStatus: string;
};

export function convertSearchItemToTableItem(searchItem: SearchItem): TableItem {
  /* eslint-disable @typescript-eslint/naming-convention */
  return {
    vpnId: searchItem.vpn_id,
    siteId: searchItem.site_id,
    siteNetworkAccessId: searchItem.site_network_access_id,
    siteNetworkAccessType: searchItem.site_network_access_type || '',
    deviceId: searchItem.device_id || '',
    locationId: searchItem.location_id || '',
    cvlanId: searchItem.cvlan_id,
    providerAddressIpv4: searchItem.provider_address_ipv4 || '',
    customerAddressIpv4: searchItem.customer_address_ipv4 || '',
    bfdProfile: searchItem.bfd_profile,
    svcInputBandwith: searchItem.svc_input_bandwith || '',
    inputBandwidth: searchItem.input_bandwidth || '',
    maximumRoutes: searchItem.maximum_routes_ipv4 || '',
    accessPriority: searchItem.access_priority ? String(searchItem.access_priority) : '',
    siteRole: searchItem.site_role,
    customerName: searchItem.customer_name,
    circuitReference: searchItem.circuit_reference,
    description: searchItem.description || '',
    spBearerReference: searchItem.sp_bearer_reference,
    bearerReference: searchItem.bearer_reference,
    neId: searchItem.ne_id,
    portId: searchItem.port_id,
    carrierName: searchItem.carrier_name || '',
    carrierReference: searchItem.carrier_reference || '',
    evcType: searchItem.evc_type,
    svlanId: searchItem.svlan_id,
    adminStatus: searchItem.admin_status || '',
  };
  /* eslint-enable @typescript-eslint/naming-convention */
}
