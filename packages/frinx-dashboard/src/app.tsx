import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/dashboard/dashboard';
import Header from './components/header/header';
import GammaApp from './gamma-app';
import { ServiceKey } from './types';
import UniflowApp from './uniflow-app';

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
          {enabledServices.get('isGammaEnabled') && <Route path="/gamma/*" element={<GammaApp />} />}
          <Route path="/" element={<Dashboard enabledServices={enabledServices} />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

export default App;
