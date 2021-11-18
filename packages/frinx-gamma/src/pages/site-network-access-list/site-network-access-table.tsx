import { HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, Tooltip } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { SiteNetworkAccess } from '../../components/forms/site-types';

type Props = {
  siteId: string;
  networkAccesses: SiteNetworkAccess[];
  onEditSiteNetworkAccessButtonClick: (siteId: string, accessId: string) => void;
  onDeleteSiteNetworkAccessButtonClick: (siteId: string) => void;
};

const SiteTable: VoidFunctionComponent<Props> = ({
  siteId,
  networkAccesses,
  onEditSiteNetworkAccessButtonClick,
  onDeleteSiteNetworkAccessButtonClick,
}) => {
  return (
    <Table background="white" size="lg" marginBottom="12">
      <Thead>
        <Tr>
          <Th>Id</Th>
          <Th>Access Type</Th>
          <Th>Access Priority</Th>
          <Th>Maximum Routes</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {networkAccesses.map((access) => {
          return (
            <Tr key={access.siteNetworkAccessId}>
              <Td>
                <Text as="span" fontWeight={600}>
                  {access.siteNetworkAccessId}
                </Text>
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
          );
        })}
      </Tbody>
    </Table>
  );
};

export default SiteTable;
