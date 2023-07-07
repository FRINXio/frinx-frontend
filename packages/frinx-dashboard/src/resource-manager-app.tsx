import { AccountInfo, InteractionStatus, IPublicClientApplication } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { ResourceManagerApi } from '@frinx/api';
import React, { FC, useEffect, useState } from 'react';
import { authContext } from './auth-helpers';

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

const ResourceManagerApp: FC = () => {
  const [components, setComponents] = useState<typeof import('@frinx/resource-manager/src') | null>(null);
  const { inProgress, accounts, instance } = useMsal();

  useEffect(() => {
    import('@frinx/resource-manager/src').then((mod) => {
      setComponents(mod);
    });
  }, []);

  if (components == null) {
    return null;
  }
  const refreshToken = () => getRefreshedToken(inProgress, accounts, instance);

  const { ResourceManagerAppProvider, ResourceManagerApp: App } = components;

  return (
    <ResourceManagerAppProvider
      client={ResourceManagerApi.create({ url: window.__CONFIG__.uniresourceApiURL, authContext }).client}
      refreshToken={refreshToken}
    >
      <App />
    </ResourceManagerAppProvider>
  );
};

export default ResourceManagerApp;
