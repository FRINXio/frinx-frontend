import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard/dashboard';
import FeedbackWidget from './components/feedback-widget/feedback-widget';
import Header from './components/header/header';
import DeviceTopologyApp from './device-topology-app';
import InventoryApp from './inventory-app';
import ResourceManagerApp from './resource-manager-app';
import UniflowApp from './uniflow-app';

type Props = {
  basename: string;
  isAuthEnabled: boolean;
};

const App: FC<Props> = ({ basename, isAuthEnabled }) => {
  return (
    <BrowserRouter basename={basename}>
      <Header isAuthEnabled={isAuthEnabled} />
      <Box paddingY={10} overflow="hidden">
        <Routes>
          <Route path="/workflow-manager/*" element={<UniflowApp />} />
          <Route path="/inventory/*" element={<InventoryApp />} />
          <Route path="/resource-manager/*" element={<ResourceManagerApp />} />
          <Route path="/device-topology/*" element={<DeviceTopologyApp />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Box>
      <Box position="fixed" bottom={20} right={16}>
        <FeedbackWidget />
      </Box>
    </BrowserRouter>
  );
};

export default App;
