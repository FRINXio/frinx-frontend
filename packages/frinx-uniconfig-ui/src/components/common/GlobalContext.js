import React, { createContext } from 'react';

type GlobalConstants = {
  backendApiUrlPrefix: string,
  frontendUrlPrefix: string,
  authToken: string,
};

const AUTH_TOKEN = 'Basic YWRtaW46YWRtaW4=';

export const globalConstants: GlobalConstants = {
  backendApiUrlPrefix: '/uniconfig/api',
  frontendUrlPrefix: '/uniconfig',
  authToken: AUTH_TOKEN,
};

export const GlobalContext = createContext<GlobalConstants>(globalConstants);

export const GlobalProvider = (props: GlobalConstants & { children: React$Node }) => {
  const { children, ...rest } = props;
  return <GlobalContext.Provider value={{ ...globalConstants, ...rest }}>{children}</GlobalContext.Provider>;
};
