import { createClient, Provider } from 'urql';
import React, { FC, useRef } from 'react';
import PageContainer from './components/page-container';

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
      <PageContainer>{children}</PageContainer>
    </Provider>
  );
};

export default Root;
