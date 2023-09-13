import { useMsal } from '@azure/msal-react';
import { InventoryApi, UniflowApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { authContext, refreshToken as getRefreshToken } from './auth-helpers';

type UniflowComponents = Omit<typeof import('@frinx/workflow-ui/src'), 'getUniflowApiProvider'> & {
  UniflowApiProvider: FC;
};
type BuilderComponents = {
  BuilderApiProvider: FC;
};

const UniflowApp: FC = () => {
  const [components, setComponents] = useState<(UniflowComponents & BuilderComponents) | null>(null);
  const { inProgress, accounts, instance } = useMsal();

  useEffect(() => {
    Promise.all([import('@frinx/workflow-ui/src'), import('@frinx/workflow-builder/src')]).then(
      ([uniflowImport, builderImport]) => {
        const { UniflowApp: App, getUniflowApiProvider, InventoryAPIProvider } = uniflowImport;
        const { getBuilderApiProvider } = builderImport;

        const refreshToken = () => getRefreshToken(inProgress, accounts, instance);

        setComponents({
          UniflowApp: App,
          UniflowApiProvider: getUniflowApiProvider(
            UniflowApi.create({ url: window.__CONFIG__.uniflowApiURL, authContext, refreshToken }).client,
          ),
          BuilderApiProvider: getBuilderApiProvider(
            UniflowApi.create({ url: window.__CONFIG__.uniflowApiURL, authContext, refreshToken }).client,
          ),
          InventoryAPIProvider,
        });
      },
    );
  }, [accounts, inProgress, instance]);

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
