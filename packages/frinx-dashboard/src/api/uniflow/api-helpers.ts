import { getTransactionId } from '../../helpers/transaction-id';

const CONDUCTOR_API_URL = window.__CONFIG__.conductor_api_url;

function getRequestHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  const transactionId = getTransactionId();
  if (transactionId) {
    headers.transaction_id = transactionId;
  }

  return headers;
}

export async function apiFetch(path: string, options: RequestInit): Promise<unknown> {
  const url = `${CONDUCTOR_API_URL}${path}`;
  const optionsWithHeaders = {
    ...options,
    headers: {
      ...options.headers,
      ...getRequestHeaders(),
    },
  };
  const response = await fetch(url, options);

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
