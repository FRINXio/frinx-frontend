export type GlobalConfig = Readonly<{
  isAuthEnabled: boolean;
  uniflowApiURL: string;
  uniconfigApiDocsURL: string;
  unistoreApiURL: string;
  URLBasename: string;
  inventoryApiURL: string;
  devInventoryWsURL: string;
  inventoryWsSchema:string;
  uniresourceApiURL: string;
  uniflowApiDocsURL: string;
  commitHash: string;
}>;
