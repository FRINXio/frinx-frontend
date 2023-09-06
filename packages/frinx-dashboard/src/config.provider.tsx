import { unwrap } from '@frinx/shared';
import React, { createContext, FC, useContext, useMemo, useState } from 'react';
import { GlobalConfig } from './types';

export const ConfigContext = createContext<GlobalConfig | null>(null);

export function useConfigContext(): GlobalConfig {
  return unwrap(useContext(ConfigContext));
}

type Props = {
  config: GlobalConfig;
};

const ConfigProvider: FC<Props> = ({ config, children }) => {
  const [stateConfig] = useState(config);

  return <ConfigContext.Provider value={useMemo(() => stateConfig, [stateConfig])}>{children}</ConfigContext.Provider>;
};

export default ConfigProvider;
