import { URL } from 'url';

function envString(key: string): string {
  const { env } = process;
  const value = env[key];
  if (typeof value !== 'string') {
    throw new Error(`Mandatory env variable "${key}" not found`);
  }

  return value;
}

function stringToBoolean(value: string): boolean {
  switch (value.toLowerCase()) {
    case 'true':
    case 'yes':
    case '1':
      return true;
    case 'false':
    case 'no':
    case '0':
    case '':
    default:
      return false;
  }
}

function ensureSchema(schema: string): 'http' | 'https' {
  if (schema !== 'http' && schema !== 'https') {
    throw new Error(`Invalid "AUTH_REDIRECT_SCHEME" env value: ${schema}`);
  }
  return schema;
}

function buildAuthRedirectURL(schema: 'http' | 'https', base: string): string {
  try {
    const url = new URL(`${schema}://${base}`);
    return url.href;
  } catch (e) {
    throw new Error(`Invalid "AUTH_REDIRECT_DOMAIN" env value: ${base}`);
  }
}

/* eslint-disable @typescript-eslint/naming-convention */
const config = {
  isAuthEnabled: stringToBoolean(envString('AUTH_ENABLED')),
  authClientId: envString('AUTH_CLIENT_ID'),
  authRedirectURL: stringToBoolean(envString('AUTH_ENABLED'))
    ? buildAuthRedirectURL(ensureSchema(envString('AUTH_REDIRECT_SCHEME')), envString('AUTH_REDIRECT_DOMAIN'))
    : null,
  uniflowApiURL: envString('CONDUCTOR_API_URL'),
  isUniresourceEnabled: stringToBoolean(envString('UNIRESOURCE_ENABLED')),
  isUniflowEnabled: stringToBoolean(envString('UNIFLOW_ENABLED')),
  URLBasename: envString('URL_BASENAME'),
  inventoryApiURL: envString('INVENTORY_API_URL'),
  unistoreApiURL: envString('UNISTORE_API_URL'),
  uniresourceApiURL: envString('UNIRESOURCE_API_URL'),
  isInventoryEnabled: stringToBoolean(envString('INVENTORY_ENABLED')),
  uniconfigApiDocsURL: envString('UNICONFIG_API_DOCS_URL'),
  uniflowApiDocsURL: envString('UNIFLOW_API_DOCS_URL'),
  MSALAuthority: envString('MSAL_AUTHORITY'),
  isGammaEnabled: stringToBoolean(envString('GAMMA_ENABLED')),
  commitHash: envString('COMMIT_HASH'),
};
/* eslint-enable */

export default config;
