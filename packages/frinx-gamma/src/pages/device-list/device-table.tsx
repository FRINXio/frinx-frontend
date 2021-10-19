import React, { VoidFunctionComponent } from 'react';
import { Icon, IconButton, HStack, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import FeatherIcon from 'feather-icons-react';
import { VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';

type Props = {
  site: VpnSite;
  onEditDeviceButtonClick: (siteId: string, deviceId: string) => void;
  onDeleteDeviceButtonClick: (siteId: string) => void;
};

const DeviceTable: VoidFunctionComponent<Props> = ({ site, onEditDeviceButtonClick, onDeleteDeviceButtonClick }) => {
  return (
    <Table background="white" size="lg">
      <Thead>
        <Tr>
          <Th>Id</Th>
          <Th>Location ID</Th>
          <Th>Management IP</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {site.siteDevices.map((device) => {
          return (
            <Tr key={device.deviceId}>
              <Td>
                <Text as="span" fontWeight={600}>
                  {device.deviceId}
                </Text>
              </Td>
              <Td>
                <Text as="span">{device.locationId}</Text>
              </Td>
              <Td>
                <Text as="span">{device.managementIP}</Text>
              </Td>
              <Td>
                <HStack>
                  <IconButton
                    aria-label="edit"
                    size="sm"
                    variant="unstyled"
                    icon={<Icon size={12} as={EditIcon} />}
                    onClick={() => onEditDeviceButtonClick(unwrap(site.siteId), unwrap(device.deviceId))}
                  />
                  <IconButton
                    aria-label="Delete device"
                    size="sm"
                    colorScheme="red"
                    icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                    onClick={() => {
                      onDeleteDeviceButtonClick(unwrap(device.deviceId));
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
