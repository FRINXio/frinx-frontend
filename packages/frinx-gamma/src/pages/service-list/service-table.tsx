import { Flex, HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { DefaultCVlanEnum } from '../../components/forms/service-types';
import StatusTag from '../../components/status-tag/status-tag';
import unwrap from '../../helpers/unwrap';
import ServiceDetail from './service-detail';
import { VpnServiceWithStatus } from './service-helpers';

type Props = {
  size: 'sm' | 'md';
  detailId: string | null;
  services: VpnServiceWithStatus[];
  onDeleteServiceButtonClick: (serviceId: string) => void;
  onRowClick: (rowId: string, isOpen: boolean) => void;
};

const ServiceTable: VoidFunctionComponent<Props> = ({
  detailId,
  size,
  services,
  onDeleteServiceButtonClick,
  onRowClick,
}) => {
  // CvlanEnum map with swapped keys and values
  const swappedDefaultCVlanEnumMap = new Map([
    ...Object.entries(DefaultCVlanEnum).map<[DefaultCVlanEnum, string]>(([key, value]) => [value, key]),
  ]);

  return (
    <Table background="white" size={size}>
      <Thead>
        <Tr>
          <Th />
          <Th>VPN ID</Th>
          <Th>Customer Name / VPN Description</Th>
          <Th>Vpn Service Topology</Th>
          <Th>Default CVlan</Th>
          <Th>Extranets</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      {services.map((service) => {
        const rowId = unwrap(service.vpnId);
        const isDetailOpen = rowId === detailId;
        return (
          <Tbody key={service.vpnId}>
            <Tr _hover={{ background: 'gray.200' }}>
              <Td>
                <IconButton
                  size="sm"
                  onClick={() => {
                    onRowClick(rowId, !isDetailOpen);
                  }}
                  aria-label="toggle details"
                  icon={<Icon as={FeatherIcon} icon={isDetailOpen ? 'chevron-up' : 'chevron-down'} />}
                />
              </Td>
              <Td>
                <Flex alignItems="center">
                  <Text as="span" fontWeight={600} paddingRight="4">
                    {service.vpnId}
                  </Text>
                  <StatusTag status={service.status} />
                </Flex>
              </Td>
              <Td>
                <Text as="span">{service.customerName}</Text>
              </Td>
              <Td>{service.vpnServiceTopology}</Td>
              <Td>{`${swappedDefaultCVlanEnumMap.get(service.defaultCVlan)} (${
                service.defaultCVlan === 'custom' ? service.customCVlan : service.defaultCVlan
              })`}</Td>
              {/* we will show only first 5 extranet items, we do not expect more */}
              <Td>{service.extranetVpns.slice(0, 5).join(', ')}</Td>
              <Td>
                {service.status !== 'DELETED' && (
                  <HStack>
                    <Tooltip label="Edit Service">
                      <IconButton
                        aria-label="edit"
                        colorScheme="blue"
                        size="sm"
                        as={Link}
                        to={`edit/${service.vpnId}`}
                        icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                      />
                    </Tooltip>
                    <Tooltip label="Delete Service">
                      <IconButton
                        aria-label="Delete service"
                        size="sm"
                        colorScheme="red"
                        icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                        onClick={() => {
                          onDeleteServiceButtonClick(unwrap(service.vpnId));
                        }}
                      />
                    </Tooltip>
                  </HStack>
                )}
              </Td>
            </Tr>
            {isDetailOpen && (
              <Tr>
                <Td colSpan={6}>
                  <ServiceDetail service={service} />
                </Td>
              </Tr>
            )}
          </Tbody>
        );
      })}
    </Table>
  );
};

export default ServiceTable;
