import {
  Badge,
  Checkbox,
  Flex,
  HStack,
  Icon,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { format, formatDistanceToNow } from 'date-fns';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { getDeviceUsageColor, getLocalDateFromUTC, getDeviceUsage, omitNullValue } from '@frinx/shared';
import { DevicesQuery, DevicesUsage } from '../../__generated__/graphql';
import InstallButton from './install-button';
import { isDeviceOnUniconfigLayer } from '../../helpers/device';

type SortedBy = 'name' | 'discoveredAt' | 'serviceState' | 'modelVersion';
type Direction = 'ASC' | 'DESC';
type OrderBy = {
  sortKey: SortedBy;
  direction: Direction;
} | null;
type DevicesConnection = { deviceName: string | null; status: string | null } | null;
type DeviceInstallStatus = {
  name: string;
  isInstalled: boolean;
};
type DeviceStatus = {
  name: string;
  isInstalled: boolean;
  connection: string | null;
  usageCpuLoad: number | null;
  memoryLoad: number | null;
  statusColor?: string;
};

function mergeDeviceStatuses(
  devices: DeviceInstallStatus[],
  usage: DevicesUsage[],
  connection: DevicesConnection[],
): Map<string, DeviceStatus> {
  const usageMap = new Map(usage.map((u) => [u.deviceName, u]));
  const connectionMap = new Map(
    connection
      .filter(omitNullValue)
      .filter((c) => c.deviceName != null)
      .map((c) => [c.deviceName, c]),
  );

  const mergedStatuses = devices.map((d) => {
    return {
      name: d.name,
      isInstalled: d.isInstalled,
      connection: connectionMap.get(d.name)?.status ?? null,
      usageCpuLoad: usageMap.get(d.name)?.cpuLoad ?? null,
      memoryLoad: usageMap.get(d.name)?.memoryLoad ?? null,
    };
  });

  return new Map(mergedStatuses.map((s) => [s.name, s]));
}

type Props = {
  deviceInstallStatuses?: DeviceInstallStatus[];
  devicesConnection?: DevicesConnection[] | null;
  orderBy: OrderBy;
  devices: DevicesQuery['deviceInventory']['devices']['edges'];
  devicesUsage: DevicesUsage[];
  selectedDevices: Set<string>;
  areSelectedAll: boolean;
  installLoadingMap: Record<string, boolean>;
  isPerformanceMonitoringEnabled: boolean;
  onSort: (sortedBy: SortedBy) => void;
  onDeviceDiscoveryBtnClick: (deviceId: string | null) => void;
  onInstallButtonClick: (deviceId: string) => void;
  onUninstallButtonClick: (deviceId: string) => void;
  onDeleteBtnClick: (deviceId: string) => void;
  onDeviceSelection: (deviceId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  columnsDisplayed: string[];
};

const DeviceTable: VoidFunctionComponent<Props> = ({
  deviceInstallStatuses,
  devicesConnection,
  orderBy,
  devices,
  devicesUsage,
  selectedDevices,
  onSort,
  onDeviceDiscoveryBtnClick,
  onInstallButtonClick,
  onUninstallButtonClick,
  onDeleteBtnClick,
  installLoadingMap,
  onDeviceSelection,
  areSelectedAll,
  onSelectAll,
  isPerformanceMonitoringEnabled,
  columnsDisplayed,
}) => {
  const deviceStatuses = isPerformanceMonitoringEnabled
    ? mergeDeviceStatuses(deviceInstallStatuses ?? [], devicesUsage, devicesConnection ?? [])
    : new Map<string, DeviceStatus>();

  return (
    <Table background="white" size="lg">
      <Thead>
        <Tr>
          <Th>
            <Checkbox isChecked={areSelectedAll} onChange={(e) => onSelectAll(e.target.checked)} mr={2} />
          </Th>
          <Th>
            <Flex alignItems="center" justifyContent="space-between" cursor="pointer" onClick={() => onSort('name')}>
              <Text>Name</Text>
              {orderBy?.sortKey === 'name' && (
                <Icon as={FeatherIcon} size={40} icon={orderBy?.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
              )}
            </Flex>
          </Th>
          {columnsDisplayed.includes('model/version') && (
            <Th>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                cursor="pointer"
                onClick={() => onSort('modelVersion')}
              >
                <Text>Model/Version</Text>
                {orderBy?.sortKey === 'modelVersion' && (
                  <Icon
                    as={FeatherIcon}
                    size={40}
                    icon={orderBy?.direction === 'ASC' ? 'chevron-down' : 'chevron-up'}
                  />
                )}
              </Flex>
            </Th>
          )}
          {columnsDisplayed.includes('discoveredAt') && (
            <Th>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                cursor="pointer"
                onClick={() => onSort('discoveredAt')}
              >
                <Text>Discovered</Text>
                {orderBy?.sortKey === 'discoveredAt' && (
                  <Icon
                    as={FeatherIcon}
                    size={40}
                    icon={orderBy?.direction === 'ASC' ? 'chevron-down' : 'chevron-up'}
                  />
                )}
              </Flex>
            </Th>
          )}
          {columnsDisplayed.includes('deviceStatus') && (
            <Th>
              <Flex alignItems="center" justifyContent="space-between" cursor="pointer">
                <Text>Device Status</Text>
              </Flex>
            </Th>
          )}
          {columnsDisplayed.includes('isInstalled') && <Th>Installation</Th>}
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {devices.map(({ node: device }) => {
          const { name, isInstalled, discoveredAt, mountParameters } = device;
          const localDate = discoveredAt ? getLocalDateFromUTC(discoveredAt) : null;
          const isOnUniconfigLayer = isDeviceOnUniconfigLayer(mountParameters);
          const isLoading = installLoadingMap[device.id] ?? false;
          const isUnknown = device.model == null && device.software == null && device.version == null;
          const deviceStatus = deviceStatuses.get(name);

          return (
            <Tr key={device.id}>
              <Td>
                <Checkbox
                  data-cy={`device-check-box-${device.name}`}
                  isChecked={selectedDevices.has(device.id)}
                  onChange={(e) => onDeviceSelection(device.id, e.target.checked)}
                />
              </Td>
              <Td>
                <HStack>
                  <Text
                    data-cy={`device-name-${device.name}`}
                    as="span"
                    fontWeight={600}
                    textColor={isUnknown ? 'gray.400' : 'black'}
                  >
                    {device.name}
                  </Text>
                  {isUnknown && (
                    <Tooltip label="This device is currently unknown to the network, since we do not have any information on its model and software version">
                      <Text data-cy={`device-id-${device.name}`} as="span" fontSize="sm" color="blackAlpha.700">
                        <Icon size={12} as={FeatherIcon} icon="info" />
                      </Text>
                    </Tooltip>
                  )}
                </HStack>
              </Td>
              {columnsDisplayed.includes('model/version') && (
                <Td>
                  <Text data-cy="device-name-software" as="span">
                    {device.model ?? device.software ?? '?'} / {device.version ?? '?'}
                  </Text>
                </Td>
              )}
              {columnsDisplayed.includes('discoveredAt') && (
                <Td>
                  <Tooltip label={localDate ? format(localDate, 'dd/MM/yyyy, k:mm') : 'unknown'}>
                    <Text
                      data-cy={`device-created-at-${device.name}`}
                      as="span"
                      fontSize="sm"
                      color={deviceStatuses.get(device.name)?.statusColor}
                    >
                      {localDate ? `${formatDistanceToNow(localDate)} ago` : 'UNKNOWN'}
                    </Text>
                  </Tooltip>
                </Td>
              )}
              {columnsDisplayed.includes('deviceStatus') && (
                <Td>
                  <Badge
                    data-cy={`device-status-${device.name}`}
                    colorScheme={getDeviceUsageColor(
                      deviceStatus?.usageCpuLoad ?? null,
                      deviceStatus?.memoryLoad ?? null,
                      deviceStatus?.connection ?? null,
                      deviceStatus?.isInstalled ?? false,
                    )}
                  >
                    {getDeviceUsage(
                      deviceStatus?.usageCpuLoad,
                      deviceStatus?.memoryLoad,
                      deviceStatus?.connection,
                      deviceStatus?.isInstalled,
                    ) ?? 'UNKNOWN'}
                  </Badge>
                </Td>
              )}
              {columnsDisplayed.includes('isInstalled') && (
                <Td minWidth={200}>
                  <InstallButton
                    deviceName={device.name}
                    isInstalled={isInstalled}
                    isLoading={isLoading}
                    onInstalClick={() => {
                      onInstallButtonClick(device.id);
                    }}
                    onUninstallClick={() => {
                      onUninstallButtonClick(device.id);
                    }}
                  />
                </Td>
              )}
              <Td minWidth={200}>
                <HStack spacing={2}>
                  <IconButton
                    data-cy={`device-rediscover-${device.name}`}
                    aria-label="rediscover"
                    size="sm"
                    icon={<Icon size={12} as={FeatherIcon} icon="search" />}
                    as={isInstalled ? Link : 'button'}
                    onClick={() => onDeviceDiscoveryBtnClick(device.address)}
                  />

                  <IconButton
                    data-cy={`device-settings-${device.name}`}
                    aria-label="config"
                    size="sm"
                    isDisabled={!isInstalled || !isOnUniconfigLayer}
                    disabled={!isInstalled || !isOnUniconfigLayer}
                    icon={<Icon size={12} as={FeatherIcon} icon="settings" />}
                    as={isInstalled ? Link : 'button'}
                    {...(isInstalled ? { to: `../config/${device.id}` } : {})}
                  />
                  <IconButton
                    data-cy={`device-edit-${device.name}`}
                    aria-label="edit"
                    size="sm"
                    isDisabled={isInstalled}
                    disabled={isInstalled}
                    icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                    as={isInstalled ? 'button' : Link}
                    {...(isInstalled ? {} : { to: `../${device.id}/edit` })}
                  />
                  <IconButton
                    data-cy={`device-delete-${device.name}`}
                    aria-label="Delete device"
                    size="sm"
                    isDisabled={isInstalled}
                    disabled={isInstalled}
                    colorScheme="red"
                    icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                    onClick={() => {
                      onDeleteBtnClick(device.id);
                    }}
                  />
                </HStack>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default DeviceTable;
