import { Flex, HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, Tooltip } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { DefaultCVlanEnum } from '../../components/forms/service-types';
import StatusTag from '../../components/status-tag/status-tag';
import unwrap from '../../helpers/unwrap';
import { VpnServiceWithStatus } from './service-helpers';

type Props = {
  size: 'sm' | 'md';
  services: VpnServiceWithStatus[];
  onEditServiceButtonClick?: (serviceId: string) => void;
  onDeleteServiceButtonClick?: (serviceId: string) => void;
};

const ServiceTable: VoidFunctionComponent<Props> = ({
  size,
  services,
  onEditServiceButtonClick,
  onDeleteServiceButtonClick,
}) => {
  // CvlanEnum map with swapped keys and values
  const swappedDefaultCVlanEnumMap = new Map([
    ...Object.entries(DefaultCVlanEnum).map<[DefaultCVlanEnum, string]>(([key, value]) => [value, key]),
  ]);

  return (
    <Table background="white" size={size}>
      <Thead>
        <Tr>
          <Th>Id</Th>
          <Th>Customer Name</Th>
          <Th>Default CVlan</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {services.map((service) => {
          return (
            <Tr key={service.vpnId}>
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
          );
        })}
      </Tbody>
    </Table>
  );
};

export default ServiceTable;
