import { createClient, Provider } from 'urql';
import React, { FC } from 'react';
import PageContainer from './components/page-container';

const client = createClient({
  url: 'http://localhost:4000/api/uniresource/query',
});

const Root: FC = ({ children }) => {
  return (
    <Provider value={client}>
      <PageContainer>{children}</PageContainer>
    </Provider>
  );
};

export default Root;
