import { UniflowApi, UnistoreApi } from '@frinx/api';
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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

  const { GammaAppProvider, GammaApp: App } = components;

  return (
    <GammaAppProvider
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
