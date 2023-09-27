import { describe, expect, test } from 'vitest';
import { DevicesQuery } from '../__generated__/graphql';
import { makeDevicesToInstallFromIds } from './convert';

const LOADED_DEVICES_ARRAY: DevicesQuery = {
  devices: {
    edges: [
      {
        node: {
          id: 'RGV2aWNlOjE2MjY1MjdhLTY4MzgtNDAxOC1iOTcxLWI0YjQ3OWQwZjQ5Mw',
          name: 'CSR_SAOS514',
          createdAt: '2023-08-31T11:18:51.393Z',
          isInstalled: false,
          serviceState: 'PLANNING',
          zone: {
            id: 'Wm9uZTplM2U4YWQyOS1iN2E0LTRmMTYtYjBiYi01NDQ2YjgyNzc2ZDc',
            name: 'localhost',
          },
        },
      },
      {
        node: {
          id: 'RGV2aWNlOjFjYmM0ZjhiLTI2MzItNDJiNS1iNDU0LTliOGVjYTA2YjVmMA',
          name: 'testing',
          createdAt: '2023-08-31T11:21:14.542Z',
          isInstalled: false,
          serviceState: 'PLANNING',
          zone: {
            id: 'Wm9uZTplM2U4YWQyOS1iN2E0LTRmMTYtYjBiYi01NDQ2YjgyNzc2ZDc',
            name: 'localhost',
          },
        },
      },
      {
        node: {
          id: 'RGV2aWNlOjRlNzk2MTY1LWFhOTgtNDU4MC04MjE2LTYwZjBmMzZhZmZmMw',
          name: 'CSR_SAOS511',
          createdAt: '2023-08-31T11:18:51.393Z',
          isInstalled: false,
          serviceState: 'PLANNING',
          zone: {
            id: 'Wm9uZTplM2U4YWQyOS1iN2E0LTRmMTYtYjBiYi01NDQ2YjgyNzc2ZDc',
            name: 'localhost',
          },
        },
      },
      {
        node: {
          id: 'RGV2aWNlOjcxYmIyODE1LTljMTktNGVhZS1iNTdhLTg2M2FkODFkZTM2Zg',
          name: 'BH_SAOS502',
          createdAt: '2023-08-31T11:18:51.393Z',
          isInstalled: false,
          serviceState: 'PLANNING',
          zone: {
            id: 'Wm9uZTplM2U4YWQyOS1iN2E0LTRmMTYtYjBiYi01NDQ2YjgyNzc2ZDc',
            name: 'localhost',
          },
        },
      },
    ],
    pageInfo: {
      startCursor: '1626527a-6838-4018-b971-b4b479d0f493',
      endCursor: 'fd4235ba-07db-4dbd-a954-5ef5d8b881dd',
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
};

const DEVICE_IDS_ARRAY = [
  'RGV2aWNlOjE2MjY1MjdhLTY4MzgtNDAxOC1iOTcxLWI0YjQ3OWQwZjQ5Mw',
  'RGV2aWNlOjFjYmM0ZjhiLTI2MzItNDJiNS1iNDU0LTliOGVjYTA2YjVmMA',
  'RGV2aWNlOjRlNzk2MTY1LWFhOTgtNDU4MC04MjE2LTYwZjBmMzZhZmZmMw',
];

describe('Test inventory client converters', () => {
  test('test make function of devicesToInstall from device ids and loaded devices', () => {
    const result = [
      {
        zoneId: 'Wm9uZTplM2U4YWQyOS1iN2E0LTRmMTYtYjBiYi01NDQ2YjgyNzc2ZDc',
        deviceIds: [
          'RGV2aWNlOjE2MjY1MjdhLTY4MzgtNDAxOC1iOTcxLWI0YjQ3OWQwZjQ5Mw',
          'RGV2aWNlOjFjYmM0ZjhiLTI2MzItNDJiNS1iNDU0LTliOGVjYTA2YjVmMA',
          'RGV2aWNlOjRlNzk2MTY1LWFhOTgtNDU4MC04MjE2LTYwZjBmMzZhZmZmMw',
        ],
      },
    ];
    expect(makeDevicesToInstallFromIds(DEVICE_IDS_ARRAY, LOADED_DEVICES_ARRAY)).toEqual(result);
  });

  test('test make function of devicesToInstall from device ids and loaded devices with empty device ids', () => {
    const result: string[] = [];
    expect(makeDevicesToInstallFromIds([], LOADED_DEVICES_ARRAY)).toEqual(result);
  });

  test('test make function of devicesToInstall from device ids and loaded devices with empty loaded devices', () => {
    const result: string[] = [];
    expect(makeDevicesToInstallFromIds(DEVICE_IDS_ARRAY, undefined)).toEqual(result);
  });

  test('test make function of devicesToInstall from device ids and loaded devices with empty device ids and loaded devices', () => {
    const result: string[] = [];
    expect(makeDevicesToInstallFromIds([], undefined)).toEqual(result);
  });
});
