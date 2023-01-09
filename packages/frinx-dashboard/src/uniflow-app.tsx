import { UniflowApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { authContext } from './auth-helpers';

type UniflowComponents = Omit<typeof import('@frinx/workflow-ui/src'), 'getUniflowApiProvider'> & {
  UniflowApiProvider: FC;
};
type BuilderComponents = {
  BuilderApiProvider: FC;
};

const UniflowApp: FC = () => {
  const [components, setComponents] = useState<(UniflowComponents & BuilderComponents) | null>(null);

  useEffect(() => {
    Promise.all([import('@frinx/workflow-ui/src'), import('@frinx/workflow-builder/src')]).then(
      ([uniflowImport, builderImport]) => {
        const { UniflowApp: App, getUniflowApiProvider } = uniflowImport;
        const { getBuilderApiProvider } = builderImport;

        setComponents({
          UniflowApp: App,
          UniflowApiProvider: getUniflowApiProvider(
            UniflowApi.create({ url: window.__CONFIG__.uniflowApiURL, authContext }).client,
          ),
          BuilderApiProvider: getBuilderApiProvider(
            UniflowApi.create({ url: window.__CONFIG__.uniflowApiURL, authContext }).client,
          ),
        });
      },
    );
  }, []);

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
