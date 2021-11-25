import urlJoin from 'url-join';

function getHeaders(authToken: string | null): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...(authToken != null ? { Authorization: `Bearer ${authToken}` } : {}),
  };
}

export type ApiHelpers = {
  sendGetRequest: (path: string, requestOptions?: RequestInit) => Promise<unknown>;
  sendPostRequest: (path: string, body?: unknown) => Promise<unknown>;
  sendPutRequest: (path: string, body?: unknown) => Promise<unknown>;
  sendDeleteRequest: (path: string, body?: unknown) => Promise<unknown>;
};

export type AuthContext = {
  getAuthToken: () => string | null;
  emitUnauthorized: () => void;
};

export function createApiHelpers(baseURL: string, authContext: AuthContext): ApiHelpers {
  async function apiFetch(path: string, options: RequestInit): Promise<unknown> {
    const url = urlJoin(baseURL, path);
    const response = await fetch(url, {
      ...options,
      headers: getHeaders(authContext.getAuthToken()),
    });

    if (response.status === 401) {
      return authContext.emitUnauthorized();
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
        ...requestOptions,
        method: 'GET',
      };
      return apiFetch(path, options);
    },
    sendPostRequest: async (path: string, body: unknown): Promise<unknown> => {
      const options = {
        method: 'POST',
        body: JSON.stringify(body),
      };
      return apiFetch(path, options);
    },
    sendPutRequest: async (path: string, body: unknown): Promise<unknown> => {
      const options = {
        method: 'PUT',
        body: JSON.stringify(body),
      };
      return apiFetch(path, options);
    },
    sendDeleteRequest: async (path: string, body?: unknown): Promise<unknown> => {
      const options = {
        method: 'DELETE',
        body: JSON.stringify(body),
      };
      return apiFetch(path, options);
    },
  };
}
