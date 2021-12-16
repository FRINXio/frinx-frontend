export type ServiceFilter = {
  id: string | null;
  customerName: string | null;
};

export type SiteFilter = {
  id: string | null;
  locationId: string | null;
  deviceId: string | null;
};

export type SiteNetworkAccessFilter = {
  id: string | null;
  locationId: string | null;
  deviceId: string | null;
};

export type VpnBearerFilter = {
  id: string | null;
  description: string | null;
  neId: string | null;
  portId: string | null;
  carrierName: string | null;
  carrierReference: string | null;
  serviceType: string | null;
  serviceStatus: string | null;

  circuitReference: string | null;
  carrierEvcReference: string | null;
  inputBandwidth: string | null;
  adminStatus: string | null;
  operStatus: string | null;
};

export type LocationFilter = {
  locationId: string | null;
  street: string | null;
  postalCode: string | null;
  state: string | null;
  city: string | null;
  countryCode: string | null;
};

export type DeviceFilter = {
  deviceId: string | null;
  managementIp: string | null;
};

export type EvcFilter = {
  circuitReference: string | null;
  carrierReference: string | null;
  inputBandwidth: string | null;
  customerName: string | null;
  adminStatus: string | null;
  operStatus: string | null;
};

// we filter non null filters and joined them with && operator
export function joinNonNullFilters(filters: (string | null)[]): string {
  const separator = encodeURIComponent('&&'); // AND operator must be url encoded
  return filters.filter((f) => f !== null).join(separator);
}

export function getServiceFilterParams(serviceFilter: ServiceFilter): string {
  const filters = [];
  filters.push(serviceFilter.id ? `@."vpn-id"like_regex"${serviceFilter.id}"` : null);
  filters.push(serviceFilter.customerName ? `@."customer-name"like_regex"${serviceFilter.customerName}"` : null);
  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : '';
}

export function getSiteFilterParams(siteFilter: SiteFilter): string {
  const filters = [];
  filters.push(siteFilter.id ? `@."site-id"like_regex"${siteFilter.id}"` : null);
  filters.push(
    siteFilter.locationId
      ? `exists({@/locations/location}[*]  ? (@."location-id"like_regex"${siteFilter.locationId}"))`
      : null,
  );
  filters.push(
    siteFilter.deviceId ? `exists({@/devices/device}[*]  ? (@."device-id"like_regex"${siteFilter.deviceId}"))` : null,
  );
  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : '';
}

export function getSiteNetworkAccessFilterParams(siteNetworkAccessFilter: SiteNetworkAccessFilter): string {
  const filters = [];
  filters.push(
    siteNetworkAccessFilter.id ? `@."site-network-access-id"like_regex"${siteNetworkAccessFilter.id}"` : null,
  );
  filters.push(
    siteNetworkAccessFilter.locationId
      ? `@."location-reference"like_regex"${siteNetworkAccessFilter.locationId}"`
      : null,
  );
  filters.push(
    siteNetworkAccessFilter.deviceId ? `@."device-reference"like_regex"${siteNetworkAccessFilter.deviceId}"` : null,
  );
  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : '';
}

