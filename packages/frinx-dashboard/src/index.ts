import React from 'react';
import ReactDOM from 'react-dom';
import { AuthContext } from './auth-helpers';
import unwrap from './helpers/unwrap';
import Root from './root';
import './set-public-path';
import { ServiceKey } from './types';

const ALL_SERVICES: ServiceKey[] = [
  'isUniflowEnabled' as const,
  'isInventoryEnabled' as const,
  'isUniresourceEnabled' as const,
  'isGammaEnabled' as const,
];
const serviceImportMap = new Map<ServiceKey, () => Promise<unknown>>([
  ['isUniflowEnabled', () => import('@frinx/workflow-ui')],
  ['isInventoryEnabled', () => import('@frinx/inventory-client')],
  ['isUniresourceEnabled', () => import('@frinx/uniresource-ui')],
  ['isGammaEnabled', () => import('@frinx/gamma')],
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
    ReactDOM.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(Root, {
          isAuthEnabled: AuthContext.isAuthEnabled(),
          enabledServices: this.enabledServices,
        }),
      ),
      document.getElementById('root'),
    );
  }
}

window.dashboardApp = new DashboardApp();
