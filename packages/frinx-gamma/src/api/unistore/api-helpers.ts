const UNISTORE_API_URL = window.__CONFIG__.unistore_api_url;
const UNISTORE_AUTH = window.__CONFIG__.unistore_auth;

export async function apiFetch(path: string, options: RequestInit): Promise<unknown> {
  const url = `${UNISTORE_API_URL}${path}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`apiFetch failed with http-code ${response.status}`);
  }

  if (response.status === 201 || response.status === 204) {
    return null;
  }

  return response.json();
}

export async function sendGetRequest(path: string): Promise<unknown> {
  const options = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      authorization: UNISTORE_AUTH,
    },
  };
  return apiFetch(path, options);
}

export async function sendPostRequest(path: string, body: unknown): Promise<unknown> {
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      authorization: UNISTORE_AUTH,
    },
  };
  return apiFetch(path, options);
}

export async function sendPutRequest(path: string, body: unknown): Promise<unknown> {
  const options = {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      authorization: UNISTORE_AUTH,
    },
  };
  return apiFetch(path, options);
}

export async function sendDeleteRequest(path: string, body?: unknown): Promise<unknown> {
  const options = {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      authorization: UNISTORE_AUTH,
    },
  };
  return apiFetch(path, options);
}
