import './set-public-path';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import unwrap from './helpers/unwrap';
import { isAuthEnabled } from './auth-helpers';
import { ServiceKey } from './types';

const ALL_SERVICES: ServiceKey[] = [
  // 'uniflow_enabled' as const,
  // 'inventory_enabled' as const,
  // 'uniresource_enabled' as const,
  // 'usermanagement_enabled' as const,
];
const serviceImportMap = new Map<ServiceKey, () => Promise<unknown>>([
  // ['uniflow_enabled', () => import('@frinx/workflow-ui')],
  // ['inventory_enabled', () => import('@frinx/inventory-client')],
  // ['uniresource_enabled', () => import('@frinx/uniresource-ui')],
  // ['usermanagement_enabled', () => import('@frinx/workflow-ui')],
]);

class GammaApp {
  private enabledServices: Map<ServiceKey, boolean> = new Map(
    // eslint-disable-next-line no-underscore-dangle
    ALL_SERVICES.map((service) => {
      return [service, window.__CONFIG__[service]];
    }),
  );

  private isInitialized = false;

  async init() {
    if (this.isInitialized) {
      throw new Error('Gamma is already initialized');
    }
    // await Promise.all(
    //   ALL_SERVICES.map((service) => {
    //     const importFn = unwrap(serviceImportMap.get(service));
    //     return importFn();
    //   }),
    // );
    this.isInitialized = true;

    return this;
  }

  render() {
    ReactDOM.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(App, { isAuthEnabled: isAuthEnabled(), enabledServices: this.enabledServices }),
      ),
      document.getElementById('root'),
    );
  }
}

window.gammaApp = new GammaApp();
