import React, { VoidFunctionComponent } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
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
import SearchList from './pages/search-list/search-list';

const Root: VoidFunctionComponent = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route index element={<Navigate to="control-panel" />} />
      {/* ControlPage */}
      <Route
        path="/control-panel"
        element={
          <ControlPage
            onServicesSiteLinkClick={() => {
              navigate('services');
            }}
            onSitesSiteLinkClick={() => {
              navigate('sites');
            }}
            onVpnBearerLinkClick={() => {
              navigate('vpn-bearers');
            }}
          />
        }
      />

      {/* services */}
      <Route
        path="services"
        element={
          <ServiceList
            onCreateVpnServiceClick={() => {
              navigate('services/add');
            }}
            onEditVpnServiceClick={(serviceId: string) => {
              navigate(`services/edit/${serviceId}`);
            }}
          />
        }
      />
      <Route
        path="services/add"
        element={
          <CreateVpnService
            onSuccess={() => {
              navigate('services');
            }}
            onCancel={() => {
              navigate('services');
            }}
          />
        }
      />
      <Route
        path="services/edit/:serviceId"
        element={
          <EditVpnService
            onSuccess={() => {
              navigate('services');
            }}
            onCancel={() => {
              navigate('services');
            }}
          />
        }
      />

      {/* sites */}
      <Route
        path="sites"
        element={
          <SiteList
            onAdvancedSearchClick={() => {
              navigate('search');
            }}
            onCreateVpnSiteClick={() => {
              navigate('sites/add');
            }}
            onEditVpnSiteClick={(siteId: string) => {
              navigate(`sites/edit/${siteId}`);
            }}
            onDetailVpnSiteClick={(siteId: string) => {
              navigate(`sites/detail/${siteId}`);
            }}
            onLocationsVpnSiteClick={(siteId: string) => {
              navigate(`sites/${siteId}/locations`);
            }}
            onDevicesVpnSiteClick={(siteId: string) => {
              navigate(`sites/${siteId}/devices`);
            }}
          />
        }
      />
      <Route
        path="sites/add"
        element={
          <CreateVpnSite
            onSuccess={() => {
              navigate('sites');
            }}
            onCancel={() => {
              navigate('sites');
            }}
          />
        }
      />
      <Route
        path="sites/edit/:siteId"
        element={
          <EditVpnSite
            onSuccess={() => {
              navigate('sites');
            }}
            onCancel={() => {
              navigate('sites');
            }}
          />
        }
      />

      {/* network accesses */}
      <Route
        path="sites/detail/:siteId"
        element={
          <SiteNetworkAccessList
            onCreateSiteNetworkAccessClick={(siteId: string) => {
              navigate(`sites/detail/${siteId}/add-access`);
            }}
            onEditSiteNetworkAccessClick={(siteId: string, accessId: string) => {
              navigate(`sites/detail/${siteId}/edit-access/${accessId}`);
            }}
            onSiteListClick={() => {
              navigate(`sites`);
            }}
          />
        }
      />
      <Route
        path="sites/detail/:siteId/add-access"
        element={
          <CreateSiteNetAccess
            onSuccess={(siteId: string) => {
              navigate(`sites/detail/${siteId}`);
            }}
            onCancel={(siteId: string) => {
              navigate(`sites/detail/${siteId}`);
            }}
          />
        }
      />
      <Route
        path="sites/detail/:siteId/edit-access/:accessId"
        element={
          <EditSiteNetAccess
            onSuccess={(siteId: string) => {
              navigate(`sites/detail/${siteId}`);
            }}
            onCancel={(siteId: string) => {
              navigate(`sites/detail/${siteId}`);
            }}
          />
        }
      />

      {/* devices via sites */}
      <Route
        path="sites/:siteId/devices"
        element={
          <DeviceList
            onCreateDeviceClick={(siteId: string) => {
              navigate(`sites/${siteId}/devices/add`);
            }}
            onEditDeviceClick={(siteId: string, deviceId: string) => {
              navigate(`sites/${siteId}/devices/edit/${deviceId}`);
            }}
            onLocationListClick={() => {
              navigate(`sites`);
            }}
          />
        }
      />
      <Route
        path="sites/:siteId/devices/add"
        element={
          <CreateDevice
            onSuccess={(siteId: string) => {
              navigate(`sites/${siteId}/devices`);
            }}
            onCancel={(siteId: string) => {
              navigate(`sites/${siteId}/devices`);
            }}
          />
        }
      />
      <Route
        path="sites/:siteId/devices/edit/:deviceId"
        element={
          <EditDevice
            onSuccess={(siteId: string) => {
              navigate(`sites/${siteId}/devices`);
            }}
            onCancel={(siteId: string) => {
              navigate(`sites/${siteId}/devices`);
            }}
          />
        }
      />

      {/* devices via locations */}
      <Route
        path="sites/:siteId/:locationId/devices"
        element={
          <DeviceList
            onCreateDeviceClick={(siteId: string, locationId?: string) => {
              navigate(`sites/${siteId}/${locationId}/devices/add`);
            }}
            onEditDeviceClick={(siteId: string, deviceId: string, locationId?: string) => {
              navigate(`sites/${siteId}/${locationId}/devices/edit/${deviceId}`);
            }}
            onLocationListClick={(siteId: string) => {
              navigate(`sites/${siteId}/locations`);
            }}
          />
        }
      />
      <Route
        path="sites/:siteId/:locationId/devices/add"
        element={
          <CreateDevice
            onSuccess={(siteId: string, locationId: string) => {
              navigate(`sites/${siteId}/${locationId}/devices`);
            }}
            onCancel={(siteId: string, locationId: string) => {
              navigate(`sites/${siteId}/${locationId}/devices`);
            }}
          />
        }
      />
      <Route
        path="sites/:siteId/:locationId/devices/edit/:deviceId"
        element={
          <EditDevice
            onSuccess={(siteId: string, locationId: string) => {
              navigate(`sites/${siteId}/${locationId}/devices`);
            }}
            onCancel={(siteId: string, locationId: string) => {
              navigate(`sites/${siteId}/${locationId}/devices`);
            }}
          />
        }
      />

      {/* locations */}
      <Route
        path="sites/:siteId/locations"
        element={
          <LocationList
            onEditLocationClick={(siteId: string, locationId: string) => {
              navigate(`sites/${siteId}/locations/edit/${locationId}`);
            }}
            onCreateLocationClick={(siteId: string) => {
              navigate(`sites/${siteId}/locations/add`);
            }}
            onSiteListClick={() => {
              navigate(`sites`);
            }}
            onDevicesVpnSiteClick={(siteId: string, locationId: string) => {
              navigate(`sites/${siteId}/${locationId}/devices`);
            }}
          />
        }
      />
      <Route
        path="sites/:siteId/locations/add"
        element={
          <CreateLocation
            onSuccess={(siteId: string) => {
              navigate(`sites/${siteId}/locations`);
            }}
            onCancel={(siteId: string) => {
              navigate(`sites/${siteId}/locations`);
            }}
          />
        }
      />
      <Route
        path="sites/:siteId/locations/edit/:locationId"
        element={
          <EditLocation
            onSuccess={(siteId: string) => {
              navigate(`sites/${siteId}/locations`);
            }}
            onCancel={(siteId: string) => {
              navigate(`sites/${siteId}/locations`);
            }}
          />
        }
      />

      {/* bearers */}
      <Route
        path="vpn-bearers"
        element={
          <VpnBearerList
            onEditVpnBearerClick={(bearerId: string) => {
              navigate(`vpn-bearers/edit/${bearerId}`);
            }}
            onCreateVpnBearerClick={() => {
              navigate(`vpn-bearers/add`);
            }}
            onCreateVpnCarrierClick={() => {
              navigate(`vpn-bearers/add-carrier`);
            }}
            onCreateVpnNodeClick={() => {
              navigate(`vpn-bearers/add-node`);
            }}
            onEvcAttachmentSiteClick={(bearerId: string) => {
              navigate(`vpn-bearers/${bearerId}/evc-attachments`);
            }}
          />
        }
      />
      <Route
        path="vpn-bearers/add"
        element={
          <CreateBearer
            onSuccess={() => {
              navigate(`vpn-bearers`);
            }}
            onCancel={() => {
              navigate(`vpn-bearers`);
            }}
          />
        }
      />
      <Route
        path="vpn-bearers/add-carrier"
        element={
          <CreateVpnCarrier
            onSuccess={() => {
              navigate(`vpn-bearers`);
            }}
            onCancel={() => {
              navigate(`vpn-bearers`);
            }}
          />
        }
      />
      <Route
        path="vpn-bearers/add-node"
        element={
          <CreateVpnNode
            onSuccess={() => {
              navigate(`vpn-bearers`);
            }}
            onCancel={() => {
              navigate(`vpn-bearers`);
            }}
          />
        }
      />
      <Route
        path="vpn-bearers/edit/:bearerId"
        element={
          <EditBearer
            onSuccess={() => {
              navigate('vpn-bearers');
            }}
            onCancel={() => {
              navigate('vpn-bearers');
            }}
          />
        }
      />

      {/* evc attachments */}
      <Route
        path="vpn-bearers/:bearerId/evc-attachments"
        element={
          <EvcAttachmentList
            onCreateEvcClick={(bearerId: string) => {
              navigate(`vpn-bearers/${bearerId}/evc-attachments/add`);
            }}
            onEditEvcClick={(bearerId: string, evcType: string, circuitReference: string) => {
              navigate(`vpn-bearers/${bearerId}/evc-attachments/edit/${evcType}/${circuitReference}`);
            }}
            onBearerListClick={() => {
              navigate(`vpn-bearers`);
            }}
          />
        }
      />
      <Route
        path="vpn-bearers/:bearerId/evc-attachments/add"
        element={
          <CreateEvcAttachment
            onSuccess={(bearerId: string) => {
              navigate(`vpn-bearers/${bearerId}/evc-attachments`);
            }}
            onCancel={(bearerId: string) => {
              navigate(`vpn-bearers/${bearerId}/evc-attachments`);
            }}
          />
        }
      />
      <Route
        path="vpn-bearers/:bearerId/evc-attachments/edit/:evcType/:circuitReference"
        element={
          <EditEvcAttachment
            onSuccess={(bearerId: string) => {
              navigate(`vpn-bearers/${bearerId}/evc-attachments`);
            }}
            onCancel={(bearerId: string) => {
              navigate(`vpn-bearers/${bearerId}/evc-attachments`);
            }}
          />
        }
      />

      {/* horizontal search */}
      <Route path="search">
        <SearchList />
      </Route>
    </Routes>
  );
};

export default Root;
