import { HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { VpnBearer } from '../../components/forms/bearer-types';
import StatusTag from '../../components/status-tag/status-tag';
import unwrap from '../../helpers/unwrap';
import EvcDetail from './evc-detail';
import { EvcAttachmentWithStatus } from './evc-helpers';

type Props = {
  size: 'sm' | 'md';
  bearer: VpnBearer;
  evcAttachments: EvcAttachmentWithStatus[];
  detailId: string | null;
  onDeleteEvcButtonClick: (evcType: string, circuitReference: string) => void;
  onRowClick: (rowId: string, isOpen: boolean) => void;
};

const EvcTable: VoidFunctionComponent<Props> = ({
  size,
  bearer,
  evcAttachments,
  detailId,
  onDeleteEvcButtonClick,
  onRowClick,
}) => {
  return (
    <Table background="white" size={size} marginBottom="12">
      <Thead>
        <Tr>
          <Th />
          <Th />
          <Th>BMT Circuit Reference</Th>
          <Th>Carrier Reference</Th>
          <Th>Svlan Id</Th>
          <Th>Input Bandwidth</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      {evcAttachments.map((evc) => {
        const rowId = unwrap(evc.circuitReference);
        const isDetailOpen = rowId === detailId;
        return (
          <Tbody key={`${evc.evcType}${evc.circuitReference}`}>
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
                <StatusTag status={evc.evcStatus} />
              </Td>
              <Td>
                <Text as="span">{evc.circuitReference}</Text>
              </Td>
              <Td>
                <Text as="span">{evc.carrierReference}</Text>
              </Td>
              <Td>
                <Text as="span">{evc.svlanId}</Text>
              </Td>
              <Td>
                <Text as="span">{evc.inputBandwidth}</Text>
              </Td>
              <Td>
                {evc.evcStatus !== 'DELETED' && (
                  <HStack>
                    <Tooltip label="Edit Evc Attachment">
                      <IconButton
                        aria-label="edit"
                        colorScheme="blue"
                        size="sm"
                        icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                        as={Link}
                        to={`../vpn-bearers/${bearer.spBearerReference}/evc-attachments/edit/${evc.evcType}/${evc.circuitReference}`}
                      />
                    </Tooltip>
                    <Tooltip label="Delete Evc Attachment">
                      <IconButton
                        aria-label="Delete evc"
                        size="sm"
                        colorScheme="red"
                        icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                        onClick={() => {
                          onDeleteEvcButtonClick(evc.evcType, evc.circuitReference);
                        }}
                      />
                    </Tooltip>
                  </HStack>
                )}
              </Td>
            </Tr>
            {isDetailOpen && (
              <Tr>
                <Td colSpan={4}>
                  <EvcDetail evc={evc} />
                </Td>
              </Tr>
            )}
          </Tbody>
        );
      })}
    </Table>
  );
};

export default EvcTable;
