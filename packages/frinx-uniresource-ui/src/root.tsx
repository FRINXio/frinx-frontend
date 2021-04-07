import { ChakraProvider } from '@chakra-ui/react';
import { createClient, Provider } from 'urql';
import React, { FC } from 'react';

const client = createClient({
  url: 'http://10.19.0.7/resourcemanager/graphql/query',
});

type Props = { children: React.ReactNode };

const Root: FC<Props> = ({ children }) => {
  return (
    <Provider value={client}>
      <ChakraProvider>{children}</ChakraProvider>
    </Provider>
  );
};

export default Root;
