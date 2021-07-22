import React, { VoidFunctionComponent } from 'react';
import { Badge, Button, HStack, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Device } from '../../helpers/types';

type Props = {
  devices: Device[];
  onInstallButtonClick: (deviceId: string) => void;
  onUninstallButtonClick: (deviceId: string) => void;
  isLoading: boolean;
};

const DeviceTable: VoidFunctionComponent<Props> = ({
  devices,
  onInstallButtonClick,
  onUninstallButtonClick,
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
        </Tr>
      </Thead>
      <Tbody>
        {devices.map((device) => {
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
                  {device.host}
                </Text>
              </Td>
              <Td>{device.zone.name}</Td>
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
                      isDisabled={isLoading}
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
                      isDisabled={isLoading}
                      onClick={() => {
                        onInstallButtonClick(device.id);
                      }}
                    >
                      Install
                    </Button>
                  )}
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
