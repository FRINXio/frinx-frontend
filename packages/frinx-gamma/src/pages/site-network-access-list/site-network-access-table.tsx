import React, { VoidFunctionComponent } from 'react';
import { Icon, IconButton, HStack, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import FeatherIcon from 'feather-icons-react';
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
                    variant="unstyled"
                    icon={<Icon size={12} as={EditIcon} />}
                    onClick={() => onEditSiteNetworkAccessButtonClick(unwrap(site.siteId), access.siteNetworkAccessId)}
                  />
                  <IconButton
                    aria-label="Delete site"
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
