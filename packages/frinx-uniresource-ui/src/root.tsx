import { createClient, Provider } from 'urql';
import React, { FC } from 'react';
import PageContainer from './components/PageContainer';

const client = createClient({
  url: 'http://10.19.0.7/api/uniresource/query',
});

const Root: FC = ({ children }) => {
  return (
    <Provider value={client}>
      <PageContainer>{children}</PageContainer>
    </Provider>
  );
};

export default Root;
