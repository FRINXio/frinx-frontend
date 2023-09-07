import { unwrap } from '@frinx/shared';
import React, { createContext, FC, useContext, useRef } from 'react';
import { GlobalConfig } from './types';

export const ConfigContext = createContext<GlobalConfig | null>(null);

export function useConfigContext(): GlobalConfig {
  return unwrap(useContext(ConfigContext));
}

type Props = {
  config: GlobalConfig;
};

const ConfigProvider: FC<Props> = ({ config, children }) => {
  const { current } = useRef<GlobalConfig>(config);

  return <ConfigContext.Provider value={current}>{children}</ConfigContext.Provider>;
};

export default ConfigProvider;
