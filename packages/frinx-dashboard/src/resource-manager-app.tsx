import { ResourceManagerApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { authContext } from './auth-helpers';

<<<<<<< HEAD:packages/frinx-dashboard/src/resource-manager-app.tsx
const ResourceManagerApp: FC = () => {
=======
const UniresourceApp: FC = () => {
>>>>>>> edc1561c (rebase main branch):packages/frinx-dashboard/src/uniresource-app.tsx
  const [components, setComponents] = useState<typeof import('@frinx/resource-manager/src') | null>(null);

  useEffect(() => {
    import('@frinx/resource-manager/src').then((mod) => {
      setComponents(mod);
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { ResourceManagerAppProvider, ResourceManagerApp: App } = components;

  return (
    <ResourceManagerAppProvider
      client={ResourceManagerApi.create({ url: window.__CONFIG__.uniresourceApiURL, authContext }).client}
    >
      <App />
    </ResourceManagerAppProvider>
  );
};

export default ResourceManagerApp;
