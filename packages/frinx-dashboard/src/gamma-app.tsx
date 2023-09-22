import { InventoryApi, UniflowApi, UnistoreApi } from '@frinx/api';
import { GammaAppProviderProps } from '@frinxio/gamma';
import React, { FC, useEffect, useState, VoidFunctionComponent } from 'react';
import { authContext } from './auth-helpers';
import { useConfigContext } from './config.provider';

type GammaComponents = Omit<typeof import('@frinxio/gamma'), 'getGammaAppProvider'> & {
  GammaAppProvider: FC<GammaAppProviderProps>;
};

const GammaApp: VoidFunctionComponent = () => {
  const { unistoreApiURL, uniflowApiURL, inventoryApiURL, inventoryWsURL } = useConfigContext();
  const [components, setComponents] = useState<GammaComponents | null>(null);
  const [hasTransactionError, setHasTransactionError] = useState(false);

  useEffect(() => {
    import('@frinxio/gamma').then((gammaImport) => {
      const { getGammaAppProvider, GammaApp: App } = gammaImport;

      setComponents({
        GammaApp: App,
        GammaAppProvider: getGammaAppProvider({
          unistoreClient: UnistoreApi.create({ url: unistoreApiURL, authContext }, '').client,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          workflowManagerClient: UniflowApi.create({ url: uniflowApiURL, authContext }).client,
        }),
      });
    });
  }, [uniflowApiURL, unistoreApiURL]);

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
      deviceInventoryClient={InventoryApi.create({ url: inventoryApiURL, authContext }).client}
      wsUrl={inventoryWsURL}
    >
      <App />
    </GammaAppProvider>
  );
};

export default GammaApp;
