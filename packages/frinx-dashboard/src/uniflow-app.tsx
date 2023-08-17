import { InventoryApi, UniflowApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { authContext } from './auth-helpers';

type UniflowComponents = Omit<typeof import('@frinx/workflow-ui'), 'getUniflowApiProvider'> & {
  UniflowApiProvider: FC;
};
type BuilderComponents = {
  BuilderApiProvider: FC;
};

const UniflowApp: FC = () => {
  const [components, setComponents] = useState<(UniflowComponents & BuilderComponents) | null>(null);

  useEffect(() => {
    Promise.all([import('@frinx/workflow-ui'), import('@frinx/workflow-builder')]).then(
      ([uniflowImport, builderImport]) => {
        const { UniflowApp: App, getUniflowApiProvider, InventoryAPIProvider } = uniflowImport;
        const { getBuilderApiProvider } = builderImport;

        setComponents({
          UniflowApp: App,
          UniflowApiProvider: getUniflowApiProvider(
            UniflowApi.create({ url: window.__CONFIG__.uniflowApiURL, authContext }).client,
          ),
          BuilderApiProvider: getBuilderApiProvider(
            UniflowApi.create({ url: window.__CONFIG__.uniflowApiURL, authContext }).client,
          ),
          InventoryAPIProvider,
        });
      },
    );
  }, []);

  if (components == null) {
    return null;
  }

  const { UniflowApiProvider, UniflowApp: App, BuilderApiProvider, InventoryAPIProvider } = components;

  return (
    <InventoryAPIProvider
      client={InventoryApi.create({ authContext, url: window.__CONFIG__.inventoryApiURL }).client}
      wsUrl={window.__CONFIG__.inventoryWsURL}
    >
      <UniflowApiProvider>
        <BuilderApiProvider>
          <App />
        </BuilderApiProvider>
      </UniflowApiProvider>
    </InventoryAPIProvider>
  );
};

export default UniflowApp;
