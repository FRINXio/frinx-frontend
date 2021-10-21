import { FC } from 'beautiful-react-diagrams/node_modules/@types/react';
import React, { VoidFunctionComponent, useState, useEffect } from 'react';
import { useHistory, Switch, Route } from 'react-router-dom';
import * as unistoreCallbacks from './api/unistore/unistore';
import { executeWorkflow, getWorkflowInstanceDetail } from './api/uniflow/uniflow-api';

const callbacks = {
  ...unistoreCallbacks,
  executeWorkflow,
  getWorkflowInstanceDetail,
};

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
        SiteList,
        SiteNetworkAccessList,
        EditSiteNetAccess,
        DeviceList,
        CreateDevice,
        EditDevice,
        VpnBearerList,
        CreateBearer,
        EditBearer,
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
        SiteList,
        SiteNetworkAccessList,
        DeviceList,
        CreateDevice,
        EditDevice,
        VpnBearerList,
        CreateBearer,
        EditBearer,
        UnistoreApiProvider: getUnistoreApiProvider(callbacks),
      });
    });
  }, []);

  if (components == null) {
    return null;
  }

  const {
    Main,
    CreateDevice,
    CreateSiteNetAccess,
    CreateVpnService,
    CreateVpnSite,
    DeviceList,
    EditDevice,
    EditSiteNetAccess,
    EditVpnService,
    EditVpnSite,
    ServiceList,
    SiteList,
    SiteNetworkAccessList,
    VpnBearerList,
    CreateBearer,
    EditBearer,
    UnistoreApiProvider,
  } = components;

  return (
    <UnistoreApiProvider>
      <Switch>
        {/* main */}
        <Route path="/gamma/" exact>
          <Main
            onServicesSiteLinkClick={() => {
              history.push('/gamma/services');
            }}
            onSitesSiteLinkClick={() => {
              history.push('/gamma/sites');
            }}
            onVpnBearerLinkClick={() => {
              history.push('/gamma/vpn-bearers');
            }}
          />
        </Route>

        {/* services */}
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

        {/* sites */}
        <Route path="/gamma/sites" exact>
          <SiteList
            onCreateVpnSiteClick={() => {
              history.push('/gamma/sites/add');
            }}
            onEditVpnSiteClick={(siteId: string) => {
              history.push(`/gamma/sites/edit/${siteId}`);
            }}
            onDetailVpnSiteClick={(siteId: string) => {
              history.push(`/gamma/sites/detail/${siteId}`);
            }}
            onDevicesVpnSiteClick={(siteId: string) => {
              history.push(`/gamma/sites/devices/${siteId}`);
            }}
          />
        </Route>
        <Route path="/gamma/sites/add" exact>
          <CreateVpnSite
            onSuccess={() => {
              history.push('/gamma/sites');
            }}
            onCancel={() => {
              history.push('/gamma/sites');
            }}
          />
        </Route>
        <Route path="/gamma/sites/edit/:siteId" exact>
          <EditVpnSite
            onSuccess={() => {
              history.push('/gamma/sites');
            }}
            onCancel={() => {
              history.push('/gamma/sites');
            }}
          />
        </Route>

        {/* network accesses */}
        <Route path="/gamma/sites/detail/:siteId" exact>
          <SiteNetworkAccessList
            onCreateSiteNetworkAccessClick={(siteId: string) => {
              history.push(`/gamma/sites/detail/${siteId}/add-access`);
            }}
            onEditSiteNetworkAccessClick={(siteId: string, accessId: string) => {
              history.push(`/gamma/sites/detail/${siteId}/edit-access/${accessId}`);
            }}
            onSiteListClick={() => {
              history.push(`/gamma/sites`);
            }}
          />
        </Route>
        <Route path="/gamma/sites/detail/:siteId/add-access" exact>
          <CreateSiteNetAccess
            onSuccess={(siteId: string) => {
              history.push(`/gamma/sites/detail/${siteId}`);
            }}
            onCancel={(siteId: string) => {
              history.push(`/gamma/sites/detail/${siteId}`);
            }}
          />
        </Route>
        <Route path="/gamma/sites/detail/:siteId/edit-access/:accessId" exact>
          <EditSiteNetAccess
            onSuccess={(siteId: string) => {
              history.push(`/gamma/sites/detail/${siteId}`);
            }}
            onCancel={(siteId: string) => {
              history.push(`/gamma/sites/detail/${siteId}`);
            }}
          />
        </Route>

        {/* devices */}
        <Route path="/gamma/sites/devices/:siteId" exact>
          <DeviceList
            onCreateDeviceClick={(siteId: string) => {
              history.push(`/gamma/sites/devices/${siteId}/add-device`);
            }}
            onEditDeviceClick={(siteId: string, deviceId: string) => {
              history.push(`/gamma/sites/devices/${siteId}/edit-device/${deviceId}`);
            }}
            onSiteListClick={() => {
              history.push(`/gamma/sites`);
            }}
          />
        </Route>
        <Route path="/gamma/sites/devices/:siteId/add-device" exact>
          <CreateDevice
            onSuccess={(siteId: string) => {
              history.push(`/gamma/sites/devices/${siteId}`);
            }}
            onCancel={(siteId: string) => {
              history.push(`/gamma/sites/devices/${siteId}`);
            }}
          />
        </Route>
        <Route path="/gamma/sites/devices/:siteId/edit-device/:deviceId" exact>
          <EditDevice
            onSuccess={(siteId: string) => {
              history.push(`/gamma/sites/devices/${siteId}`);
            }}
            onCancel={(siteId: string) => {
              history.push(`/gamma/sites/devices/${siteId}`);
            }}
          />
        </Route>

        {/* bearers */}
        <Route path="/gamma/vpn-bearers" exact>
          <VpnBearerList
            onEditVpnBearerClick={(bearerId: string) => {
              history.push(`/gamma/vpn-bearers/edit/${bearerId}`);
            }}
            onCreateVpnBearerClick={() => {
              history.push(`/gamma/vpn-bearers/add`);
            }}
          />
        </Route>
        <Route path="/gamma/vpn-bearers/add" exact>
          <CreateBearer
            onSuccess={() => {
              history.push(`/gamma/vpn-bearers`);
            }}
            onCancel={() => {
              history.push(`/gamma/vpn-bearers`);
            }}
          />
        </Route>
        <Route path="/gamma/vpn-bearers/edit/:bearerId" exact>
          <EditBearer
            onSuccess={() => {
              history.push('/gamma/vpn-bearers');
            }}
            onCancel={() => {
              history.push('/gamma/vpn-bearers');
            }}
          />
        </Route>
      </Switch>
    </UnistoreApiProvider>
  );
};

export default GammaApp;
