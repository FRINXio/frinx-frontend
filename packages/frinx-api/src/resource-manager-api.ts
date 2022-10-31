import { ApiConfig } from '.';
import { createGraphQLApiClient } from './api-helpers';
import { GraphQLApiClient } from './types';

export default class ResourceManagerApi {
  client: GraphQLApiClient;

  private static instance: ResourceManagerApi;

  constructor(config: ApiConfig) {
    this.client = createGraphQLApiClient(config);
  }

  public static create(config: ApiConfig): ResourceManagerApi {
    if (!ResourceManagerApi.instance) {
      this.instance = new ResourceManagerApi(config);
    }
    return this.instance;
  }
}
