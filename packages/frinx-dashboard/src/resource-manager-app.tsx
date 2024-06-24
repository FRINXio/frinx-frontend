import { ResourceManagerApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { useConfig } from './config.provider';
import { authContext } from './auth-helpers';

const ResourceManagerApp: FC = () => {
  const { inventoryApiURL } = useConfig();
  const [components, setComponents] = useState<typeof import('@frinx/resource-manager') | null>(null);

  useEffect(() => {
    import('@frinx/resource-manager').then((mod) => {
      setComponents(mod);
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { ResourceManagerAppProvider, ResourceManagerApp: App } = components;

  return (
    <ResourceManagerAppProvider client={ResourceManagerApi.create({ url: inventoryApiURL, authContext }).client}>
      <App />
    </ResourceManagerAppProvider>
  );
};

export default ResourceManagerApp;
