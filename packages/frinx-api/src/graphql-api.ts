import { ApiConfig, GraphQLApiClient } from './types';

export default class GraphQLApi {
  client: GraphQLApiClient;

  private static instance: GraphQLApi;

  private constructor(config: ApiConfig) {
    const { authContext, url } = config;
    this.client = {
      clientOptions: {
        url,
        fetchOptions: () => {
          const authToken = authContext.getAuthToken();
          return {
            headers: {
              ...(authToken != null ? { Authorization: `Bearer ${authToken}` } : {}),
            },
          };
        },
      },
      onError: () => {
        config.authContext.emitUnauthorized();
      },
    };
  }

  public static create(config: ApiConfig): GraphQLApi {
    if (!GraphQLApi.instance) {
      this.instance = new GraphQLApi(config);
    }
    return this.instance;
  }
}
