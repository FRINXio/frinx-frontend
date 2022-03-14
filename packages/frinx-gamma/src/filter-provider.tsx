import React, { createContext, FC, useState, useMemo } from 'react';
import { getDefaultSiteFilter, SiteFilters } from './pages/site-list/site-filter';
import { getDefaultBearerFilters, VpnBearerFilters } from './pages/vpn-bearer-list/vpn-bearer-filter';

type ContextProps = {
  bearer: VpnBearerFilters;
  site: SiteFilters;
  onSiteFilterChange: (filter: SiteFilters) => void;
  onBearerFilterChange: (filter: VpnBearerFilters) => void;
};

export const FilterContext = createContext<ContextProps | null>(null);

export const FilterProvider: FC = ({ children }) => {
  const [siteFilters, setSiteFilters] = useState<SiteFilters>(getDefaultSiteFilter());
  const [bearerFilters, setBearerFilters] = useState<VpnBearerFilters>(getDefaultBearerFilters());

  const value = useMemo(
    () => ({
      site: siteFilters,
      bearer: bearerFilters,
      onSiteFilterChange: setSiteFilters,
      onBearerFilterChange: setBearerFilters,
    }),
    [bearerFilters, siteFilters],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export default FilterContext;
