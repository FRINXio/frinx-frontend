import { useMsal } from '@azure/msal-react';
import { UniflowApi } from '@frinx/api';
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
        const { UniflowApp: App, getUniflowApiProvider } = uniflowImport;
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
        });
      },
    );
  }, [accounts, inProgress, instance]);

  if (components == null) {
    return null;
  }

  const { UniflowApiProvider, UniflowApp: App, BuilderApiProvider } = components;

  return (
    <UniflowApiProvider>
      <BuilderApiProvider>
        <App />
      </BuilderApiProvider>
    </UniflowApiProvider>
  );
};

export default UniflowApp;
