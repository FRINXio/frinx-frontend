export type ServiceFilter = {
  id: string | null;
  customerName: string | null;
};

export type SiteFilter = {
  id: string | null;
  locationId: string | null;
  deviceId: string | null;
  street: string | null;
  postalCode: string | null;
  state: string | null;
  city: string | null;
  countryCode: string | null;
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
  locationId: string | null;
  managementIp: string | null;
};

export type EvcFilter = {
  evcType: string | null;
  circuitReference: string | null;
  carrierReference: string | null;
  svlanId: string | null;
  qosProfile: string | null;
  inputBandwidth: string | null;
  customerName: string | null;
  adminStatus: string | null;
  operStatus: string | null;
};

function addSlashes(s: string): string {
  return s.replaceAll(/"/g, '\\"');
}

function notEmpty<T>(value: T | null): value is T {
  return value !== null && value !== undefined;
}

// we filter non null filters, encode them and joined them with && operator
export function joinNonNullFilters(filters: (string | null)[]): string {
  const separator = encodeURIComponent('&&'); // AND operator must be url encoded
  return filters
    .filter(notEmpty)
    .map((f) => encodeURIComponent(f))
    .join(separator);
}

export function getServiceFilterParams(serviceFilter: ServiceFilter): string {
  const filters = [];
  filters.push(serviceFilter.id ? `@."vpn-id"like_regex"${addSlashes(serviceFilter.id)}"` : null);
  filters.push(
    serviceFilter.customerName ? `@."customer-name"like_regex"${addSlashes(serviceFilter.customerName)}"` : null,
  );
  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : '';
}

export function getSiteFilterParams(siteFilter: SiteFilter): string {
  const filters = [];
  filters.push(siteFilter.id ? `@."site-id"like_regex"${addSlashes(siteFilter.id)}"` : null);
  filters.push(
    siteFilter.locationId
      ? `exists({@/locations/location}[*] ? (@."location-id"like_regex"${addSlashes(siteFilter.locationId)}"))`
      : null,
  );
  filters.push(
    siteFilter.deviceId
      ? `exists({@/devices/device}[*]  ? (@."device-id"like_regex"${addSlashes(siteFilter.deviceId)}"))`
      : null,
  );
  filters.push(
    siteFilter.street
      ? `exists({@/locations/location}[*]  ? (@."address"like_regex"${addSlashes(siteFilter.street)}"))`
      : null,
  );
  filters.push(
    siteFilter.postalCode
      ? `exists({@/locations/location}[*]  ? (@."postal-code"like_regex"${addSlashes(siteFilter.postalCode)}"))`
      : null,
  );
  filters.push(
    siteFilter.state
      ? `exists({@/locations/location}[*]  ? (@."state"like_regex"${addSlashes(siteFilter.state)}"))`
      : null,
  );
  filters.push(
    siteFilter.city
      ? `exists({@/locations/location}[*]  ? (@."city"like_regex"${addSlashes(siteFilter.city)}"))`
      : null,
  );
  filters.push(
    siteFilter.countryCode
      ? `exists({@/locations/location}[*]  ? (@."country-code"like_regex"${addSlashes(siteFilter.countryCode)}"))`
      : null,
  );
  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinedFilters}` : '';
}

export function getSiteNetworkAccessFilterParams(siteNetworkAccessFilter: SiteNetworkAccessFilter): string {
  const filters = [];
  filters.push(
    siteNetworkAccessFilter.id
      ? `@."site-network-access-id"like_regex"${addSlashes(siteNetworkAccessFilter.id)}"`
      : null,
  );
  filters.push(
    siteNetworkAccessFilter.locationId
      ? `@."location-reference"like_regex"${addSlashes(siteNetworkAccessFilter.locationId)}"`
      : null,
  );
  filters.push(
    siteNetworkAccessFilter.deviceId
      ? `@."device-reference"like_regex"${addSlashes(siteNetworkAccessFilter.deviceId)}"`
      : null,
  );
  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinedFilters}` : '';
}

