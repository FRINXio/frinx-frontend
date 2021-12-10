import { Flex, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, HStack, Tooltip } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import StatusTag from '../../components/status-tag/status-tag';
import BearerDetail from './bearer-detail';
import { VpnBearerWithStatus } from './bearer-helpers';
import unwrap from '../../helpers/unwrap';

type Props = {
  size: 'sm' | 'md';
  bearers: VpnBearerWithStatus[];
  detailId: string | null;
  onDeleteVpnBearerClick: (id: string) => void;
  onEditVpnBearerClick: (id: string) => void;
  onEvcAttachmentSiteClick: (bearerId: string) => void;
  onRowClick: (rowId: string, isOpen: boolean) => void;
};

const VpnBearerTable: VoidFunctionComponent<Props> = ({
  size,
  bearers,
  detailId,
  onEditVpnBearerClick,
  onDeleteVpnBearerClick,
  onEvcAttachmentSiteClick,
  onRowClick,
}) => {
  return (
    <Table background="white" size={size} marginBottom="12">
      <Thead>
        <Tr>
          <Th />
          <Th>Gamma Hublink Id</Th>
          <Th>Description</Th>
          <Th>Node Id</Th>
          <Th>Port Id</Th>
          <Th>EVC Count</Th>
          <Th>Sub. Bandwidth</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      {bearers.map((b) => {
        const rowId = unwrap(b.spBearerReference);
        const isDetailOpen = rowId === detailId;
        return (
          <Tbody key={b.spBearerReference}>
            <Tr onClick={() => onRowClick(rowId, !isDetailOpen)} _hover={{ cursor: 'pointer', background: 'gray.200' }}>
              <Td>{isDetailOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</Td>
              <Td>
                <Flex alignItems="center">
                  <Text as="span" fontWeight={600} paddingRight="4">
                    {b.spBearerReference}
                  </Text>
                  <StatusTag status={b.editStatus} />
                </Flex>
              </Td>
              <Td>{b.description}</Td>
              <Td>{b.neId}</Td>
              <Td>{b.portId}</Td>
              <Td>{b.evcAttachments.length}</Td>
              <Td>{b.evcAttachments.map((a) => a.inputBandwidth).reduce((i, j) => i + j, 0)}</Td>
              <Td>{b.status?.adminStatus?.status}</Td>
              <Td>
                {b.editStatus !== 'DELETED' && (
                  <HStack>
                    <Tooltip label="Edit bearer">
                      <IconButton
                        aria-label="edit"
                        size="sm"
                        icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                        onClick={() => onEditVpnBearerClick(b.spBearerReference)}
                      />
                    </Tooltip>
                    <Tooltip label="Evc Attachments">
                      <IconButton
                        aria-label="evc-attachments"
                        size="sm"
                        icon={<Icon size={12} as={FeatherIcon} icon="anchor" />}
                        onClick={() => onEvcAttachmentSiteClick(b.spBearerReference)}
                      />
                    </Tooltip>
                    <Tooltip label="Delete Bearer">
                      <IconButton
                        aria-label="Delete site"
                        size="sm"
                        colorScheme="red"
                        icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                        onClick={() => {
                          onDeleteVpnBearerClick(b.spBearerReference);
                        }}
                      />
                    </Tooltip>
                  </HStack>
                )}
              </Td>
            </Tr>

            {isDetailOpen && (
              <Tr>
                <Td colSpan={9}>
                  <BearerDetail bearer={b} />
                </Td>
              </Tr>
            )}
          </Tbody>
        );
      })}
    </Table>
  );
};

export default VpnBearerTable;
