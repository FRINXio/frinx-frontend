// import { Box, Button } from '@chakra-ui/react';
import { UniflowApi, UnistoreApi } from '@frinx/api';
import { GammaAppProviderProps } from '@frinx/gamma/dist/gamma-app-provider';
import React, { FC, useEffect, useState } from 'react';
import { authContext } from './auth-helpers';

type GammaComponents = Omit<typeof import('@frinx/gamma'), 'getGammaProvider'> & {
  GammaAppProvider: FC<GammaAppProviderProps>;
};

const GammaApp: FC = () => {
  const [components, setComponents] = useState<GammaComponents | null>(null);
  const [hasTransactionError, setHasTransactionError] = useState(false);

  useEffect(() => {
    import('@frinx/gamma').then((gammaImport) => {
      const { getGammaAppProvider, ...gammaComponents } = gammaImport;

      setComponents({
        GammaAppProvider: getGammaAppProvider({
          unistoreCallbacks: UnistoreApi.create({ url: window.__CONFIG__.unistoreApiURL, authContext }, '').client,
          uniflowCallbacks: UniflowApi.create({ url: window.__CONFIG__.uniflowApiURL, authContext }).client,
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

  const { getGammaAppProvider: GammaAppProvider, GammaApp: App } = components;

  return (
    // <GammaAppProvider
    //   uniflowCallbacks={UniflowApi.create({ url: window.__CONFIG__.uniflowApiURL, authContext }).client}
    //   unistoreCallbacks={UnistoreApi.create({ url: window.__CONFIG__.unistoreApiURL, authContext }, '').client}
    // >
    //   <App />
    // </GammaAppProvider>
    <div />
  );
};

export default GammaApp;
