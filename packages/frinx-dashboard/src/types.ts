export type ServiceKey = keyof Pick<
  typeof window.__CONFIG__,
  'isUniflowEnabled' | 'isUniresourceEnabled' | 'isInventoryEnabled' | 'isGammaEnabled'
>;
