import React, { createContext, FC, useState } from 'react';
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

  const handleSiteFilterChange = (filters: SiteFilters) => {
    console.log('site filters change: ', filters);
    setSiteFilters(filters);
  };

  return (
    <FilterContext.Provider
      value={{
        site: siteFilters,
        bearer: bearerFilters,
        onSiteFilterChange: (filters) => handleSiteFilterChange(filters),
        onBearerFilterChange: setBearerFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
