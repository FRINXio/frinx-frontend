import React, { createContext, FC, useRef } from 'react';
import { Provider, createClient } from 'urql';

export const InventoryAPIContext = createContext(false);

export type Props = {
  url: string;
};

export const InventoryAPIProvider: FC<Props> = ({ children, url }) => {
  const { current: clientRef } = useRef(
    createClient({
      url,
      fetchOptions: {
        headers: {
          'x-tenant-id': 'frinx',
        },
      },
    }),
  );
  return <Provider value={clientRef}>{children}</Provider>;
};
