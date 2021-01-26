// TODO dynamic source of url
const CONDUCTOR_API_URL: string = 'localhost:8080/api';

export async function apiFetch(path: string, options: RequestInit): Promise<unknown> {
  const url = `${CONDUCTOR_API_URL}/${path}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`apiFetch failed with http-code ${response.status}`);
  }

  return response.json();
}

export async function sendGetRequest(path: string, options: RequestInit = { method: 'get' }): Promise<unknown> {
  return apiFetch(path, options);
}

export async function sendPostRequest(
  path: string,
  body: any,
  options: RequestInit = { method: 'post', body: JSON.stringify(body) },
): Promise<unknown> {
  return apiFetch(path, options);
}

export async function sendPutRequest(
  path: string,
  body: any,
  options: RequestInit = { method: 'put', body: JSON.stringify(body) },
): Promise<unknown> {
  return apiFetch(path, options);
}

export async function sendDeleteRequest(
  path: string,
  body?: any,
  options: RequestInit = { method: 'delete', body: JSON.stringify(body) },
): Promise<unknown> {
  return apiFetch(path, options);
}
