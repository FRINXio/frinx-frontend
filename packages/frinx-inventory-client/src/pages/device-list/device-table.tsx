import React, { VoidFunctionComponent } from 'react';
import { Badge, Button, HStack, Icon, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { AddIcon, MinusIcon, SettingsIcon } from '@chakra-ui/icons';
import { DevicesQuery } from '../../__generated__/graphql';

type Props = {
  devices: DevicesQuery['devices']['edges'];
  onInstallButtonClick: (deviceId: string) => void;
  onUninstallButtonClick: (deviceId: string) => void;
  onSettingsButtonClick: (deviceId: string) => void;
  isLoading: boolean;
};

const DeviceTable: VoidFunctionComponent<Props> = ({
  devices,
  onInstallButtonClick,
  onUninstallButtonClick,
  onSettingsButtonClick,
  isLoading,
}) => {
  return (
    <Table background="white" size="lg">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Vendor</Th>
          <Th>Model</Th>
          <Th>Address</Th>
          <Th>Zone</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
          <Th>Config</Th>
        </Tr>
      </Thead>
      <Tbody>
        {devices.map(({ node: device }) => {
          const isInstalled = device.status === 'INSTALLED';

          return (
            <Tr key={device.id}>
              <Td>
                <Text as="span" fontWeight={600}>
                  {device.name}
                </Text>
              </Td>
              <Td>{device.vendor}</Td>
              <Td>{device.model}</Td>
              <Td>
                <Text as="span" fontFamily="monospace" color="red">
                  {device.address}
                </Text>
              </Td>
              <Td>{device.zone?.name}</Td>
              <Td minWidth={200}>
                <Badge colorScheme={isInstalled ? 'green' : 'yellow'}>{device.status}</Badge>
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
                <Icon size={20} as={SettingsIcon} cursor="pointer" onClick={() => onSettingsButtonClick(device.id)} />
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default DeviceTable;
