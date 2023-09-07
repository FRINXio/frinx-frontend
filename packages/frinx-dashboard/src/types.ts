export type GlobalConfig = Readonly<{
  isAuthEnabled: boolean;
  authClientId: string;
  authRedirectURL: string;
  uniflowApiURL: string;
  uniconfigApiDocsURL: string;
  isResourceManagerEnabled: boolean;
  unistoreApiURL: string;
  isUniflowEnabled: boolean;
  isInventoryEnabled: boolean;
  isL3VPNEnabled: boolean;
  isDeviceTopologyEnabled: boolean;
  URLBasename: string;
  inventoryApiURL: string;
  inventoryWsURL: string;
  uniresourceApiURL: string;
  uniflowApiDocsURL: string;
  MSALAuthority: string;
  commitHash: string;
}>;

export type ServiceKey = keyof Pick<
  GlobalConfig,
  'isUniflowEnabled' | 'isResourceManagerEnabled' | 'isInventoryEnabled' | 'isL3VPNEnabled' | 'isDeviceTopologyEnabled'
>;
