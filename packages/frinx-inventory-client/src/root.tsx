import { ChakraProvider, Container } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import DeviceList from './pages/device-list/device-list';

const Root: VoidFunctionComponent = () => {
  return (
    <ChakraProvider>
      <Container maxWidth={1200} marginTop={20}>
        <DeviceList />
      </Container>
    </ChakraProvider>
  );
};

export default Root;
