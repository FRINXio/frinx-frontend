export interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

export async function http<T>(request: RequestInfo): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(request);
  response.parsedBody = await response.json();
  return response;
}

export async function get<T>(path: string, args: RequestInit = { method: 'get' }): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}

export async function post<T>(
  path: string,
  body: any,
  args: RequestInit = { method: 'post', body: JSON.stringify(body) },
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}

export async function put<T>(
  path: string,
  body: any,
  args: RequestInit = { method: 'put', body: JSON.stringify(body) },
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}

// delete is reserved keyword
export async function del<T>(path: string, args: RequestInit = { method: 'delete' }): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}
