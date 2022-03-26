import React, { VoidFunctionComponent } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ControlPage from './pages/control-page/control-page';
import ServiceList from './pages/service-list/service-list';
import CreateVpnService from './pages/create-vpn-service/create-vpn-service';
import EditVpnService from './pages/edit-vpn-service/edit-vpn-service';
import SiteList from './pages/site-list/site-list';
import CreateVpnSite from './pages/create-vpn-site/create-vpn-site';
import EditVpnSite from './pages/edit-vpn-site/edit-vpn-site';
import SiteNetworkAccessList from './pages/site-network-access-list/site-network-access-list';
import CreateSiteNetAccess from './pages/create-site-network-access/create-site-network-access';
import EditSiteNetAccess from './pages/edit-site-network-access/edit-site-network-access';
import DeviceList from './pages/device-list/device-list';
import CreateDevice from './pages/create-device/create-device';
import EditDevice from './pages/edit-device/edit-device';
import LocationList from './pages/location-list/location-list';
import CreateLocation from './pages/create-location/create-location';
import EditLocation from './pages/edit-location/edit-location';
import VpnBearerList from './pages/vpn-bearer-list/vpn-bearer-list';
import CreateBearer from './pages/create-bearer/create-bearer';
import EditBearer from './pages/edit-bearer/edit-bearer';
import EvcAttachmentList from './pages/evc-list/evc-list';
import CreateEvcAttachment from './pages/create-evc-attachment/create-evc-attachment';
import EditEvcAttachment from './pages/edit-evc-attachment/edit-evc-attachment';
import CreateVpnCarrier from './pages/save-carrier/save-carrier';
import CreateVpnNode from './pages/save-node/save-node';
import SearchListPage from './pages/search-list/search-list';

const Root: VoidFunctionComponent = () => {
  return (
    <Routes>
      {/* <Route index element={<Navigate to="control-panel" />} /> */}
      <Route path="/" element={<ControlPage />} />

      {/* services */}
      <Route path="services" element={<ServiceList />} />
      <Route path="services/add" element={<CreateVpnService />} />
      <Route path="services/edit/:serviceId" element={<EditVpnService />} />

      {/* sites */}
      <Route path="sites" element={<SiteList />} />
      <Route path="sites/add" element={<CreateVpnSite />} />
      <Route path="sites/edit/:siteId" element={<EditVpnSite />} />

      {/* network accesses */}
      <Route path="sites/detail/:siteId" element={<SiteNetworkAccessList />} />
      <Route path="sites/detail/:siteId/add-access" element={<CreateSiteNetAccess />} />
      <Route path="sites/detail/:siteId/edit-access/:accessId" element={<EditSiteNetAccess />} />

      {/* devices via sites */}
      <Route path="sites/:siteId/devices" element={<DeviceList />} />
      <Route path="sites/:siteId/devices/add" element={<CreateDevice />} />
      <Route path="sites/:siteId/devices/edit/:deviceId" element={<EditDevice />} />

      {/* devices via locations */}
      <Route path="sites/:siteId/:locationId/devices" element={<DeviceList />} />
      <Route path="sites/:siteId/:locationId/devices/add" element={<CreateDevice />} />
      <Route path="sites/:siteId/:locationId/devices/edit/:deviceId" element={<EditDevice />} />

      {/* locations */}
      <Route path="sites/:siteId/locations" element={<LocationList />} />
      <Route path="sites/:siteId/locations/add" element={<CreateLocation />} />
      <Route path="sites/:siteId/locations/edit/:locationId" element={<EditLocation />} />

      {/* bearers */}
      <Route path="vpn-bearers" element={<VpnBearerList />} />
      <Route path="vpn-bearers/add" element={<CreateBearer />} />
      <Route path="vpn-bearers/add-carrier" element={<CreateVpnCarrier />} />
      <Route path="vpn-bearers/add-node" element={<CreateVpnNode />} />
      <Route path="vpn-bearers/edit/:bearerId" element={<EditBearer />} />

      {/* evc attachments */}
      <Route path="vpn-bearers/:bearerId/evc-attachments" element={<EvcAttachmentList />} />
      <Route path="vpn-bearers/:bearerId/evc-attachments/add" element={<CreateEvcAttachment />} />
      <Route
        path="vpn-bearers/:bearerId/evc-attachments/edit/:evcType/:circuitReference"
        element={<EditEvcAttachment />}
      />

      {/* horizontal search */}
      <Route path="search" element={<SearchListPage />} />
    </Routes>
  );
};

export default Root;
