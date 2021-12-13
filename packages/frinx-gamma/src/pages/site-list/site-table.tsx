import { Flex, HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, Tooltip } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import StatusTag from '../../components/status-tag/status-tag';
import unwrap from '../../helpers/unwrap';
import SiteDetail from './site-detail';
import { VpnSiteWithStatus } from './site-helpers';

type Props = {
  size: 'sm' | 'md';
  sites: VpnSiteWithStatus[];
  detailId: string | null;
  onEditSiteButtonClick: (siteId: string) => void;
  onDetailSiteButtonClick: (siteId: string) => void;
  onLocationsSiteButtonClick: (siteId: string) => void;
  onDeleteSiteButtonClick: (siteId: string) => void;
  onRowClick: (rowId: string, isOpen: boolean) => void;
};

const SiteTable: VoidFunctionComponent<Props> = ({
  size,
  sites,
  detailId,
  onEditSiteButtonClick,
  onDetailSiteButtonClick,
  onLocationsSiteButtonClick,
  onDeleteSiteButtonClick,
  onRowClick,
}) => {
  return (
    <Table background="white" size={size}>
      <Thead>
        <Tr>
          <Th />
          <Th>Id</Th>
          <Th>Management Type</Th>
          <Th>Site Vpn Flavour</Th>
          <Th>Maximum Routes</Th>
          <Th>Enable BGP PIC Reroute</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      {sites.map((site) => {
        const rowId = unwrap(site.siteId);
        const isDetailOpen = rowId === detailId;
        return (
          <Tbody key={rowId}>
            <Tr onClick={() => onRowClick(rowId, !isDetailOpen)} _hover={{ cursor: 'pointer', background: 'gray.200' }}>
              <Td>{isDetailOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</Td>
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
              <Td>
                <Text as="span">{site.siteVpnFlavor}</Text>
              </Td>
              <Td>
                <Text as="span">{site.siteServiceQosProfile}</Text>
              </Td>
              <Td>
                <Text as="span">{site.enableBgpPicFastReroute}</Text>
              </Td>
              <Td>
                {site.status !== 'DELETED' && (
                  <HStack>
                    <Tooltip label="Edit Site">
                      <IconButton
                        aria-label="edit"
                        size="sm"
                        icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                        onClick={() => onEditSiteButtonClick(unwrap(site.siteId))}
                      />
                    </Tooltip>
                    <Tooltip label="Site Detail">
                      <IconButton
                        aria-label="detail"
                        size="sm"
                        icon={<Icon size={12} as={FeatherIcon} icon="eye" />}
                        onClick={() => onDetailSiteButtonClick(unwrap(site.siteId))}
                      />
                    </Tooltip>
                    <Tooltip label="Site Locations">
                      <IconButton
                        aria-label="devices"
                        size="sm"
                        icon={<Icon size={12} as={FeatherIcon} icon="crosshair" />}
                        onClick={() => onLocationsSiteButtonClick(unwrap(site.siteId))}
                      />
                    </Tooltip>
                    <Tooltip label="Delete Site">
                      <IconButton
                        aria-label="Delete site"
                        size="sm"
                        colorScheme="red"
                        icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                        onClick={() => {
                          onDeleteSiteButtonClick(unwrap(site.siteId));
                        }}
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
