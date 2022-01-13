import { Flex, HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, Tooltip } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { VpnBearer } from '../../components/forms/bearer-types';
import StatusTag from '../../components/status-tag/status-tag';
import EvcDetail from './evc-detail';
import unwrap from '../../helpers/unwrap';
import { EvcAttachmentWithStatus } from './evc-helpers';

type Props = {
  size: 'sm' | 'md';
  bearer: VpnBearer;
  evcAttachments: EvcAttachmentWithStatus[];
  detailId: string | null;
  onEditEvcButtonClick: (bearerId: string, evcType: string, circuitReference: string) => void;
  onDeleteEvcButtonClick: (evcType: string, circuitReference: string) => void;
  onRowClick: (rowId: string, isOpen: boolean) => void;
};

const EvcTable: VoidFunctionComponent<Props> = ({
  size,
  bearer,
  evcAttachments,
  detailId,
  onEditEvcButtonClick,
  onDeleteEvcButtonClick,
  onRowClick,
}) => {
  return (
    <Table background="white" size={size} marginBottom="12">
      <Thead>
        <Tr>
          <Th />
          <Th>Evc Type</Th>
          <Th>Circuit Reference</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      {evcAttachments.map((evc) => {
        const rowId = unwrap(evc.circuitReference);
        const isDetailOpen = rowId === detailId;
        return (
          <Tbody key={`${evc.evcType}${evc.circuitReference}`}>
            <Tr onClick={() => onRowClick(rowId, !isDetailOpen)} _hover={{ cursor: 'pointer', background: 'gray.200' }}>
              <Td>{isDetailOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</Td>
              <Td>
                <Flex alignItems="center">
                  <Text as="span" fontWeight={600}>
                    {evc.evcType}
                  </Text>
                  <StatusTag status={evc.evcStatus} />
                </Flex>
              </Td>
              <Td>
                <Text as="span">{evc.circuitReference}</Text>
              </Td>
              <Td>
                {evc.evcStatus !== 'DELETED' && (
                  <HStack>
                    <Tooltip label="Edit Evc Attachment">
                      <IconButton
                        aria-label="edit"
                        size="sm"
                        icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                        onClick={() =>
                          onEditEvcButtonClick(bearer.spBearerReference, evc.evcType, evc.circuitReference)
                        }
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
