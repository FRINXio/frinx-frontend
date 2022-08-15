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
import { getLocalDateFromUTC } from '../../helpers/time.helpers';
import { DevicesQuery } from '../../__generated__/graphql';
import InstallButton from './install-button';

type SortedBy = 'name' | 'created';
type Direction = 'ASC' | 'DESC';
type Sorting = {
  sortedBy: SortedBy;
  direction: Direction;
};

type Props = {
  sorting: Sorting | null;
  devices: DevicesQuery['devices']['edges'];
  selectedDevices: Set<string>;
  areSelectedAll: boolean;
  installLoadingMap: Record<string, boolean>;
  onSortingClick: (sortedBy: SortedBy) => void;
  onInstallButtonClick: (deviceId: string) => void;
  onUninstallButtonClick: (deviceId: string) => void;
  onDeleteBtnClick: (deviceId: string) => void;
  onDeviceSelection: (deviceId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
};

function getSortingIcon(direction: Direction) {
  if (direction === 'ASC') {
    return <Icon as={FeatherIcon} size={12} icon="triangle" />;
  }
  return <Icon as={FeatherIcon} size={12} icon="triangle" style={{ transform: 'rotate(180deg)' }} />;
}

const DeviceTable: VoidFunctionComponent<Props> = ({
  sorting,
  devices,
  selectedDevices,
  onSortingClick,
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
            <Flex
              alignItems="center"
              justifyContent="space-between"
              cursor="pointer"
              onClick={() => onSortingClick('name')}
            >
              <Text>Name</Text>
              {sorting?.sortedBy === 'name' && getSortingIcon(sorting.direction)}
            </Flex>
          </Th>
          <Th>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              cursor="pointer"
              onClick={() => onSortingClick('created')}
            >
              <Text>Created</Text>
              {sorting?.sortedBy === 'created' && getSortingIcon(sorting.direction)}
            </Flex>
          </Th>
          <Th>Zone</Th>
          <Th>Service state</Th>
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
                  isDisabled={device.isInstalled}
                  isChecked={selectedDevices.has(device.id)}
                  onChange={(e) => onDeviceSelection(device.id, e.target.checked)}
                />
              </Td>
              <Td>
                <Text as="span" fontWeight={600}>
                  {device.name}
                </Text>
              </Td>
              <Td>
                <Tooltip label={format(localDate, 'dd/MM/yyyy, k:mm')}>
                  <Text as="span" fontSize="sm" color="blackAlpha.700">
                    {formatDistanceToNow(localDate)} ago
                  </Text>
                </Tooltip>
              </Td>
              <Td>{device.zone?.name}</Td>
              <Td minWidth={200}>
                <Badge>{device.serviceState}</Badge>
              </Td>
              <Td minWidth={200}>
                <InstallButton
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
                    aria-label="config"
                    size="sm"
                    variant="unstyled"
                    isDisabled={!isInstalled}
                    icon={<Icon size={12} as={FeatherIcon} icon="settings" />}
                    as={Link}
                    to={`../config/${device.id}`}
                  />
                  <IconButton
                    aria-label="edit"
                    size="sm"
                    variant="unstyled"
                    isDisabled={isInstalled}
                    icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                    as={Link}
                    to={`../${device.id}/edit`}
                  />
                  <IconButton
                    aria-label="Delete device"
                    size="sm"
                    isDisabled={isInstalled}
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
