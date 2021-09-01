import React, { VoidFunctionComponent } from 'react';
import { Badge, Button, HStack, IconButton, Icon, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { AddIcon, MinusIcon, SettingsIcon } from '@chakra-ui/icons';
import { DevicesQuery } from '../../__generated__/graphql';
import { ServiceState } from '../../helpers/types';

type Props = {
  devices: DevicesQuery['devices']['edges'] | undefined;
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
          <Th>Zone</Th>
          <Th>Service state</Th>
          <Th>Actions</Th>
          <Th>Config</Th>
        </Tr>
      </Thead>
      <Tbody>
        {(devices == null || devices.length === 0) && (
          <Tr>
            <Td>There are no devices!</Td>
          </Tr>
        )}
        {devices &&
          devices.map(({ node: device }) => {
            const isInstalled = device.serviceState === ServiceState.IN_SERVICE;

            return (
              <Tr key={device.id}>
                <Td>
                  <Text as="span" fontWeight={600}>
                    {device.name}
                  </Text>
                </Td>
                <Td>{device.zone?.name}</Td>
                <Td minWidth={200}>
                  <Badge colorScheme={isInstalled ? 'green' : 'yellow'}>{device.serviceState}</Badge>
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
                    isDisabled={device.serviceState !== ServiceState.IN_SERVICE}
                    variant="unstyled"
                    icon={<Icon size={20} as={SettingsIcon} />}
                    onClick={() => onSettingsButtonClick(device.id)}
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
