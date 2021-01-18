import React, {createContext, useState, useEffect} from 'react'

export const GlobalContext = createContext();

const AUTH_TOKEN = "Basic YWRtaW46YWRtaW4=";

export const globalConstants = {
  backendApiUrlPrefix: "/uniconfig/api",
  frontendUrlPrefix: "/uniconfig/ui",
  authToken: AUTH_TOKEN
};

export const GlobalProvider = (props) => {
  const [global, setGlobal] = useState(globalConstants);

  useEffect(() => {
    setGlobal({...global, ...props})
  }, [props])

  return (
    <GlobalContext.Provider
      value={global}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};