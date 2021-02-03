// @flow
import React, { createContext, useEffect, useState } from 'react';

type GlobalConstants = {
  backendApiUrlPrefix: string,
  enableScheduling: boolean,
  disabledTasks: string[],
  prefixHttpTask: string,
};

export const globalConstants: GlobalConstants = {
  backendApiUrlPrefix: '/uniflow/api/conductor',
  enableScheduling: true,
  disabledTasks: ['js', 'py', 'while', 'while_end'],
  prefixHttpTask: '',
};

export const GlobalContext = createContext<GlobalConstants>(globalConstants);

export const GlobalProvider = (props: GlobalConstants & { children: React$Node }) => {
  const { children, ...rest } = props;
  return <GlobalContext.Provider value={{ ...globalConstants, ...rest }}>{children}</GlobalContext.Provider>;
};