export function getVpnBearerFilterParams(vpnBearerFilter: VpnBearerFilter): string {
  const filters = [];
  // bearer filters
  filters.push(vpnBearerFilter.id ? `@."sp-bearer-reference"like_regex"${addSlashes(vpnBearerFilter.id)}"` : null);
  filters.push(
    vpnBearerFilter.description ? `@."description"like_regex"${addSlashes(vpnBearerFilter.description)}"` : null,
  );
  filters.push(vpnBearerFilter.neId ? `{@/ne-id} like_regex "${addSlashes(vpnBearerFilter.neId)}"` : null);
  filters.push(vpnBearerFilter.portId ? `{@/port-id} like_regex "${addSlashes(vpnBearerFilter.portId)}"` : null);
  filters.push(
    vpnBearerFilter.carrierName ? `@."carrier-name"like_regex"${addSlashes(vpnBearerFilter.carrierName)}"` : null,
  );
  filters.push(
    vpnBearerFilter.carrierReference
      ? `@."carrier-reference"like_regex"${addSlashes(vpnBearerFilter.carrierReference)}"`
      : null,
  );
  filters.push(
    vpnBearerFilter.serviceType
      ? `{@/carrier/service-type} like_regex "${addSlashes(vpnBearerFilter.serviceType)}"`
      : null,
  );
  filters.push(
    vpnBearerFilter.serviceStatus
      ? `{@/carrier/service-status} like_regex "${addSlashes(vpnBearerFilter.serviceStatus)}"`
      : null,
  );

  // evc filters
  filters.push(
    vpnBearerFilter.circuitReference
      ? `exists({@/evc-attachments/evc-attachment}[*] ? (@."circuit-reference"like_regex"${addSlashes(
          vpnBearerFilter.circuitReference,
        )}"))`
      : null,
  );
  filters.push(
    vpnBearerFilter.carrierEvcReference
      ? `exists({@/evc-attachments/evc-attachment}[*] ? (@."carrier-reference"like_regex"${addSlashes(
          vpnBearerFilter.carrierEvcReference,
        )}"))`
      : null,
  );
  filters.push(
    vpnBearerFilter.inputBandwidth
      ? `exists({@/evc-attachments/evc-attachment}[*] ? (@."input-bandwidth" == ${addSlashes(
          vpnBearerFilter.inputBandwidth,
        )}))`
      : null,
  );
  filters.push(
    vpnBearerFilter.adminStatus
      ? `{@/status/admin-status/status} like_regex "${addSlashes(vpnBearerFilter.adminStatus)}"`
      : null,
  );
  filters.push(
    vpnBearerFilter.operStatus
      ? `{@/status/oper-status/status} like_regex "${addSlashes(vpnBearerFilter.operStatus)}"`
      : null,
  );

  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinedFilters}` : '';
}

export function getLocationFilterParams(locationFilter: LocationFilter): string {
  const filters = [];
  filters.push(
    locationFilter.locationId ? `@."location-id"like_regex"${addSlashes(locationFilter.locationId)}"` : null,
  );
  filters.push(locationFilter.street ? `@."street"like_regex"${addSlashes(locationFilter.street)}"` : null);
  filters.push(
    locationFilter.postalCode ? `@."postal-code"like_regex"${addSlashes(locationFilter.postalCode)}"` : null,
  );
  filters.push(locationFilter.state ? `@."state"like_regex"${addSlashes(locationFilter.state)}"` : null);
  filters.push(locationFilter.city ? `@."city"like_regex"${addSlashes(locationFilter.city)}"` : null);
  filters.push(
    locationFilter.countryCode ? `@."country-code"like_regex"${addSlashes(locationFilter.countryCode)}"` : null,
  );
  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : '';
}

export function getDeviceFilterParams(deviceFilter: DeviceFilter): string {
  const filters = [];
  filters.push(deviceFilter.deviceId ? `@."device-id"like_regex"${addSlashes(deviceFilter.deviceId)}"` : null);
  filters.push(deviceFilter.locationId ? `@."location"like_regex"${addSlashes(deviceFilter.locationId)}"` : null);
  filters.push(
    deviceFilter.managementIp ? `{@/management/address} like_regex "${addSlashes(deviceFilter.managementIp)}"` : null,
  );
  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinedFilters}` : '';
}

export function getEvcFilterParams(evcFilter: EvcFilter): string {
  const filters = [];
  filters.push(evcFilter.evcType ? `@."evc-type"like_regex"${addSlashes(evcFilter.evcType)}"` : null);
  filters.push(
    evcFilter.circuitReference ? `@."circuit-reference"like_regex"${addSlashes(evcFilter.circuitReference)}"` : null,
  );
  filters.push(
    evcFilter.carrierReference ? `@."carrier-reference"like_regex"${addSlashes(evcFilter.carrierReference)}"` : null,
  );
  filters.push(evcFilter.svlanId ? `@."svlan-id"like_regex"${addSlashes(evcFilter.svlanId)}"` : null);
  filters.push(evcFilter.qosProfile ? `@."qos-input-profile"like_regex"${addSlashes(evcFilter.qosProfile)}"` : null);
  filters.push(
    evcFilter.inputBandwidth ? `@."input-bandwidth"like_regex"${addSlashes(evcFilter.inputBandwidth)}"` : null,
  ); // TODO: does not work
  filters.push(
    evcFilter.adminStatus ? `{@/status/admin-status/status} like_regex "${addSlashes(evcFilter.adminStatus)}"` : null,
  ); // TODO: does not work
  filters.push(
    evcFilter.operStatus ? `{@/status/oper-status/status} like_regex "${addSlashes(evcFilter.operStatus)}"` : null,
  ); // TODO: does not work
  const joinedFilters = joinNonNullFilters(filters);
  return joinedFilters ? `&jsonb-filter=${joinedFilters}` : '';
}
