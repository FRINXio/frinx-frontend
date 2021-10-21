import { Icon, IconButton, Table, Tbody, Td, Th, Thead, Tr, HStack } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { VpnBearer } from '../../components/forms/bearer-types';

type Props = {
  bearers: VpnBearer[];
  onDeleteVpnBearerClick: (id: string) => void;
  onEditVpnBearerClick: (id: string) => void;
};

const VpnBearerTable: VoidFunctionComponent<Props> = ({ bearers, onEditVpnBearerClick, onDeleteVpnBearerClick }) => {
  return (
    <Table background="white" size="lg">
      <Thead>
        <Tr>
          <Th>Id</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {bearers.map((b) => (
          <Tr key={b.spBearerReference}>
            <Td>{b.spBearerReference}</Td>
            <Td>{b.status?.adminStatus?.status}</Td>
            <Td>
              <HStack>
                <IconButton
                  aria-label="edit"
                  size="sm"
                  icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                  onClick={() => onEditVpnBearerClick(b.spBearerReference)}
                />
                <IconButton
                  aria-label="Delete site"
                  size="sm"
                  colorScheme="red"
                  icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                  onClick={() => {
                    onDeleteVpnBearerClick(b.spBearerReference);
                  }}
                />
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default VpnBearerTable;
