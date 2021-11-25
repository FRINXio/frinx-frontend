function getHeaders(authToken: string | null): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...(authToken != null ? { Authorization: `Bearer ${authToken}` } : {}),
  };
}

export type AuthContext = {
  getAuthToken: () => string | null;
  emitUnauthorized: () => void;
};

export function createAPIFetch(
  baseURL: string,
  authContext: AuthContext,
): (path: string, options: RequestInit) => Promise<unknown> {
  return async function apiFetch(path: string, options: RequestInit): Promise<unknown> {
    const url = `${baseURL}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: getHeaders(authContext.getAuthToken()),
    });

    if (!response.ok) {
      throw new Error(`apiFetch failed with http-code ${response.status}`);
    }

    if (response.status === 201 || response.status === 204) {
      return response;
    }

    return response.json();
  };
}

// export async function apiFetch(path: string, options: RequestInit): Promise<unknown> {
//   const url = `${UNICONFIG_API_URL}${path}`;
//   const response = await fetch(url, {
//     ...options,
//     headers: getHeaders(),
//   });

//   if (!response.ok) {
//     throw new Error(`apiFetch failed with http-code ${response.status}`);
//   }

//   if (response.status === 201 || response.status === 204) {
//     return response;
//   }

//   return response.json();
// }

export async function sendGetRequest(path: string): Promise<unknown> {
  const options = {
    method: 'GET',
  };
  return apiFetch(path, options);
}

export async function sendPostRequest(path: string, body: unknown): Promise<unknown> {
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
  };
  return apiFetch(path, options);
}

export async function sendPutRequest(path: string, body: unknown): Promise<unknown> {
  const options = {
    method: 'PUT',
    body: JSON.stringify(body),
  };
  return apiFetch(path, options);
}

export async function sendDeleteRequest(path: string, body?: unknown): Promise<unknown> {
  const options = {
    method: 'DELETE',
    body: JSON.stringify(body),
  };
  return apiFetch(path, options);
}
