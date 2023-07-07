import { AccountInfo, InteractionStatus, IPublicClientApplication } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { UniflowApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { authContext } from './auth-helpers';

type UniflowComponents = Omit<typeof import('@frinx/workflow-ui/src'), 'getUniflowApiProvider'> & {
  UniflowApiProvider: FC;
};
type BuilderComponents = {
  BuilderApiProvider: FC;
};

async function getRefreshedToken(
  inProgress: InteractionStatus,
  accounts: AccountInfo[],
  instance: IPublicClientApplication,
): Promise<string | null> {
  console.log(inProgress, accounts);
  if (inProgress === 'none' && accounts.length > 0) {
    try {
      console.log(accounts[0]);
      const authResult = await instance.acquireTokenSilent({
        account: accounts[0],
        scopes: ['User.Read'],
      });

      console.log('authResult: ', authResult.idToken);

      return authResult.idToken || null;
    } catch (e) {
      console.log('errors:', e);
    }
  }

  return null;
}

const UniflowApp: FC = () => {
  const [components, setComponents] = useState<(UniflowComponents & BuilderComponents) | null>(null);
  const { inProgress, accounts, instance } = useMsal();

  useEffect(() => {
    Promise.all([import('@frinx/workflow-ui/src'), import('@frinx/workflow-builder/src')]).then(
      ([uniflowImport, builderImport]) => {
        const { UniflowApp: App, getUniflowApiProvider } = uniflowImport;
        const { getBuilderApiProvider } = builderImport;

        const refreshToken = () => getRefreshedToken(inProgress, accounts, instance);

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
