import { HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';

type Props = {
  sites: VpnSite[];
  onEditSiteButtonClick: (siteId: string) => void;
  onDetailSiteButtonClick: (siteId: string) => void;
  onDevicesSiteButtonClick: (siteId: string) => void;
  onDeleteSiteButtonClick: (siteId: string) => void;
};

const SiteTable: VoidFunctionComponent<Props> = ({
  sites,
  onEditSiteButtonClick,
  onDetailSiteButtonClick,
  onDevicesSiteButtonClick,
  onDeleteSiteButtonClick,
}) => {
  return (
    <Table background="white" size="lg">
      <Thead>
        <Tr>
          <Th>Id</Th>
          <Th>Management Type</Th>
          <Th>Maximum Routes</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {sites.map((site) => {
          return (
            <Tr key={site.siteId}>
              <Td>
                <Text as="span" fontWeight={600}>
                  {site.siteId}
                </Text>
              </Td>
              <Td>
                <Text as="span">{site.siteManagementType}</Text>
              </Td>
              <Td>
                <Text as="span">{site.maximumRoutes}</Text>
              </Td>
              <Td>
                <HStack>
                  <IconButton
                    aria-label="edit"
                    size="sm"
                    icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                    onClick={() => onEditSiteButtonClick(unwrap(site.siteId))}
                  />
                  <IconButton
                    aria-label="detail"
                    size="sm"
                    icon={<Icon size={12} as={FeatherIcon} icon="eye" />}
                    onClick={() => onDetailSiteButtonClick(unwrap(site.siteId))}
                  />
                  <IconButton
                    aria-label="devices"
                    size="sm"
                    icon={<Icon size={12} as={FeatherIcon} icon="cpu" />}
                    onClick={() => onDevicesSiteButtonClick(unwrap(site.siteId))}
                  />
                  <IconButton
                    aria-label="Delete site"
                    size="sm"
                    colorScheme="red"
                    icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                    onClick={() => {
                      onDeleteSiteButtonClick(unwrap(site.siteId));
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
