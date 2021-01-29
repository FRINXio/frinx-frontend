// TODO dynamic source of url
const UNICONFIG_API_URL: string = 'localhost:8080/api';

export async function apiFetch(path: string, options: RequestInit): Promise<unknown> {
  const url = `${UNICONFIG_API_URL}${path}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`apiFetch failed with http-code ${response.status}`);
  }

  return response.json();
}

export async function sendGetRequest(path: string): Promise<unknown> {
  const options = {
    method: 'GET',
  };
  return apiFetch(path, options);
}

export async function sendPostRequest(path: string, body: any): Promise<unknown> {
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
  };
  return apiFetch(path, options);
}

export async function sendPutRequest(path: string, body: any): Promise<unknown> {
  const options = {
    method: 'PUT',
    body: JSON.stringify(body),
  };
  return apiFetch(path, options);
}

export async function sendDeleteRequest(path: string, body?: any): Promise<unknown> {
  const options = {
    method: 'DELETE',
    body: JSON.stringify(body),
  };
  return apiFetch(path, options);
}