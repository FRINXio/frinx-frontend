import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard/dashboard';
import Header from './components/header/header';
import InventoryApp from './inventory-app';
import { ServiceKey } from './types';
import UniflowApp from './uniflow-app';
import UniresourceApp from './uniresource-app';

type Props = {
  enabledServices: Map<ServiceKey, boolean>;
  basename: string;
  isAuthEnabled: boolean;
};

const App: FC<Props> = ({ enabledServices, basename, isAuthEnabled }) => {
  return (
    <BrowserRouter basename={basename}>
      <Header isAuthEnabled={isAuthEnabled} enabledServices={enabledServices} />
      <Box paddingTop={10} overflow="hidden">
        <Routes>
          {enabledServices.get('isUniflowEnabled') && <Route path="/uniflow/*" element={<UniflowApp />} />}
          {enabledServices.get('isInventoryEnabled') && <Route path="/inventory/*" element={<InventoryApp />} />}
          {enabledServices.get('isUniresourceEnabled') && <Route path="/uniresource/*" element={<UniresourceApp />} />}
          <Route path="/" element={<Dashboard enabledServices={enabledServices} />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

export default App;
