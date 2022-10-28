import { UniresourceApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { authContext } from './auth-helpers';

const UniresourceApp: FC = () => {
  const [components, setComponents] = useState<typeof import('@frinx/resource-manager/src') | null>(null);

  useEffect(() => {
    import('@frinx/resource-manager/src').then((mod) => {
      setComponents(mod);
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { UniresourceAppProvider, UniresourceApp: App } = components;

  return (
    <UniresourceAppProvider
      client={UniresourceApi.create({ url: window.__CONFIG__.uniresourceApiURL, authContext }).client}
    >
      <App />
    </UniresourceAppProvider>
  );
};

export default UniresourceApp;
