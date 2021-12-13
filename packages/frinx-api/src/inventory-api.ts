import { ApiConfig } from '.';
import { createGraphQLApiClient } from './api-helpers';
import { GraphQLApiClient } from './types';

export default class InventoryApi {
  client: GraphQLApiClient;

  private static instance: InventoryApi;

  constructor(config: ApiConfig) {
    this.client = createGraphQLApiClient(config);
  }

  public static create(config: ApiConfig): InventoryApi {
    if (!InventoryApi.instance) {
      this.instance = new InventoryApi(config);
    }
    return this.instance;
  }
}
