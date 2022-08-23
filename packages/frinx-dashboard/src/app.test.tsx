import React, { ReactChildren } from 'react';
import { afterAll, assert, beforeAll, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './app';
// import AuthProvider from './auth-provider';
import { ServiceKey } from './types';
import unwrap from './helpers/unwrap';
import '@frinx/workflow-ui';

// const ALL_SERVICES: ServiceKey[] = [
//   'isUniflowEnabled' as const,
//   'isInventoryEnabled' as const,
//   'isUniresourceEnabled' as const,
//   'isGammaEnabled' as const,
//   'isDeviceTopologyEnabled' as const,
// ];

const enabledServices = new Map<ServiceKey, boolean>([
  ['isUniflowEnabled', false],
  ['isInventoryEnabled', false],
  ['isUniflowEnabled', false],
  ['isGammaEnabled', false],
  ['isDeviceTopologyEnabled', false],
]);

describe('Dashboard app', () => {
  beforeAll(() => {
    console.log('hey');
  });

  test('should render', () => {
    console.log('ok');
    // render(<App enabledServices={enabledServices} basename="" isAuthEnabled={false} />);
    // expect(screen.findAllByRole('alert')).toBeDefined();
  });
});