export function getVpnBearerFilterParams(vpnBearerFilter: VpnBearerFilter): string {
  const filters = [];
  // bearer filters
  filters.push(vpnBearerFilter.id ? `@."sp-bearer-reference"like_regex"${vpnBearerFilter.id}"` : null);
  filters.push(vpnBearerFilter.description ? `@."description"like_regex"${vpnBearerFilter.description}"` : null);
  filters.push(vpnBearerFilter.neId ? `{@/ne-id} like_regex "${vpnBearerFilter.neId}"` : null);
  filters.push(vpnBearerFilter.portId ? `{@/port-id} like_regex "${vpnBearerFilter.portId}"` : null);
  filters.push(vpnBearerFilter.carrierName ? `@."carrier-name"like_regex"${vpnBearerFilter.carrierName}"` : null);
  filters.push(
    vpnBearerFilter.carrierReference ? `@."carrier-reference"like_regex"${vpnBearerFilter.carrierReference}"` : null,
  );
  filters.push(
    vpnBearerFilter.serviceType ? `{@/carrier/service-type} like_regex "${vpnBearerFilter.serviceType}"` : null,
  );
  filters.push(
    vpnBearerFilter.serviceStatus ? `{@/carrier/service-status} like_regex "${vpnBearerFilter.serviceStatus}"` : null,
  );

  // evc filters
  filters.push(
    vpnBearerFilter.circuitReference
      ? encodeURIComponent(
          `exists({@/evc-attachments/evc-attachment}[*] ? (@."circuit-reference"like_regex"${vpnBearerFilter.circuitReference}"))`,
        )
      : null,
  );
  filters.push(
    vpnBearerFilter.carrierEvcReference
      ? encodeURIComponent(
          `exists({@/evc-attachments/evc-attachment}[*] ? (@."carrier-reference"like_regex"${vpnBearerFilter.carrierEvcReference}"))`,
        )
      : null,
  );
  filters.push(
    vpnBearerFilter.inputBandwidth
      ? encodeURIComponent(
          `exists({@/evc-attachments/evc-attachment}[*] ? (@."input-bandwidth" == ${vpnBearerFilter.inputBandwidth}))`,
        )
      : null,
  );
  filters.push(
    vpnBearerFilter.adminStatus
      ? encodeURIComponent(`{@/status/admin-status/status} like_regex "${vpnBearerFilter.adminStatus}"`)
      : null,
  );
  filters.push(
    vpnBearerFilter.operStatus
      ? encodeURIComponent(`{@/status/oper-status/status} like_regex "${vpnBearerFilter.operStatus}"`)
      : null,
  );

  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : '';
}

export function getLocationFilterParams(locationFilter: LocationFilter): string {
  const filters = [];
  filters.push(locationFilter.locationId ? `@."location-id"like_regex"${locationFilter.locationId}"` : null);
  filters.push(locationFilter.street ? `@."street"like_regex"${locationFilter.street}"` : null);
  filters.push(locationFilter.postalCode ? `@."postal-code"like_regex"${locationFilter.postalCode}"` : null);
  filters.push(locationFilter.state ? `@."state"like_regex"${locationFilter.state}"` : null);
  filters.push(locationFilter.city ? `@."city"like_regex"${locationFilter.city}"` : null);
  filters.push(locationFilter.countryCode ? `@."country-code"like_regex"${locationFilter.countryCode}"` : null);
  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : '';
}

export function getDeviceFilterParams(deviceFilter: DeviceFilter): string {
  const filters = [];
  filters.push(deviceFilter.deviceId ? `@."device-id"like_regex"${deviceFilter.deviceId}"` : null);
  filters.push(deviceFilter.managementIp ? `{@/management/address} like_regex "${deviceFilter.managementIp}"` : null);
  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : '';
}

export function getEvcFilterParams(evcFilter: EvcFilter): string {
  const filters = [];
  filters.push(evcFilter.circuitReference ? `@."circuit-reference"like_regex"${evcFilter.circuitReference}"` : null);
  filters.push(evcFilter.carrierReference ? `@."carrier-reference"like_regex"${evcFilter.carrierReference}"` : null);
  filters.push(evcFilter.inputBandwidth ? `@."input-bandwidth"like_regex"${evcFilter.inputBandwidth}"` : null); // TODO: does not work
  filters.push(
    evcFilter.adminStatus
      ? encodeURIComponent(`{@/status/admin-status/status} like_regex "${evcFilter.adminStatus}"`)
      : null,
  ); // TODO: does not work
  filters.push(
    evcFilter.operStatus
      ? encodeURIComponent(`{@/status/oper-status/status} like_regex "${evcFilter.operStatus}"`)
      : null,
  ); // TODO: does not work
  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : '';
}
