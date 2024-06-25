export type GlobalConfig = Readonly<{
  isAuthEnabled: boolean;
  uniflowApiURL: string;
  unistoreApiURL: string;
  URLBasename: string;
  inventoryApiURL: string;
  inventoryWsPath: string;
  inventoryWsSchema: string;
  devInventoryWsURL: string | null;
  uniconfigApiDocsURL: string | null;
  uniflowApiDocsURL: string | null;
  resourceManagerApiDocsURL: string | null;
  performanceMonitorApiDocsURL: string | null;
  topologyDiscoveryApiDocsURL: string | null;
  schellarApiDocsURL: string | null;
  commitHash: string;
  isPerformanceMonitoringEnabled: boolean;
}>;
