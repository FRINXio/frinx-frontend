import { EditIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { VpnService } from '../../components/forms/service-types';
import unwrap from '../../helpers/unwrap';

type Props = {
  services: VpnService[];
  onEditServiceButtonClick: (serviceId: string) => void;
  onDeleteServiceButtonClick: (serviceId: string) => void;
  onCommitBtnClick: () => void;
};

const ServiceTable: VoidFunctionComponent<Props> = ({
  services,
  onEditServiceButtonClick,
  onDeleteServiceButtonClick,
  onCommitBtnClick,
}) => {
  return (
    <Table background="white" size="lg">
      <Thead>
        <Tr>
          <Th>Id</Th>
          <Th>Customer Name</Th>
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
              <Td>
                <HStack>
                  <IconButton
                    aria-label="commit"
                    size="sm"
                    colorScheme="blue"
                    icon={<Icon size={12} as={PlusSquareIcon} />}
                    onClick={onCommitBtnClick}
                  />
                  <IconButton
                    aria-label="edit"
                    size="sm"
                    variant="unstyled"
                    icon={<Icon size={12} as={EditIcon} />}
                    onClick={() => onEditServiceButtonClick(unwrap(service.vpnId))}
                  />
                  <IconButton
                    aria-label="Delete service"
                    size="sm"
                    colorScheme="red"
                    icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                    onClick={() => {
                      onDeleteServiceButtonClick(unwrap(service.vpnId));
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

export default ServiceTable;
