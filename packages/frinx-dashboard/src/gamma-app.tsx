import { FC } from 'beautiful-react-diagrams/node_modules/@types/react';
import React, { VoidFunctionComponent, useState, useEffect } from 'react';
import { useHistory, Switch, Route } from 'react-router-dom';
import * as callbacks from './api/unistore/unistore';

type GammaComponents = Omit<typeof import('@frinx/gamma/build'), 'getUnistoreApiProvider'> & {
  UnistoreApiProvider: FC;
};

const GammaApp: VoidFunctionComponent = () => {
  const [components, setComponents] = useState<GammaComponents | null>(null);
  const history = useHistory();

  useEffect(() => {
    import('@frinx/gamma/build').then((gammaImport) => {
      const {
        Main,
        CreateVpnService,
        EditVpnService,
        CreateVpnSite,
        EditVpnSite,
        CreateSiteNetAccess,
        EditSiteNetAccess,
        getUnistoreApiProvider,
      } = gammaImport;

      setComponents({
        Main,
        CreateVpnService,
        EditVpnService,
        CreateVpnSite,
        EditVpnSite,
        CreateSiteNetAccess,
        EditSiteNetAccess,
        UnistoreApiProvider: getUnistoreApiProvider(callbacks),
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const {
    Main,
    CreateVpnService,
    EditVpnService,
    CreateVpnSite,
    EditVpnSite,
    CreateSiteNetAccess,
    EditSiteNetAccess,
    UnistoreApiProvider,
  } = components;

  return (
    <UnistoreApiProvider>
      <Switch>
        <Route path="/gamma/" exact>
          <Main
            onCreateVpnServiceLinkClick={() => {
              history.push('/gamma/add-vpn-service');
            }}
            onEditVpnServiceLinkClick={() => {
              history.push('/gamma/edit-vpn-service');
            }}
            onCreateVpnSiteLinkClick={() => {
              history.push('/gamma/add-vpn-site');
            }}
            onEditVpnSiteLinkClick={() => {
              history.push('/gamma/edit-vpn-site');
            }}
          />
        </Route>
        <Route path="/gamma/add-vpn-service" exact>
          <CreateVpnService
            onSuccess={() => {
              history.push('/gamma');
            }}
            onCancel={() => {
              history.push('/gamma');
            }}
          />
        </Route>
        <Route path="/gamma/edit-vpn-service" exact>
          <EditVpnService
            onSuccess={() => {
              history.push('/gamma');
            }}
            onCancel={() => {
              history.push('/gamma');
            }}
          />
        </Route>
        <Route path="/gamma/add-vpn-site" exact>
          <CreateVpnSite
            onSuccess={() => {
              history.push('/gamma');
            }}
            onCancel={() => {
              history.push('/gamma');
            }}
          />
        </Route>
        <Route path="/gamma/edit-vpn-site" exact>
          <EditVpnSite
            onSuccess={() => {
              history.push('/gamma');
            }}
            onCancel={() => {
              history.push('/gamma');
            }}
          />
        </Route>
        <Route path="/gamma/add-site-network-access" exact>
          <CreateSiteNetAccess
            onSuccess={() => {
              history.push('/gamma');
            }}
            onCancel={() => {
              history.push('/gamma');
            }}
          />
        </Route>
        <Route path="/gamma/edit-site-network-access" exact>
          <EditSiteNetAccess
            onSuccess={() => {
              history.push('/gamma');
            }}
            onCancel={() => {
              history.push('/gamma');
            }}
          />
        </Route>
      </Switch>
    </UnistoreApiProvider>
  );
};

export default GammaApp;
