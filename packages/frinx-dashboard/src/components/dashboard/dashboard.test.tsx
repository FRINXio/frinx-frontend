import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from './dashboard';
import { ServiceKey } from '../../types';

const enabledServices = new Map<ServiceKey, boolean>([
  ['isUniflowEnabled', true],
  ['isGammaEnabled', true],
  ['isInventoryEnabled', true],
  ['isUniresourceEnabled', true],
  ['isDeviceTopologyEnabled', true],
]);

describe('Dashboard app', () => {
  beforeAll(() => {
    const config = {
      uniconfigApiDocsURL:
        'https://editor.swagger.io/?url=https://gist.githubusercontent.com/marosmars/4951c0395837cc04cae374c2a01eb209/raw/fb2e3d579679753b424f86170b54135bec668768/uniconfig_427.yaml',
    };
    vi.stubGlobal('__CONFIG__', config);
  });

  test('should render dashboard', () => {
    render(
      <BrowserRouter>
        <Dashboard enabledServices={enabledServices} />
      </BrowserRouter>,
    );
    expect(screen.getByTestId('version-info')).toBeDefined();
  });
});
