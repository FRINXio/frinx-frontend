import { AuthContext, createApiHelpers } from './api-helpers';
import createUniconfigApiClient, { UniconfigApiClient } from './uniconfig';
import createUniflowClient, { UniflowApiClient } from './uniflow';
export type { UniflowApiClient } from './uniflow';
export type { UniconfigApiClient } from './uniconfig';

export type ApiConfig = {
  url: string;
  authContext: AuthContext;
};

export class UniconfigApi {
  client: UniconfigApiClient;

  private static instance: UniconfigApi;

  private constructor(config: ApiConfig) {
    const { authContext, url } = config;
    const apiHelpers = createApiHelpers(url, authContext);
    this.client = createUniconfigApiClient(apiHelpers);
  }

  public static create(config: ApiConfig): UniconfigApi {
    if (!UniconfigApi.instance) {
      this.instance = new UniconfigApi(config);
    }
    return this.instance;
  }
}

export class UniflowApi {
  client: UniflowApiClient;

  private static instance: UniflowApi;

  private constructor(config: ApiConfig) {
    const { authContext, url } = config;
    const apiHelpers = createApiHelpers(url, authContext);
    this.client = createUniflowClient(apiHelpers);
  }

  public static create(config: ApiConfig): UniflowApi {
    if (!UniflowApi.instance) {
      this.instance = new UniflowApi(config);
    }
    return this.instance;
  }
}
