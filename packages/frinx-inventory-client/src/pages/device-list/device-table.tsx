import { EditIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Badge,
  Checkbox,
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
import { getLocalDateFromUTC } from '../../helpers/time.helpers';
import { DevicesQuery } from '../../__generated__/graphql';
import InstallButton from './install-button';

type Props = {
  devices: DevicesQuery['devices']['edges'];
  selectedDevices: Set<string>;
  areSelectedAll: boolean;
  installLoadingMap: Record<string, boolean>;
  onInstallButtonClick: (deviceId: string) => void;
  onUninstallButtonClick: (deviceId: string) => void;
  onSettingsButtonClick: (deviceId: string) => void;
  onDeleteBtnClick: (deviceId: string) => void;
  onEditDeviceButtonClick: (deviceId: string) => void;
  onDeviceSelection: (deviceId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
};

const DeviceTable: VoidFunctionComponent<Props> = ({
  devices,
  selectedDevices,
  onInstallButtonClick,
  onUninstallButtonClick,
  onSettingsButtonClick,
  onDeleteBtnClick,
  onEditDeviceButtonClick,
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
          <Th>Name</Th>
          <Th>Created</Th>
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
                    icon={<Icon size={12} as={SettingsIcon} />}
                    onClick={() => onSettingsButtonClick(device.id)}
                  />
                  <IconButton
                    aria-label="edit"
                    size="sm"
                    variant="unstyled"
                    isDisabled={isInstalled}
                    icon={<Icon size={12} as={EditIcon} />}
                    onClick={() => onEditDeviceButtonClick(device.id)}
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
