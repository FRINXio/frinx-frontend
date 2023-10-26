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
import { getLocalDateFromUTC } from '@frinx/shared';
import { DevicesQuery } from '../../__generated__/graphql';
import InstallButton from './install-button';

type SortedBy = 'name' | 'createdAt' | 'serviceState';
type Direction = 'ASC' | 'DESC';
type OrderBy = {
  sortKey: SortedBy;
  direction: Direction;
} | null;

type Props = {
  orderBy: OrderBy;
  devices: DevicesQuery['deviceInventory']['devices']['edges'];
  selectedDevices: Set<string>;
  areSelectedAll: boolean;
  installLoadingMap: Record<string, boolean>;
  onSort: (sortedBy: SortedBy) => void;
  onInstallButtonClick: (deviceId: string) => void;
  onUninstallButtonClick: (deviceId: string) => void;
  onDeleteBtnClick: (deviceId: string) => void;
  onDeviceSelection: (deviceId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
};

const DeviceTable: VoidFunctionComponent<Props> = ({
  orderBy,
  devices,
  selectedDevices,
  onSort,
  onInstallButtonClick,
  onUninstallButtonClick,
  onDeleteBtnClick,
  installLoadingMap,
  onDeviceSelection,
  areSelectedAll,
  onSelectAll,
}) => {
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
            <Flex
              alignItems="center"
              justifyContent="space-between"
              cursor="pointer"
              onClick={() => onSort('createdAt')}
            >
              <Text>Created</Text>
              {orderBy?.sortKey === 'createdAt' && (
                <Icon as={FeatherIcon} size={40} icon={orderBy?.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
              )}
            </Flex>
          </Th>
          <Th>
            <Flex alignItems="center" justifyContent="space-between">
              <Text>Zone</Text>
            </Flex>
          </Th>
          <Th>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              cursor="pointer"
              onClick={() => onSort('serviceState')}
            >
              <Text>Service State</Text>
              {orderBy?.sortKey === 'serviceState' && (
                <Icon as={FeatherIcon} size={40} icon={orderBy?.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
              )}
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
                <Text data-cy={`device-name-${device.name}`} as="span" fontWeight={600}>
                  {device.name}
                </Text>
              </Td>
              <Td>
                <Tooltip label={format(localDate, 'dd/MM/yyyy, k:mm')}>
                  <Text data-cy={`device-created-at-${device.name}`} as="span" fontSize="sm" color="blackAlpha.700">
                    {formatDistanceToNow(localDate)} ago
                  </Text>
                </Tooltip>
              </Td>
              <Td data-cy={`device-zone-${device.name}`}>{device.zone?.name}</Td>
              <Td minWidth={200}>
                <Badge data-cy={`device-state-${device.name}`}>{device.serviceState}</Badge>
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
                    as={Link}
                    to={`../${device.id}/edit`}
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
