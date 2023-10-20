export type GlobalConfig = Readonly<{
  isAuthEnabled: boolean;
  authClientId: string;
  authRedirectURL: string;
  uniflowApiURL: string;
  uniconfigApiDocsURL: string;
  unistoreApiURL: string;
  URLBasename: string;
  inventoryApiURL: string;
  inventoryWsURL: string;
  uniresourceApiURL: string;
  uniflowApiDocsURL: string;
  MSALAuthority: string;
  commitHash: string;
}>;
