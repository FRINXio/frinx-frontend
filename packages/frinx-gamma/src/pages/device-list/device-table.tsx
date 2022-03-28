import { Flex, HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, Tooltip } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import StatusTag from '../../components/status-tag/status-tag';
import { VpnSite } from '../../components/forms/site-types';
import DeviceDetail from './device-detail';
import unwrap from '../../helpers/unwrap';
import { SiteDeviceWithStatus } from './device-helpers';

type Props = {
  size: 'sm' | 'md';
  site: VpnSite;
  locationId: string | null;
  devices: SiteDeviceWithStatus[];
  detailId: string | null;
  onDeleteDeviceButtonClick: (siteId: string) => void;
  onRowClick: (rowId: string, isOpen: boolean) => void;
};

const DeviceTable: VoidFunctionComponent<Props> = ({
  size,
  devices,
  site,
  locationId,
  detailId,
  onDeleteDeviceButtonClick,
  onRowClick,
}) => {
  return (
    <Table background="white" size={size} marginBottom="12">
      <Thead>
        <Tr>
          <Th />
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
        const rowId = unwrap(device.deviceId);
        const isDetailOpen = rowId === detailId;
        return (
          <Tbody key={device.deviceId}>
            <Tr onClick={() => onRowClick(rowId, !isDetailOpen)} _hover={{ cursor: 'pointer', background: 'gray.200' }}>
              <Td>{isDetailOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</Td>
              <Td>
                <Flex alignItems="center">
                  <Text as="span" fontWeight={600}>
                    {device.deviceId}
                  </Text>
                  <StatusTag status={device.status} />
                </Flex>
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
                      as={Link}
                      to={
                        locationId
                          ? `../sites/${site.siteId}/${locationId}/devices/edit/${device.deviceId}`
                          : `../sites/${site.siteId}/devices/edit/${device.deviceId}`
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
                <Td colSpan={7}>
                  <DeviceDetail site={site} device={device} location={deviceLocation} />
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
