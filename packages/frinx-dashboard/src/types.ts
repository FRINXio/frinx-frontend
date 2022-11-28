export type ServiceKey = keyof Pick<
  typeof window.__CONFIG__,
  'isUniflowEnabled' | 'isResourceManagerEnabled' | 'isInventoryEnabled' | 'isL3VPNEnabled' | 'isDeviceTopologyEnabled'
>;
