// TODO dynamic source of url
const UNICONFIG_API_URL = window.__CONFIG__.uniconfig_api_url;
const AUTHORIZATION = 'Basic YWRtaW46YWRtaW4=';

export async function apiFetch(path: string, options: RequestInit): Promise<unknown> {
  const url = `${UNICONFIG_API_URL}${path}`;
  const response = await fetch(url, options);

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
    headers: {
      Authorization: AUTHORIZATION,
    },
  };
  return apiFetch(path, options);
}

export async function sendPostRequest(path: string, body: unknown): Promise<unknown> {
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: AUTHORIZATION,
      'Content-Type': 'application/json',
    },
  };
  return apiFetch(path, options);
}

export async function sendPutRequest(path: string, body: unknown): Promise<unknown> {
  const options = {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      Authorization: AUTHORIZATION,
      'Content-Type': 'application/json',
    },
  };
  return apiFetch(path, options);
}

export async function sendDeleteRequest(path: string, body?: unknown): Promise<unknown> {
  const options = {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: {
      Authorization: AUTHORIZATION,
    },
  };
  return apiFetch(path, options);
}
