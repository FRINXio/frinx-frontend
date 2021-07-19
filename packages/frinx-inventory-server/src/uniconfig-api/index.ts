import fetch, { RequestInit } from 'node-fetch';
import join from 'url-join';
import { JSONValue } from '../api/api.helpers';
import APIError from '../errors/api-error';
import { HttpStatusCode } from '../errors/base-error';
import { decodeInstalledDevicesOutput, InstalledDevicesOutput, UninstallDeviceInput } from './network-types';

// TODO: move to .env
const UNICONFIG_API = 'http://10.19.0.7/api/uniconfig';

async function apiFetch(path: string, options: RequestInit): Promise<unknown> {
  const url = join(UNICONFIG_API, path);
  const response = await fetch(url, options);

  if (!response.ok) {
    // throw new Error(`apiFetch failed with http-code ${response.status}`);
    throw new APIError(response.status.toString(), HttpStatusCode.INTERNAL_SERVER, true, JSON.stringify(response));
  }

  if (response.status === 201 || response.status === 204) {
    return response;
  }

  return response.json();
}
async function sendPostRequest(path: string, body?: unknown): Promise<unknown> {
  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Basic YWRtaW46YWRtaW4=',
    },
  };
  return apiFetch(path, options);
}

export async function getInstalledDevices(): Promise<InstalledDevicesOutput> {
  const json = await sendPostRequest('/operations/connection-manager:get-installed-nodes/');
  const data = decodeInstalledDevicesOutput(json);

  return data;
}

export async function installDevice(params: JSONValue): Promise<void> {
  await sendPostRequest('/operations/connection-manager:install-node', params);
}

export async function uninstallDevice(params: UninstallDeviceInput): Promise<void> {
  await sendPostRequest('/operations/connection-manager:uninstall-node', params);
}
