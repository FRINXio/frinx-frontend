import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import DeviceTable from './device-table';
import { DeviceEdge } from '../../__generated__/graphql';

faker.seed(123);

const devices: DeviceEdge[] = [
  {
    node: {
      id: '1',
      address: faker.internet.ipv4(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.past().toISOString(),
      isInstalled: false,
      location: {
        id: faker.datatype.uuid(),
        name: faker.address.city(),
        country: faker.address.country(),
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.past().toISOString(),
      },
      model: 'some_model',
      mountParameters: '{}',
      name: 'some_name',
      serviceState: 'IN_SERVICE',
      source: 'DISCOVERED',
      vendor: 'some_vendor',
      zone: {
        id: 'zone_id',
        name: 'localhost',
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.past().toISOString(),
      },
      labels: {
        edges: [],
        pageInfo: {
          startCursor: 'start_cursor',
          endCursor: 'end_cursor',
          hasNextPage: false,
          hasPreviousPage: false,
        },
        totalCount: 1,
      },
    },
    cursor: 'some_cursor',
  },
];

describe('Inventory app', () => {
  test('should render device table', () => {
    render(
      <BrowserRouter>
        <DeviceTable
          areSelectedAll={false}
          devices={devices}
          sorting={null}
          selectedDevices={new Set()}
          installLoadingMap={{}}
          onDeleteBtnClick={() => {}}
          onDeviceSelection={() => {}}
          onInstallButtonClick={() => {}}
          onSelectAll={() => {}}
          onSortingClick={() => {}}
          onUninstallButtonClick={() => {}}
        />
      </BrowserRouter>,
    );
    expect(screen.getByRole('table')).toBeDefined();
  });
});
