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
    import('@frinx/gamma').then((gammaImport) => {
      const {
        Main,
        CreateVpnService,
        EditVpnService,
        CreateVpnSite,
        EditVpnSite,
        CreateSiteNetAccess,
        ServiceList,
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
        ServiceList,
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
    ServiceList,
    UnistoreApiProvider,
  } = components;

  return (
    <UnistoreApiProvider>
      <Switch>
        <Route path="/gamma/" exact>
          <Main
            onServicesSiteLinkClick={() => {
              history.push('/gamma/services');
            }}
            onCreateVpnSiteLinkClick={() => {
              history.push('/gamma/add-vpn-site');
            }}
            onEditVpnSiteLinkClick={() => {
              history.push('/gamma/edit-vpn-site');
            }}
          />
        </Route>
        <Route path="/gamma/services" exact>
          <ServiceList
            onCreateVpnServiceClick={() => {
              history.push('/gamma/services/add');
            }}
            onEditVpnServiceClick={(serviceId: string) => {
              history.push(`/gamma/services/edit/${serviceId}`);
            }}
          />
        </Route>
        <Route path="/gamma/services/add" exact>
          <CreateVpnService
            onSuccess={() => {
              history.push('/gamma/services');
            }}
            onCancel={() => {
              history.push('/gamma/services');
            }}
          />
        </Route>
        <Route path="/gamma/services/edit/:serviceId" exact>
          <EditVpnService
            onSuccess={() => {
              history.push('/gamma/services');
            }}
            onCancel={() => {
              history.push('/gamma/services');
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
