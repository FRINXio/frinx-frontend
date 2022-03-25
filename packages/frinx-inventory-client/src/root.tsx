import React, { VoidFunctionComponent } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import CreateBlueprintPage from './pages/create-blueprint/create-blueprint-page';
import CreateDevicePage from './pages/create-device/create-device-page';
import DeviceBlueprints from './pages/device-blueprints/device-blueprints';
import DeviceConfigPage from './pages/device-config/device-config-page';
import DeviceList from './pages/device-list/device-list';
import EditBlueprintPage from './pages/edit-blueprint/edit-blueprint-page';
import EditDevicePage from './pages/edit-device/edit-device-page';

const Root: VoidFunctionComponent = () => {
  const navigate = useNavigate();

  const handleDeviceListRedirect = () => {
    navigate('devices');
  };
  const handleBlueprintListRedirect = () => {
    navigate('blueprints');
  };

  return (
    <Routes>
      <Route index element={<Navigate replace to="devices" />} />
      <Route path="devices" element={<DeviceList />} />
      <Route path="new" element={<CreateDevicePage onAddDeviceSuccess={handleDeviceListRedirect} />} />
      <Route
        path=":deviceId/edit"
        element={<EditDevicePage onSuccess={handleDeviceListRedirect} onCancelButtonClick={handleDeviceListRedirect} />}
      />
      <Route path="config/:deviceId" element={<DeviceConfigPage />} />
      <Route path="blueprints" element={<DeviceBlueprints />} />
      <Route path="blueprints/new" element={<CreateBlueprintPage onCreateSuccess={handleBlueprintListRedirect} />} />
      <Route
        path="blueprints/:blueprintId/edit"
        element={<EditBlueprintPage onSuccess={handleBlueprintListRedirect} onCancel={handleBlueprintListRedirect} />}
      />
    </Routes>
  );
};

export default Root;
