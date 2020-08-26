import React, {createContext, useState, useEffect} from 'react'

export const GlobalContext = createContext();

export const globalConstants = {
  backendApiUrlPrefix: "/uniconfig/api/uniconfig",
  frontendUrlPrefix: "/uniconfig/ui",
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