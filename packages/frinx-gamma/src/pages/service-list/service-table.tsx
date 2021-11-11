import { HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, Tooltip } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { VpnService } from '../../components/forms/service-types';
import unwrap from '../../helpers/unwrap';

type Props = {
  services: VpnService[];
  onEditServiceButtonClick: (serviceId: string) => void;
  onDeleteServiceButtonClick: (serviceId: string) => void;
};

const ServiceTable: VoidFunctionComponent<Props> = ({
  services,
  onEditServiceButtonClick,
  onDeleteServiceButtonClick,
}) => {
  return (
    <Table background="white" size="lg" marginBottom="12">
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
                <Text as="span" fontWeight={600}>
                  {service.vpnId}
                </Text>
              </Td>
              <Td>
                <Text as="span">{service.customerName}</Text>
              </Td>
              <Td>{service.defaultCVlan === 'custom' ? service.customCVlan : service.defaultCVlan}</Td>
              <Td>
                <HStack>
                  <Tooltip label="Edit Service">
                    <IconButton
                      aria-label="edit"
                      size="sm"
                      icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                      onClick={() => onEditServiceButtonClick(unwrap(service.vpnId))}
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
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default ServiceTable;
