import React from 'react';
import { createRoot } from 'react-dom/client';
import { unwrap } from '@frinx/shared/src';
import { AuthContext } from './auth-helpers';
import Root from './root';
import { ServiceKey } from './types';

const ALL_SERVICES: ServiceKey[] = [
  'isUniflowEnabled' as const,
  'isInventoryEnabled' as const,
  'isResourceManagerEnabled' as const,
  'isL3VPNEnabled' as const,
  'isDeviceTopologyEnabled' as const,
];
const serviceImportMap = new Map<ServiceKey, () => Promise<unknown>>([
  ['isUniflowEnabled', () => import('@frinx/workflow-ui')],
  ['isInventoryEnabled', () => import('@frinx/inventory-client/src')],
  ['isResourceManagerEnabled', () => import('@frinx/resource-manager/src')],
  ['isL3VPNEnabled', () => import('@frinxio/gamma')],
  ['isDeviceTopologyEnabled', () => import('@frinxio/device-topology/src')],
]);

class DashboardApp {
  private enabledServices: Map<ServiceKey, boolean> = new Map(
    ALL_SERVICES.map((service) => {
      return [service, window.__CONFIG__[service]];
    }),
  );

  private isInitialized = false;

  async init() {
    if (this.isInitialized) {
      throw new Error('DashboardApp is already initialized');
    }
    // see https://github.com/remix-run/react-router/issues/8427
    if (!window.location.pathname.includes(window.__CONFIG__.URLBasename)) {
      window.history.replaceState(null, '', window.__CONFIG__.URLBasename);
    }
    await Promise.all(
      ALL_SERVICES.map((service) => {
        const importFn = unwrap(serviceImportMap.get(service));
        return importFn();
      }),
    );
    await import('./set-public-path').then(({ setWebpackPublicPath }) => {
      setWebpackPublicPath();
    });
    this.isInitialized = true;

    return this;
  }

  render() {
    // eslint-disable-next-line no-console
    console.log(`Running version: ${window.__CONFIG__.commitHash}`);
    const root = createRoot(unwrap(document.getElementById('root')));
    root.render(
      React.createElement(Root, {
        isAuthEnabled: AuthContext.isAuthEnabled(),
        enabledServices: this.enabledServices,
      }),
    );
  }
}

window.dashboardApp = new DashboardApp();
