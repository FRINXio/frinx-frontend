import { HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';

type Props = {
  site: VpnSite;
  locationId: string;
  onEditDeviceButtonClick: (siteId: string, locationId: string, deviceId: string) => void;
  onDeleteDeviceButtonClick: (siteId: string) => void;
};

const DeviceTable: VoidFunctionComponent<Props> = ({
  locationId,
  site,
  onEditDeviceButtonClick,
  onDeleteDeviceButtonClick,
}) => {
  const devices = site.siteDevices.filter((d) => d.locationId === locationId);
  return (
    <Table background="white" size="lg">
      <Thead>
        <Tr>
          <Th>Id</Th>
          <Th>Location ID</Th>
          <Th>Street</Th>
          <Th>State</Th>
          <Th>Management IP</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {devices.map((device) => {
          const [deviceLocation] = site.customerLocations.filter(
            (location) => location.locationId === device.locationId,
          );
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
                <Text as="span">{deviceLocation?.street || '-'}</Text>
              </Td>
              <Td>
                <Text as="span">{deviceLocation?.state || '-'}</Text>
              </Td>
              <Td>{device.managementIP || '-'}</Td>
              <Td>
                <HStack>
                  <IconButton
                    aria-label="edit"
                    size="sm"
                    icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                    onClick={() =>
                      onEditDeviceButtonClick(unwrap(site.siteId), unwrap(device.locationId), unwrap(device.deviceId))
                    }
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
