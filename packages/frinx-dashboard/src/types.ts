export type ServiceKey = keyof Pick<
  typeof window.__CONFIG__,
  'uniconfig_enabled' | 'uniflow_enabled' | 'uniresource_enabled' | 'usermanagement_enabled' | 'inventory_enabled'
>;
