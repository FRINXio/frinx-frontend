import { getTransactionId } from '../../helpers/transaction-id';

const UNISTORE_API_URL = window.__CONFIG__.unistore_api_url;
const UNISTORE_AUTH = window.__CONFIG__.uniconfig_auth;

function getRequestHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: UNISTORE_AUTH,
  };
  const transactionId = getTransactionId();
  if (transactionId) {
    headers['x-transaction-id'] = transactionId;
  }

  return headers;
}

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
    headers: getRequestHeaders(),
  };
  return apiFetch(path, options);
}

export async function sendPostRequest(path: string, body: unknown): Promise<unknown> {
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: getRequestHeaders(),
  };
  return apiFetch(path, options);
}

export async function sendPutRequest(path: string, body: unknown): Promise<unknown> {
  const options = {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: getRequestHeaders(),
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
