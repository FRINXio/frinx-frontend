import { Flex, HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, Tooltip } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { SiteNetworkAccessWithStatus } from './site-network-access-helpers';
import StatusTag from '../../components/status-tag/status-tag';
import SiteNetworkAccessDetail from './site-network-access-detail';
import unwrap from '../../helpers/unwrap';

type Props = {
  size: 'sm' | 'md';
  siteId: string;
  detailId: string | null;
  networkAccesses: SiteNetworkAccessWithStatus[];
  onEditSiteNetworkAccessButtonClick: (siteId: string, accessId: string) => void;
  onDeleteSiteNetworkAccessButtonClick: (siteId: string) => void;
  onRowClick: (rowId: string, isOpen: boolean) => void;
};

const SiteTable: VoidFunctionComponent<Props> = ({
  size,
  siteId,
  detailId,
  networkAccesses,
  onEditSiteNetworkAccessButtonClick,
  onDeleteSiteNetworkAccessButtonClick,
  onRowClick,
}) => {
  return (
    <Table background="white" size={size} marginBottom="12">
      <Thead>
        <Tr>
          <Th>Id</Th>
          <Th>Access Type</Th>
          <Th>Access Priority</Th>
          <Th>Maximum Routes</Th>
          <Th>Location Id</Th>
          <Th>Device Id</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      {networkAccesses.map((access) => {
        const rowId = unwrap(access.siteNetworkAccessId);
        const isDetailOpen = rowId === detailId;
        return (
          <Tbody key={access.siteNetworkAccessId}>
            <Tr onClick={() => onRowClick(rowId, !isDetailOpen)}>
              <Td>
                <Flex alignItems="center">
                  <Text as="span" fontWeight={600}>
                    {access.siteNetworkAccessId}
                  </Text>
                  <StatusTag status={access.status} />
                </Flex>
              </Td>
              <Td>
                <Text as="span">{access.siteNetworkAccessType}</Text>
              </Td>
              <Td>
                <Text as="span">{access.accessPriority}</Text>
              </Td>
              <Td>
                <Text as="span">{access.maximumRoutes}</Text>
              </Td>
              <Td>
                <Text as="span">{access.locationReference}</Text>
              </Td>
              <Td>
                <Text as="span">{access.deviceReference}</Text>
              </Td>
              <Td>
                <HStack>
                  <Tooltip label="Edit site network access">
                    <IconButton
                      aria-label="edit"
                      size="sm"
                      icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                      onClick={() => onEditSiteNetworkAccessButtonClick(siteId, access.siteNetworkAccessId)}
                    />
                  </Tooltip>
                  <Tooltip label="Delete site network access">
                    <IconButton
                      aria-label="Delete network access"
                      size="sm"
                      colorScheme="red"
                      icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                      onClick={() => {
                        onDeleteSiteNetworkAccessButtonClick(access.siteNetworkAccessId);
                      }}
                    />
                  </Tooltip>
                </HStack>
              </Td>
            </Tr>
            {isDetailOpen && (
              <Tr>
                <Td colSpan={8}>
                  <SiteNetworkAccessDetail networkAccess={access} />
                </Td>
              </Tr>
            )}
          </Tbody>
        );
      })}
    </Table>
  );
};

export default SiteTable;
