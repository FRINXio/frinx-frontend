import { ApiConfig } from '.';
import { createGraphQLApiClient } from './api-helpers';
import { GraphQLApiClient } from './types';

export default class UniresourceApi {
  client: GraphQLApiClient;

  private static instance: UniresourceApi;

  constructor(config: ApiConfig) {
    this.client = createGraphQLApiClient(config);
  }

  public static create(config: ApiConfig): UniresourceApi {
    if (!UniresourceApi.instance) {
      this.instance = new UniresourceApi(config);
    }
    return this.instance;
  }
}
