function envString(key: string): string {
  const { env } = process;
  const value = env[key];
  if (typeof value !== 'string') {
    throw new Error(`Mandatory env variable "${key}" not found`);
  }

  return value;
}

const config = {
  auth_enabled: Boolean(envString('AUTH_ENABLED')),
  auth_client_id: envString('AUTH_CLIENT_ID'),
  auth_redirect_url: envString('AUTH_REDIRECT_URL'),
  conductor_api_url: envString('CONDUCTOR_API_URL'),
  uniconfig_api_url: envString('UNICONFIG_API_URL'),
  uniconfig_auth: envString('UNICONFIG_AUTH'),
  uniresource_enabled: Boolean(envString('UNIRESOURCE_ENABLED')),
  uniconfig_enabled: Boolean(envString('UNICONFIG_ENABLED')),
  uniflow_enabled: Boolean(envString('UNIFLOW_ENABLED')),
  usermanagement_enabled: Boolean(envString('USERMANAGEMENT_ENABLED')),
  url_basename: envString('URL_BASENAME'),
  inventory_api_url: envString('INVENTORY_API_URL'),
  uniresource_api_url: envString('UNIRESOURCE_API_URL'),
  inventory_enabled: Boolean(envString('INVENTORY_ENABLED')),
  uniconfig_api_docs_url: envString('UNICONFIG_API_DOCS_URL'),
  uniflow_api_docs_url: envString('UNIFLOW_API_DOCS_URL'),
  msal_authority: envString('MSAL_AUTHORITY'),
};

export default config;
