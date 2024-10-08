import React, { Suspense, VoidFunctionComponent } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import SkeletonScreen from './components/skeleton-screen';
import CreateBlueprintPage from './pages/create-blueprint/create-blueprint-page';
import CreateDevicePage from './pages/create-device/create-device-page';
import CreateStreamPage from './pages/create-stream/create-stream-page';
import DeviceBlueprints from './pages/device-blueprints/device-blueprints';
import DeviceConfigPage from './pages/device-config/device-config-page';
import DeviceList from './pages/device-list/device-list';
import EditBlueprintPage from './pages/edit-blueprint/edit-blueprint-page';
import EditDevicePage from './pages/edit-device/edit-device-page';
import EditStreamPage from './pages/edit-stream/edit-stream-page';
import StreamList from './pages/stream-list/stream-list';
import TransactionList from './pages/transaction-list/transaction-list';
import UniconfigShellPage from './pages/uniconfig-shell/uniconfig-shell-page';
import LocationList from './pages/location-list/location-list';

const Root: VoidFunctionComponent = () => {
  const navigate = useNavigate();

  const handleDeviceListRedirect = () => {
    navigate('devices');
  };
  const handleBlueprintListRedirect = () => {
    navigate('blueprints');
  };
  const handleStreamListRedirect = () => {
    navigate('streams');
  };
  return (
    <Suspense fallback={<SkeletonScreen />}>
      <Routes>
        <Route index element={<Navigate replace to="devices" />} />
        <Route path="devices" element={<DeviceList />} />
        <Route path="new" element={<CreateDevicePage onAddDeviceSuccess={handleDeviceListRedirect} />} />
        <Route
          path=":deviceId/edit"
          element={
            <EditDevicePage onSuccess={handleDeviceListRedirect} onCancelButtonClick={handleDeviceListRedirect} />
          }
        />
        <Route path="config/:deviceId" element={<DeviceConfigPage />} />
        <Route path="blueprints" element={<DeviceBlueprints />} />
        <Route path="blueprints/new" element={<CreateBlueprintPage onCreateSuccess={handleBlueprintListRedirect} />} />
        <Route
          path="blueprints/:blueprintId/edit"
          element={<EditBlueprintPage onSuccess={handleBlueprintListRedirect} onCancel={handleBlueprintListRedirect} />}
        />
        <Route path="streams" element={<StreamList />} />
        <Route path="streams/new" element={<CreateStreamPage onAddStreamSuccess={handleStreamListRedirect} />} />
        <Route
          path="streams/:streamId/edit"
          element={
            <EditStreamPage onSuccess={handleStreamListRedirect} onCancelButtonClick={handleStreamListRedirect} />
          }
        />

        <Route path="transactions" element={<TransactionList />} />
        <Route path="locations" element={<LocationList />} />
        <Route path="shell" element={<UniconfigShellPage />} />
      </Routes>
    </Suspense>
  );
};

export default Root;
