import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './header';
import { ServiceKey } from '../../types';

const enabledServices = new Map<ServiceKey, boolean>([
  ['isUniflowEnabled', true],
  ['isGammaEnabled', true],
  ['isInventoryEnabled', true],
  ['isUniresourceEnabled', true],
  ['isDeviceTopologyEnabled', true],
]);

describe('Dashboard app', () => {
  test('should open/close menu', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <Header enabledServices={enabledServices} isAuthEnabled={false} />
      </BrowserRouter>,
    );
    await user.click(screen.getByTestId('menu-button'));
    const openMenuWrapper = screen.getByTestId('menu-list').parentElement;
    expect(openMenuWrapper?.style.visibility).toEqual('visible');

    await user.click(screen.getByTestId('menu-button'));
    const closedMenuWrapper = screen.getByTestId('menu-list').parentElement;
    expect(closedMenuWrapper?.style.visibility).toEqual('hidden');
  });
});
