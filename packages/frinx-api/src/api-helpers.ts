/* eslint-disable @typescript-eslint/naming-convention */
import urlJoin from 'url-join';
import { ApiConfig } from '.';
import { GraphQLApiClient } from './types';

export type ApiHelpers = {
  sendGetRequest: (path: string, requestOptions?: RequestInit) => Promise<unknown>;
  sendPostRequest: (path: string, body?: unknown, options?: RequestInit) => Promise<unknown>;
  sendPutRequest: (path: string, body?: unknown, options?: RequestInit) => Promise<unknown>;
  sendDeleteRequest: (path: string, body?: unknown, options?: RequestInit) => Promise<unknown>;
};

export type ErrorType = 'UNAUTHORIZED' | 'FORBIDDEN' | 'ACCESS_REJECTED';
export type AuthContext = {
  emit: (errorType: ErrorType) => void;
};

export function createApiHelpers(baseURL: string, authContext: AuthContext): ApiHelpers {
  async function apiFetch(path: string, options: RequestInit): Promise<unknown> {
    const url = urlJoin(baseURL, path);
    const { headers, ...rest } = options;
    const response = await fetch(url, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    // https://frinxhelpdesk.atlassian.net/browse/FD-460
    // error code 422 introduced to properly deal with expired/nonvalid transactions
    if (response.status === 403 || response.status === 422) {
      return authContext.emit('FORBIDDEN');
    }

    if (response.status === 427) {
      return authContext.emit('ACCESS_REJECTED');
    }

    if (!response.ok) {
      throw new Error(`apiFetch failed with http-code ${response.status}`);
    }

    if (response.status === 201 || response.status === 204) {
      return response;
    }

    return response.json();
  }

  return {
    sendGetRequest: async (path: string, requestOptions?: RequestInit): Promise<unknown> => {
      const options = {
        method: 'GET',
        ...requestOptions,
      };
      return apiFetch(path, options);
    },
    sendPostRequest: async (path: string, body: unknown, requestOptions?: RequestInit): Promise<unknown> => {
      const options = {
        method: 'POST',
        body: JSON.stringify(body),
        ...requestOptions,
      };
      return apiFetch(path, options);
    },
    sendPutRequest: async (path: string, body: unknown, requestOptions?: RequestInit): Promise<unknown> => {
      const options = {
        method: 'PUT',
        body: JSON.stringify(body),
        ...requestOptions,
      };
      return apiFetch(path, options);
    },
    sendDeleteRequest: async (path: string, body?: unknown, requestOptions?: RequestInit): Promise<unknown> => {
      const options = {
        method: 'DELETE',
        body: JSON.stringify(body),
        ...requestOptions,
      };
      return apiFetch(path, options);
    },
  };
}

export function createGraphQLApiClient(config: ApiConfig): GraphQLApiClient {
  const { url, authContext } = config;
  return {
    clientOptions: {
      url,
    },
    authContext,
  };
}

export function encodeUriValue(value: string): string {
  return `%22${value}%22`;
}
