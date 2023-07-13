import { createApiHelpers } from './api-helpers';
import { ApiConfig } from './types';
import createUniflowApiClient, { UniflowApiClient } from './uniflow';

export default class UniflowApi {
  client: UniflowApiClient;

  private static instance: UniflowApi;

  private constructor(config: ApiConfig) {
    const { authContext, url, refreshToken } = config;
    const apiHelpers = createApiHelpers(url, authContext, refreshToken);
    this.client = createUniflowApiClient(apiHelpers);
  }

  public static create(config: ApiConfig): UniflowApi {
    if (!UniflowApi.instance) {
      this.instance = new UniflowApi(config);
    }
    return this.instance;
  }
}
