import React, { VoidFunctionComponent } from 'react';
import { Icon, IconButton, HStack, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import FeatherIcon from 'feather-icons-react';
import { VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';

type Props = {
  sites: VpnSite[];
  onEditSiteButtonClick: (siteId: string) => void;
  onDeleteSiteButtonClick: (siteId: string) => void;
};

const SiteTable: VoidFunctionComponent<Props> = ({ sites, onEditSiteButtonClick, onDeleteSiteButtonClick }) => {
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
                    variant="unstyled"
                    icon={<Icon size={12} as={EditIcon} />}
                    onClick={() => onEditSiteButtonClick(unwrap(site.siteId))}
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
