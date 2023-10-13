import { ClientOptions } from 'urql';

export type ApiConfig = {
  url: string;
};

export type GraphQLApiClient = {
  clientOptions: Omit<ClientOptions, 'exchanges'>;
};
