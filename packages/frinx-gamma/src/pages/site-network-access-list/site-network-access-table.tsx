import { HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';

type Props = {
  site: VpnSite;
  onEditSiteNetworkAccessButtonClick: (siteId: string, accessId: string) => void;
  onDeleteSiteNetworkAccessButtonClick: (siteId: string) => void;
};

const SiteTable: VoidFunctionComponent<Props> = ({
  site,
  onEditSiteNetworkAccessButtonClick,
  onDeleteSiteNetworkAccessButtonClick,
}) => {
  return (
    <Table background="white" size="lg">
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
        {site.siteNetworkAccesses.map((access) => {
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
                  <IconButton
                    aria-label="edit"
                    size="sm"
                    icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                    onClick={() => onEditSiteNetworkAccessButtonClick(unwrap(site.siteId), access.siteNetworkAccessId)}
                  />
                  <IconButton
                    aria-label="Delete network access"
                    size="sm"
                    colorScheme="red"
                    icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                    onClick={() => {
                      onDeleteSiteNetworkAccessButtonClick(unwrap(site.siteId));
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

export default SiteTable;
