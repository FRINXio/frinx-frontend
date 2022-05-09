import {
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import StatusTag from '../../components/status-tag/status-tag';
import unwrap from '../../helpers/unwrap';
import BearerDetail from './bearer-detail';
import { VpnBearerWithStatus } from './bearer-helpers';

function hasEvcAttachments(bearer: VpnBearerWithStatus): boolean {
  return bearer.evcAttachments.length > 0;
}

type Props = {
  size: 'sm' | 'md';
  bearers: VpnBearerWithStatus[];
  detailId: string | null;
  onDeleteVpnBearerClick: (id: string) => void;
  onRowClick: (rowId: string, isOpen: boolean) => void;
};

const VpnBearerTable: VoidFunctionComponent<Props> = ({
  size,
  bearers,
  detailId,
  onDeleteVpnBearerClick,
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
          <Th>Carrier reference</Th>
          <Th>Sub. Bandwidth</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      {bearers.map((b) => {
        const rowId = unwrap(b.spBearerReference);
        const isDetailOpen = rowId === detailId;
        const isDeleteDisabled = hasEvcAttachments(b);
        return (
          <Tbody key={b.spBearerReference}>
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
                    {b.spBearerReference}
                  </Text>
                  <StatusTag status={b.editStatus} />
                </Flex>
              </Td>
              <Td>{b.description}</Td>
              <Td>{b.neId}</Td>
              <Td>{b.portId}</Td>
              <Td>{b.carrier?.carrierReference}</Td>
              <Td>{b.evcAttachments.map((a) => a.inputBandwidth).reduce((i, j) => i + j, 0)}</Td>
              <Td>{b.status?.adminStatus?.status}</Td>
              <Td>
                {b.editStatus !== 'DELETED' && (
                  <HStack>
                    <Menu size="sm">
                      <MenuButton size="sm" as={Button} rightIcon={<Icon as={FeatherIcon} icon="chevron-down" />}>
                        Manage
                      </MenuButton>
                      <Portal>
                        <MenuList>
                          <MenuItem
                            as={Link}
                            to={`${b.spBearerReference}/evc-attachments`}
                            icon={<Icon size={12} as={FeatherIcon} icon="anchor" />}
                          >
                            Evc attachments
                          </MenuItem>
                        </MenuList>
                      </Portal>
                    </Menu>
                    <Tooltip label="Edit bearer">
                      <IconButton
                        colorScheme="blue"
                        aria-label="edit"
                        size="sm"
                        as={Link}
                        icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                        to={`edit/${b.spBearerReference}`}
                      />
                    </Tooltip>
                    <Tooltip
                      shouldWrapChildren
                      label={isDeleteDisabled ? 'First remove evc attachments for this bearer' : 'Delete Bearer'}
                    >
                      <IconButton
                        aria-label="Delete site"
                        size="sm"
                        colorScheme="red"
                        icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                        onClick={() => {
                          onDeleteVpnBearerClick(b.spBearerReference);
                        }}
                        isDisabled={isDeleteDisabled}
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
