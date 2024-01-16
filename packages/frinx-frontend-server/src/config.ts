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

const config = {
  isAuthEnabled: stringToBoolean(envString('AUTH_ENABLED')),
  URLBasename: envString('URL_BASENAME'),
  gatewayApiUrl: envString('GATEWAY_API_URL'),
  inventoryWsURL: envString('INVENTORY_WS_URL'),
  uniconfigApiDocsURL: envString('UNICONFIG_API_DOCS_URL'),
  uniflowApiDocsURL: envString('WORKFLOW_MANAGER_API_DOCS_URL'),
  commitHash: envString('COMMIT_HASH'),
  unistoreApiURL: envString('UNISTORE_API_URL'),
};

export default config;
