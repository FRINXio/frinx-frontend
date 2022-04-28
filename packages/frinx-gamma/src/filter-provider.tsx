import React, { createContext, FC, useState, useMemo } from 'react';
import { DeviceFilters, getDefaultDeviceFilters } from './pages/device-list/device-filter';
import { EvcFilters, getDefaultEvcFilters } from './pages/evc-list/evc-filter';
import { getDefaultLocationFilters, LocationFilters } from './pages/location-list/location-filter';
import { getDefaultServiceFilters, ServiceFilters } from './pages/service-list/service-filter';
import { getDefaultSiteFilter, SiteFilters } from './pages/site-list/site-filter';
import {
  getDefaultSiteNetworkAccessFilters,
  SiteNetworkAccessFilters,
} from './pages/site-network-access-list/site-network-access-filter';
import { getDefaultBearerFilters, VpnBearerFilters } from './pages/vpn-bearer-list/vpn-bearer-filter';

type ContextProps = {
  bearer: VpnBearerFilters;
  site: SiteFilters;
  service: ServiceFilters;
  siteNetworkAccess: SiteNetworkAccessFilters;
  location: LocationFilters;
  device: DeviceFilters;
  evc: EvcFilters;
  onSiteFilterChange: (filter: SiteFilters) => void;
  onBearerFilterChange: (filter: VpnBearerFilters) => void;
  onServiceFilterChange: (filter: ServiceFilters) => void;
  onSiteNetworkAccessFilterChange: (filter: SiteNetworkAccessFilters) => void;
  onLocationFilterChange: (filter: LocationFilters) => void;
  onDeviceFilterChange: (filter: DeviceFilters) => void;
  onEvcFilterChange: (filter: EvcFilters) => void;
};

export const FilterContext = createContext<ContextProps | null>(null);

export const FilterProvider: FC = ({ children }) => {
  const [siteFilters, setSiteFilters] = useState(getDefaultSiteFilter());
  const [bearerFilters, setBearerFilters] = useState(getDefaultBearerFilters());
  const [serviceFilters, setServiceFilters] = useState(getDefaultServiceFilters());
  const [siteNetworkAccessFilters, setSiteNetworkAccessFilters] = useState<SiteNetworkAccessFilters>(
    getDefaultSiteNetworkAccessFilters(),
  );
  const [locationFilters, setLocationFilters] = useState(getDefaultLocationFilters());
  const [deviceFilters, setDeviceFilters] = useState(getDefaultDeviceFilters());
  const [evcFilters, setEvcFilters] = useState(getDefaultEvcFilters());

  const value = useMemo(
    () => ({
      site: siteFilters,
      bearer: bearerFilters,
      service: serviceFilters,
      siteNetworkAccess: siteNetworkAccessFilters,
      location: locationFilters,
      device: deviceFilters,
      evc: evcFilters,
      onSiteFilterChange: setSiteFilters,
      onBearerFilterChange: setBearerFilters,
      onServiceFilterChange: setServiceFilters,
      onSiteNetworkAccessFilterChange: setSiteNetworkAccessFilters,
      onLocationFilterChange: setLocationFilters,
      onDeviceFilterChange: setDeviceFilters,
      onEvcFilterChange: setEvcFilters,
    }),
    [serviceFilters, bearerFilters, siteFilters, siteNetworkAccessFilters, locationFilters, deviceFilters, evcFilters],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export default FilterContext;
