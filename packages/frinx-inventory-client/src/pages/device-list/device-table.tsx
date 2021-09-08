import { AddIcon, EditIcon, MinusIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Badge,
  Button,
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
import React, { VoidFunctionComponent } from 'react';
import { getLocalDateFromUTC } from '../../helpers/time.helpers';
import { DevicesQuery } from '../../__generated__/graphql';

type Props = {
  devices: DevicesQuery['devices']['edges'] | undefined;
  isLoading: boolean;
  onInstallButtonClick: (deviceId: string) => void;
  onUninstallButtonClick: (deviceId: string) => void;
  onSettingsButtonClick: (deviceId: string) => void;
  onEditDeviceButtonClick: (deviceId: string) => void;
};

const DeviceTable: VoidFunctionComponent<Props> = ({
  devices,
  onInstallButtonClick,
  onUninstallButtonClick,
  onSettingsButtonClick,
  onEditDeviceButtonClick,
  isLoading,
}) => {
  return (
    <Table background="white" size="lg">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Created</Th>
          <Th>Zone</Th>
          <Th>Service state</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
          <Th>Config</Th>
          <Th>Edit</Th>
        </Tr>
      </Thead>
      <Tbody>
        {devices?.map(({ node: device }) => {
          const { isInstalled } = device;
          const status = isInstalled ? 'INSTALLED' : 'N/A';
          const localDate = getLocalDateFromUTC(device.createdAt);

          return (
            <Tr key={device.id}>
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
                <Badge colorScheme={isInstalled ? 'green' : 'yellow'}>{status}</Badge>
              </Td>
              <Td minWidth={200}>
                <HStack spacing={2}>
                  {isInstalled ? (
                    <Button
                      size="xs"
                      colorScheme="yellow"
                      leftIcon={<MinusIcon />}
                      isLoading={isLoading}
                      onClick={() => {
                        onUninstallButtonClick(device.id);
                      }}
                    >
                      Uninstall
                    </Button>
                  ) : (
                    <Button
                      size="xs"
                      colorScheme="green"
                      leftIcon={<AddIcon />}
                      isLoading={isLoading}
                      onClick={() => {
                        onInstallButtonClick(device.id);
                      }}
                    >
                      Install
                    </Button>
                  )}
                </HStack>
              </Td>
              <Td>
                <IconButton
                  aria-label="config"
                  isDisabled={!isInstalled}
                  variant="unstyled"
                  icon={<Icon size={20} as={SettingsIcon} />}
                  onClick={() => onSettingsButtonClick(device.id)}
                />
              </Td>
              <Td>
                <IconButton
                  aria-label="edit"
                  isDisabled={isInstalled}
                  variant="unstyled"
                  icon={<Icon size={20} as={EditIcon} />}
                  onClick={() => onEditDeviceButtonClick(device.id)}
                />
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default DeviceTable;
