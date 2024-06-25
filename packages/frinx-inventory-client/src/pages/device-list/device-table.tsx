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
import { getDeviceUsageColor, getLocalDateFromUTC, getDeviceUsage } from '@frinx/shared';
import { DevicesQuery, DevicesUsageSubscription } from '../../__generated__/graphql';
import InstallButton from './install-button';

type SortedBy = 'name' | 'createdAt' | 'serviceState';
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

type Props = {
  deviceInstallStatuses?: DeviceInstallStatus[];
  devicesConnection?: DevicesConnection[] | null;
  orderBy: OrderBy;
  devices: DevicesQuery['deviceInventory']['devices']['edges'];
  devicesUsage?: DevicesUsageSubscription | null;
  selectedDevices: Set<string>;
  areSelectedAll: boolean;
  installLoadingMap: Record<string, boolean>;
  isPerformanceMonitoringEnabled: boolean;
  onSort: (sortedBy: SortedBy) => void;
  onDeviceDiscoveryBtnClick: (deviceId: string) => void;
  onInstallButtonClick: (deviceId: string) => void;
  onUninstallButtonClick: (deviceId: string) => void;
  onDeleteBtnClick: (deviceId: string) => void;
  onDeviceSelection: (deviceId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
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
}) => {
  const deviceStatuses = isPerformanceMonitoringEnabled
    ? []
    : devicesUsage?.deviceInventory.devicesUsage?.devicesUsage.map((deviceUsage) => {
        const deviceConnection = devicesConnection?.find((device) => device?.deviceName === deviceUsage.deviceName);
        const deviceInstallStatus = deviceInstallStatuses?.find((device) => device?.name === deviceUsage.deviceName);

        const deviceUsageLevel = getDeviceUsage(
          deviceUsage?.cpuLoad,
          deviceUsage?.memoryLoad,
          deviceConnection?.status,
          deviceInstallStatus?.isInstalled,
        );
        const statusColor = getDeviceUsageColor(
          deviceUsage?.cpuLoad,
          deviceUsage?.memoryLoad,
          deviceConnection?.status,
        );

        return {
          deviceName: deviceUsage?.deviceName ?? '',
          status: deviceUsageLevel,
          statusColor,
        };
      }) ?? [];

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
          <Th>
            <Text>Model/Version</Text>
          </Th>
          <Th>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              cursor="pointer"
              onClick={() => onSort('createdAt')}
            >
              <Text>Discovered</Text>
              {orderBy?.sortKey === 'createdAt' && (
                <Icon as={FeatherIcon} size={40} icon={orderBy?.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
              )}
            </Flex>
          </Th>
          <Th>
            <Flex alignItems="center" justifyContent="space-between" cursor="pointer">
              <Text>Device Status</Text>
            </Flex>
          </Th>
          <Th>Installation</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {devices.map(({ node: device }) => {
          const { isInstalled } = device;
          const localDate = getLocalDateFromUTC(device.createdAt);
          const isLoading = installLoadingMap[device.id] ?? false;
          const isUnknown = device.model == null && device.software == null && device.version == null;

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
              <Td>
                <Text data-cy="device-name-software" as="span">
                  {device.model ?? device.software ?? '?'} / {device.version ?? '?'}
                </Text>
              </Td>
              <Td>
                <Tooltip label={format(localDate, 'dd/MM/yyyy, k:mm')}>
                  <Text
                    data-cy={`device-created-at-${device.name}`}
                    as="span"
                    fontSize="sm"
                    color={deviceStatuses.find((d) => d.deviceName === device.name)?.statusColor}
                  >
                    {formatDistanceToNow(localDate)} ago
                  </Text>
                </Tooltip>
              </Td>
              <Td>
                <Badge
                  data-cy={`device-status-${device.name}`}
                  colorScheme={deviceStatuses.find((d) => d.deviceName === device.name)?.statusColor}
                >
                  {deviceStatuses.find((d) => d.deviceName === device.name)?.status ?? 'UNKNOWN'}
                </Badge>
              </Td>
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
              <Td minWidth={200}>
                <HStack spacing={2}>
                  <IconButton
                    data-cy={`device-rediscover-${device.name}`}
                    aria-label="rediscover"
                    size="sm"
                    icon={<Icon size={12} as={FeatherIcon} icon="search" />}
                    as={isInstalled ? Link : 'button'}
                    onClick={() => onDeviceDiscoveryBtnClick(device.id)}
                  />

                  <IconButton
                    data-cy={`device-settings-${device.name}`}
                    aria-label="config"
                    size="sm"
                    isDisabled={!isInstalled}
                    disabled={!isInstalled}
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
