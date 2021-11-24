import { getAuthToken } from '../../auth-helpers';

const CONDUCTOR_API_URL = window.__CONFIG__.conductor_api_url;

function getHeaders(): Record<string, string> {
  const authToken = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(authToken != null ? { Authorization: `Bearer ${authToken}` } : {}),
  };
}

export async function apiFetch(path: string, options: RequestInit): Promise<unknown> {
  const url = `${CONDUCTOR_API_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`apiFetch failed with http-code ${response.status}`);
  }

  if (response.status === 201) {
    return null;
  }

  return response.json();
}

export async function sendGetRequest(path: string, fetchOptions?: RequestInit): Promise<unknown> {
  const options = {
    method: 'GET',
    ...fetchOptions,
  };
  return apiFetch(path, options);
}

export async function sendPostRequest(path: string, body: unknown): Promise<unknown> {
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
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
    },
  };
  return apiFetch(path, options);
}
