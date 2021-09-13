import { Box, ChakraProvider } from '@chakra-ui/react';
import React, { FC } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './components/main/main';
import theme from './theme';

function getURLBaseName(): string {
  return window.__CONFIG__.url_basename ?? '/';
}

const App: FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter basename={getURLBaseName()}>
        <Box paddingTop={10}>
          <Switch>
            <Route path="/" exact>
              <Main />
            </Route>
          </Switch>
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
