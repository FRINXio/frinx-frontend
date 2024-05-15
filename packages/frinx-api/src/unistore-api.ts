import { createApiHelpers } from './api-helpers';
import { ApiConfig } from './types';
import createUnistoreApiClient, { UnistoreApiClient } from './unistore';

export default class UnistoreApi {
  client: UnistoreApiClient;

  private static instance: UnistoreApi;

  private constructor(config: ApiConfig, unistoreAuthToken: string) {
    const { authContext, url } = config;
    const apiHelpers = createApiHelpers(url, authContext);
    this.client = createUnistoreApiClient(apiHelpers, unistoreAuthToken);
  }

  public static create(config: ApiConfig, unistoreAuthToken: string): UnistoreApi {
    if (!UnistoreApi.instance) {
      this.instance = new UnistoreApi(config, unistoreAuthToken);
    }
    return this.instance;
  }
}
