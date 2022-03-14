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

  return (
    <FilterContext.Provider
      // FIXME: should it rererender everytime or should useMemo be used?
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        site: siteFilters,
        bearer: bearerFilters,
        onSiteFilterChange: setSiteFilters,
        onBearerFilterChange: setBearerFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
