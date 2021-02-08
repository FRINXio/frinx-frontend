// @flow
import React, { createContext, useEffect, useState } from 'react';

type GlobalConstants = {
  disabledTasks: string[],
};

export const globalConstants: GlobalConstants = {
  disabledTasks: ['js', 'py', 'while', 'while_end'],
};

export const GlobalContext = createContext<GlobalConstants>(globalConstants);

export const GlobalProvider = (props: GlobalConstants & { children: React$Node }) => {
  const { children, ...rest } = props;
  return <GlobalContext.Provider value={{ ...globalConstants, ...rest }}>{children}</GlobalContext.Provider>;
};
