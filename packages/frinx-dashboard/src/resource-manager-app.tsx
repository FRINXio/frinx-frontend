import { ResourceManagerApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { authContext } from './auth-helpers';

<<<<<<< HEAD
<<<<<<< HEAD:packages/frinx-dashboard/src/resource-manager-app.tsx
const ResourceManagerApp: FC = () => {
=======
const UniresourceApp: FC = () => {
>>>>>>> edc1561c (rebase main branch):packages/frinx-dashboard/src/uniresource-app.tsx
=======
const ResourceManagerApp: FC = () => {
>>>>>>> c4676269 (renaming files and variables uniresource -> resource-manager)
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
<<<<<<< HEAD
    <ResourceManagerAppProvider
=======
<<<<<<< HEAD:packages/frinx-dashboard/src/uniresource-app.tsx
    <UniresourceAppProvider
=======
    <ResourceManagerAppProvider
>>>>>>> a519f73a (renaming files and variables uniresource -> resource-manager):packages/frinx-dashboard/src/resource-manager-app.tsx
>>>>>>> c4676269 (renaming files and variables uniresource -> resource-manager)
      client={ResourceManagerApi.create({ url: window.__CONFIG__.uniresourceApiURL, authContext }).client}
    >
      <App />
    </ResourceManagerAppProvider>
  );
};

export default ResourceManagerApp;
