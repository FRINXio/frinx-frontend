import { Flex, HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, Tooltip } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { DefaultCVlanEnum } from '../../components/forms/service-types';
import StatusTag from '../../components/status-tag/status-tag';
import unwrap from '../../helpers/unwrap';
import ServiceDetail from './service-detail';
import { VpnServiceWithStatus } from './service-helpers';

type Props = {
  size: 'sm' | 'md';
  detailId: string | null;
  services: VpnServiceWithStatus[];
  onEditServiceButtonClick?: (serviceId: string) => void;
  onDeleteServiceButtonClick?: (serviceId: string) => void;
  onRowClick: (rowId: string, isOpen: boolean) => void;
};

const ServiceTable: VoidFunctionComponent<Props> = ({
  detailId,
  size,
  services,
  onEditServiceButtonClick,
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
          <Th>Actions</Th>
        </Tr>
      </Thead>
      {services.map((service) => {
        const rowId = unwrap(service.vpnId);
        const isDetailOpen = rowId === detailId;
        return (
          <Tbody key={service.vpnId}>
            <Tr onClick={() => onRowClick(rowId, !isDetailOpen)} _hover={{ cursor: 'pointer', background: 'gray.200' }}>
              <Td>{isDetailOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</Td>
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
              <Td>
                {service.status !== 'DELETED' && (
                  <HStack>
                    {onEditServiceButtonClick ? (
                      <Tooltip label="Edit Service">
                        <IconButton
                          aria-label="edit"
                          size="sm"
                          icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                          onClick={() => onEditServiceButtonClick(unwrap(service.vpnId))}
                        />
                      </Tooltip>
                    ) : null}
                    {onDeleteServiceButtonClick ? (
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
                    ) : null}
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
