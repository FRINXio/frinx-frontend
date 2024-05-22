import React, { createContext, FC, useContext, useMemo } from 'react';

export const PerformanceMonitoringContext = createContext({ isEnabled: false });

const usePerformanceMonitoring = () => {
  return useContext(PerformanceMonitoringContext);
};

type PerformanceMonitoringProviderProps = { isEnabled: boolean };
const PerformanceMonitoringProvider: FC<PerformanceMonitoringProviderProps> = ({ children, isEnabled }) => {
  const value = useMemo(() => ({ isEnabled }), [isEnabled]);

  return <PerformanceMonitoringContext.Provider value={value}>{children}</PerformanceMonitoringContext.Provider>;
};

export { usePerformanceMonitoring };
export default PerformanceMonitoringProvider;
