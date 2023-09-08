import React from 'react';
import { createRoot } from 'react-dom/client';
import { unwrap } from '@frinx/shared';
import Root from './root';
import { GlobalConfig, ServiceKey } from './types';
import ConfigProvider from './config.provider';

if (!window.IS_PRODUCTION) {
  new EventSource('http://localhost:8000/esbuild').addEventListener('change', () => {
    window.location.reload();
  });
}

const ALL_SERVICES: ServiceKey[] = [
  'isUniflowEnabled' as const,
  'isInventoryEnabled' as const,
  'isResourceManagerEnabled' as const,
  'isL3VPNEnabled' as const,
  'isDeviceTopologyEnabled' as const,
];
const serviceImportMap = new Map<ServiceKey, () => Promise<unknown>>([
  ['isUniflowEnabled', () => import('@frinx/workflow-ui')],
  ['isInventoryEnabled', () => import('@frinx/inventory-client')],
  ['isResourceManagerEnabled', () => import('@frinx/resource-manager')],
  ['isL3VPNEnabled', () => import('@frinxio/gamma')],
  ['isDeviceTopologyEnabled', () => import('@frinx/device-topology')],
]);

class DashboardApp {
  private config: GlobalConfig | null = null;

  private isInitialized = false;

  async init(config: GlobalConfig) {
    if (this.isInitialized) {
      throw new Error('DashboardApp is already initialized');
    }

    this.config = config;

    // see https://github.com/remix-run/react-router/issues/8427
    if (!window.location.pathname.includes(config.URLBasename)) {
      window.history.replaceState(null, '', config.URLBasename);
    }
    await Promise.all(
      ALL_SERVICES.map((service) => {
        const importFn = unwrap(serviceImportMap.get(service));
        return importFn();
      }),
    );
    this.isInitialized = true;

    return this;
  }

  render() {
    if (this.config == null) {
      throw new Error('missing global config');
    }
    // eslint-disable-next-line no-console
    console.log(`Running version: ${this.config.commitHash}`);
    const root = createRoot(unwrap(document.getElementById('root')));
    root.render(
      React.createElement(
        ConfigProvider,
        {
          config: this.config,
        },
        React.createElement(Root),
      ),
    );
  }
}

export const dashboardApp = new DashboardApp();
