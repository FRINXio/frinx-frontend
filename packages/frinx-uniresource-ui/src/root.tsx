import { createClient, Provider } from 'urql';
import React, { FC, useRef } from 'react';
import PageContainer from './components/page-container';

type Props = {
  url: string;
  getAuthToken: () => string | null;
};

const Root: FC<Props> = ({ children, url, getAuthToken }) => {
  const { current: urqlClient } = useRef(
    (() => {
      const authToken = getAuthToken();
      return createClient({
        url,
        fetchOptions: {
          headers: {
            ...(authToken != null ? { authorization: `Bearer ${authToken}` } : {}),
          },
        },
      });
    })(),
  );

  return (
    <Provider value={urqlClient}>
      <PageContainer>{children}</PageContainer>
    </Provider>
  );
};

export default Root;
