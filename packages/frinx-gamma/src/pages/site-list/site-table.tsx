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
import SiteDetail from './site-detail';
import { VpnSiteWithStatus } from './site-helpers';

type Props = {
  size: 'sm' | 'md';
  sites: VpnSiteWithStatus[];
  detailId: string | null;
  onDeleteSiteButtonClick: (siteId: string) => void;
  onRowClick: (rowId: string, isOpen: boolean) => void;
};

function hasNetworkAcceesses(site: VpnSiteWithStatus): boolean {
  return site.siteNetworkAccesses.length > 0;
}

const SiteTable: VoidFunctionComponent<Props> = ({ size, sites, detailId, onDeleteSiteButtonClick, onRowClick }) => {
  return (
    <Table background="white" size={size}>
      <Thead>
        <Tr>
          <Th />
          <Th>Id</Th>
          <Th>Management Type</Th>
          {/* <Th>Site Vpn Flavour</Th> */}
          <Th>Maximum Routes</Th>
          <Th>Enable BGP PIC Reroute</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      {sites.map((site) => {
        const rowId = unwrap(site.siteId);
        const isDetailOpen = rowId === detailId;
        const isDeleteDisabled = hasNetworkAcceesses(site);
        return (
          <Tbody key={rowId}>
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
                    {site.siteId}
                  </Text>
                  <StatusTag status={site.status} />
                </Flex>
              </Td>
              <Td>
                <Text as="span">{site.siteManagementType}</Text>
              </Td>
              {/* <Td>
                <Text as="span">{site.siteVpnFlavor}</Text>
              </Td> */}
              <Td>
                <Text as="span">{site.maximumRoutes}</Text>
              </Td>
              <Td>
                <Text as="span">{site.enableBgpPicFastReroute}</Text>
              </Td>
              <Td>
                {site.status !== 'DELETED' && (
                  <HStack>
                    <Menu size="sm">
                      <MenuButton size="sm" as={Button} rightIcon={<Icon as={FeatherIcon} icon="chevron-down" />}>
                        Manage
                      </MenuButton>
                      <Portal>
                        <MenuList>
                          <MenuItem
                            as={Link}
                            to={`${rowId}/locations`}
                            icon={<Icon size={12} as={FeatherIcon} icon="map-pin" />}
                          >
                            Locations
                          </MenuItem>
                          <MenuItem
                            as={Link}
                            to={`${rowId}/devices`}
                            icon={<Icon size={12} as={FeatherIcon} icon="hard-drive" />}
                          >
                            Devices
                          </MenuItem>
                          <MenuItem
                            as={Link}
                            to={`detail/${rowId}`}
                            icon={<Icon size={12} as={FeatherIcon} icon="share-2" />}
                          >
                            Site network accesses
                          </MenuItem>
                        </MenuList>
                      </Portal>
                    </Menu>
                    <Tooltip label="Edit Site">
                      <IconButton
                        aria-label="edit"
                        colorScheme="blue"
                        size="sm"
                        icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                        as={Link}
                        to={`edit/${rowId}`}
                      />
                    </Tooltip>
                    <Tooltip
                      shouldWrapChildren
                      label={isDeleteDisabled ? 'First remove all site network accesses' : 'Delete Site'}
                    >
                      <IconButton
                        aria-label="Delete site"
                        size="sm"
                        colorScheme="red"
                        icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                        onClick={() => {
                          onDeleteSiteButtonClick(unwrap(site.siteId));
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
                <Td colSpan={7}>
                  <SiteDetail site={site} />
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
