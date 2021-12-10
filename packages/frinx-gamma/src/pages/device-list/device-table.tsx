import { HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, Tooltip } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { VpnSite } from '../../components/forms/site-types';
import DeviceDetail from './device-detail';
import unwrap from '../../helpers/unwrap';

type Props = {
  site: VpnSite;
  locationId: string;
  detailId: string | null;
  onEditDeviceButtonClick: (siteId: string, locationId: string, deviceId: string) => void;
  onDeleteDeviceButtonClick: (siteId: string) => void;
  onRowClick: (rowId: string, isOpen: boolean) => void;
};

const DeviceTable: VoidFunctionComponent<Props> = ({
  locationId,
  site,
  detailId,
  onEditDeviceButtonClick,
  onDeleteDeviceButtonClick,
  onRowClick,
}) => {
  const devices = site.siteDevices.filter((d) => d.locationId === locationId);
  return (
    <Table background="white" size="lg" marginBottom="12">
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
      {devices.map((device) => {
        const [deviceLocation] = site.customerLocations.filter((location) => location.locationId === device.locationId);
        const rowId = unwrap(deviceLocation.locationId);
        const isDetailOpen = rowId === detailId;
        return (
          <Tbody key={device.deviceId}>
            <Tr onClick={() => onRowClick(rowId, !isDetailOpen)}>
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
                  <Tooltip label="Edit device">
                    <IconButton
                      aria-label="edit"
                      size="sm"
                      icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                      onClick={() =>
                        onEditDeviceButtonClick(unwrap(site.siteId), unwrap(device.locationId), unwrap(device.deviceId))
                      }
                    />
                  </Tooltip>
                  <Tooltip label="Delete device">
                    <IconButton
                      aria-label="Delete device"
                      size="sm"
                      colorScheme="red"
                      icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                      onClick={() => {
                        onDeleteDeviceButtonClick(unwrap(device.deviceId));
                      }}
                    />
                  </Tooltip>
                </HStack>
              </Td>
            </Tr>
            {isDetailOpen && (
              <Tr>
                <Td colSpan={8}>
                  <DeviceDetail device={device} location={deviceLocation} />
                </Td>
              </Tr>
            )}
          </Tbody>
        );
      })}
    </Table>
  );
};

export default DeviceTable;
