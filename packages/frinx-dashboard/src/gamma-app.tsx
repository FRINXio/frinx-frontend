import { ResourceManagerApi, UniflowApi, UnistoreApi } from '@frinx/api';
import { GammaAppProviderProps } from '@frinxio/gamma';
import React, { FC, useEffect, useState, VoidFunctionComponent } from 'react';
import { authContext } from './auth-helpers';

type GammaComponents = Omit<typeof import('@frinxio/gamma'), 'getGammaAppProvider'> & {
  GammaAppProvider: FC<GammaAppProviderProps>;
};

const GammaApp: VoidFunctionComponent = () => {
  const [components, setComponents] = useState<GammaComponents | null>(null);
  const [hasTransactionError, setHasTransactionError] = useState(false);

  useEffect(() => {
    import('@frinxio/gamma').then((gammaImport) => {
      const { getGammaAppProvider, GammaApp: App } = gammaImport;

      setComponents({
        GammaApp: App,
        GammaAppProvider: getGammaAppProvider({
          unistoreCallbacks: UnistoreApi.create({ url: window.__CONFIG__.unistoreApiURL, authContext }, '').client,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          workflowManagerCallbacks: UniflowApi.create({ url: window.__CONFIG__.uniflowApiURL, authContext }).client,
        }),
      });
    });
  }, []);

  useEffect(() => {
    authContext.eventEmitter.once('FORBIDDEN', () => {
      setHasTransactionError(true);
    });
  }, []);

  if (components == null) {
    return null;
  }

  const { GammaAppProvider, GammaApp: App } = components;
  const resourceManagerClient = ResourceManagerApi.create({
    url: window.__CONFIG__.uniresourceApiURL,
    authContext,
  });

  return (
    <GammaAppProvider
      resourceManagerClient={resourceManagerClient}
      hasTransactionError={hasTransactionError}
      onTransactionRefresh={() => {
        setHasTransactionError(false);
      }}
    >
      <App />
    </GammaAppProvider>
  );
};

export default GammaApp;
