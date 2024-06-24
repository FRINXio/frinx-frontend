export type GlobalConfig = Readonly<{
  isAuthEnabled: boolean;
  uniflowApiURL: string;
  uniconfigApiDocsURL: string;
  unistoreApiURL: string;
  URLBasename: string;
  inventoryApiURL: string;
  inventoryWsPath: string;
  devInventoryWsURL: string;
  inventoryWsSchema: string;
  uniflowApiDocsURL: string;
  commitHash: string;
  isPerformanceMonitoringEnabled: boolean;
}>;
