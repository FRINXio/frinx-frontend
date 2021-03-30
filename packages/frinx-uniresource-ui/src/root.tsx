import { ChakraProvider, Heading } from '@chakra-ui/react';
import React, { FC } from 'react';

const Root: FC = () => {
  return (
    <ChakraProvider>
      <Heading as="h1" size="xl">
        Hello world
      </Heading>
    </ChakraProvider>
  );
};

export default Root;
