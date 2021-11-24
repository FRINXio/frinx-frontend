import { getAuthToken } from '../../auth-helpers';

const UNICONFIG_API_URL = window.__CONFIG__.uniconfig_api_url;
// const AUTHORIZATION = window.__CONFIG__.uniconfig_auth; // encoded admin/admin credentials (default)

function getHeaders(): Record<string, string> {
  const authToken = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(authToken != null ? { Authorization: `Bearer ${authToken}` } : {}),
  };
}

export async function apiFetch(path: string, options: RequestInit): Promise<unknown> {
  const url = `${UNICONFIG_API_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`apiFetch failed with http-code ${response.status}`);
  }

  if (response.status === 201 || response.status === 204) {
    return response;
  }

  return response.json();
}

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
