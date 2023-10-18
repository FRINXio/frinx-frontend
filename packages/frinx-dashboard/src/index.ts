import React from 'react';
import { createRoot } from 'react-dom/client';
import { unwrap } from '@frinx/shared';
import Root from './root';
import { GlobalConfig } from './types';
import ConfigProvider from './config.provider';

if (!window.IS_PRODUCTION) {
  new EventSource('http://localhost:8000/esbuild').addEventListener('change', () => {
    window.location.reload();
  });
}

class DashboardApp {
  private config: GlobalConfig | null = null;

  private isInitialized = false;

  async init(config: GlobalConfig): Promise<DashboardApp> {
    if (this.isInitialized) {
      throw new Error('DashboardApp is already initialized');
    }

    this.config = config;

    // see https://github.com/remix-run/react-router/issues/8427
    if (!window.location.pathname.includes(config.URLBasename)) {
      window.history.replaceState(null, '', config.URLBasename);
    }
    this.isInitialized = true;

    return this;
  }

  render(): void {
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
