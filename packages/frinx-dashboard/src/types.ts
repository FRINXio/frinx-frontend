export type GlobalConfig = Readonly<{
  isAuthEnabled: boolean;
  uniflowApiURL: string;
  uniconfigApiDocsURL: string;
  unistoreApiURL: string;
  URLBasename: string;
  inventoryWsURL: string;
  gatewayApiUrl: string;
  uniflowApiDocsURL: string;
  commitHash: string;
}>;
