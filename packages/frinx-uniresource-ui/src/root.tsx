import { createClient, Provider } from 'urql';
import React, { FC, useRef } from 'react';
import PageContainer from './components/page-container';
import { CustomToastProvider } from './notifications-context';

type Props = {
  url: string;
};

const Root: FC<Props> = ({ children, url }) => {
  const { current: urqlClient } = useRef(
    createClient({
      url,
    }),
  );
  return (
    <Provider value={urqlClient}>
      <CustomToastProvider>
        <PageContainer>{children}</PageContainer>
      </CustomToastProvider>
    </Provider>
  );
};

export default Root;
