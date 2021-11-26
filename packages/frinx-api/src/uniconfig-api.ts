import { createApiHelpers } from './api-helpers';
import { ApiConfig } from './types';
import createUniconfigApiClient, { UniconfigApiClient } from './uniconfig';

export default class UniconfigApi {
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
