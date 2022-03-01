import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
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
        <Switch>
          <Route path="/" exact>
            <Dashboard enabledServices={enabledServices} />
          </Route>
          {enabledServices.get('isUniflowEnabled') && (
            <Route path="/uniflow">
              <UniflowApp />
            </Route>
          )}
          {enabledServices.get('isInventoryEnabled') && (
            <Route path="/inventory">
              <InventoryApp />
            </Route>
          )}
          {enabledServices.get('isUniresourceEnabled') && (
            <Route path="/uniresource">
              <UniresourceApp />
            </Route>
          )}
        </Switch>
      </Box>
    </BrowserRouter>
  );
};

export default App;
