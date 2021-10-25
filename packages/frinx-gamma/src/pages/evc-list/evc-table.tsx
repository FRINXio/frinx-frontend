import { HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { VpnBearer } from '../../components/forms/bearer-types';

type Props = {
  bearer: VpnBearer;
  onEditEvcButtonClick: (bearerId: string, evcType: string, circuitReference: string) => void;
  onDeleteEvcButtonClick: (evcType: string, circuitReference: string) => void;
};

const EvcTable: VoidFunctionComponent<Props> = ({ bearer, onEditEvcButtonClick, onDeleteEvcButtonClick }) => {
  return (
    <Table background="white" size="lg">
      <Thead>
        <Tr>
          <Th>Evc Type</Th>
          <Th>Circuit Reference</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {bearer.evcAttachments.map((evc) => {
          return (
            <Tr key={`${evc.evcType}${evc.circuitReference}`}>
              <Td>
                <Text as="span" fontWeight={600}>
                  {evc.evcType}
                </Text>
              </Td>
              <Td>
                <Text as="span">{evc.circuitReference}</Text>
              </Td>
              <Td>
                <HStack>
                  <IconButton
                    aria-label="edit"
                    size="sm"
                    icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                    onClick={() => onEditEvcButtonClick(bearer.spBearerReference, evc.evcType, evc.circuitReference)}
                  />
                  <IconButton
                    aria-label="Delete evc"
                    size="sm"
                    colorScheme="red"
                    icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                    onClick={() => {
                      onDeleteEvcButtonClick(evc.evcType, evc.circuitReference);
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

export default EvcTable;
