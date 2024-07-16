function envString(key: string): string {
  const { env } = process;
  const value = env[key];
  if (typeof value !== 'string') {
    throw new Error(`Mandatory env variable "${key}" not found`);
  }

  return value;
}

function optionalEnvString(key: string): string | null {
  const { env } = process;
  const value = env[key];
  return value || null;
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
  inventoryApiURL: envString('INVENTORY_API_URL'),
  devInventoryWsURL: optionalEnvString('DEV_INVENTORY_WS_URL'),
  inventoryWsSchema: envString('INVENTORY_WS_SCHEMA'),
  inventoryWsPath: envString('INVENTORY_WS_PATH'),
  uniconfigApiDocsURL: optionalEnvString('UNICONFIG_API_DOCS_URL'),
  uniflowApiDocsURL: optionalEnvString('WORKFLOW_MANAGER_API_DOCS_URL'),
  resourceManagerApiDocsURL: optionalEnvString('RESOURCE_MANAGER_API_DOCS_URL'),
  performanceMonitorApiDocsURL: optionalEnvString('PERFORMANCE_MONITOR_API_DOCS_URL'),
  topologyDiscoveryApiDocsURL: optionalEnvString('TOPOLOGY_DISCOVERY_API_DOCS_URL'),
  schellarApiDocsURL: optionalEnvString('SCHELLAR_API_DOCS_URL'),
  commitHash: envString('COMMIT_HASH'),
  unistoreApiURL: envString('UNISTORE_API_URL'),
  isPerformanceMonitoringEnabled: stringToBoolean(envString('PERFORMANCE_MONITORING_ENABLED')),
};

export default config;
