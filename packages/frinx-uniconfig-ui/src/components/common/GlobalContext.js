import React, {createContext } from 'react'

const AUTH_TOKEN = "Basic YWRtaW46YWRtaW4=";

export const globalConstants = {
  backendApiUrlPrefix: "/uniconfig/api",
  frontendUrlPrefix: "/uniconfig/ui",
  authToken: AUTH_TOKEN
};

export const GlobalContext = createContext(globalConstants);

export const GlobalProvider = (props) => {
  const { children, ...rest } = props;
  return <GlobalContext.Provider value={{ ...globalConstants, ...rest }}>{children}</GlobalContext.Provider>;

};