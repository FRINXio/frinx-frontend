import { ChakraProvider } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import App from './app';
import theme from './theme';
import '@fontsource/roboto';
import { useConfig } from './config.provider';

const Root: VoidFunctionComponent = () => {
  const { URLBasename, isAuthEnabled } = useConfig();

  return (
    <ChakraProvider theme={theme}>
      <App isAuthEnabled={isAuthEnabled} basename={URLBasename ?? '/'} />
    </ChakraProvider>
  );
};

export default Root;
