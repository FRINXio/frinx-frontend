import { HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, Tooltip } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { CustomerLocation, VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';
import LocationDetail from './location-detail';

type Props = {
  site: VpnSite;
  detailId: string | null;
  locations: CustomerLocation[];
  onEditLocationButtonClick: (siteId: string, locationId: string) => void;
  onDeleteLocationButtonClick: (siteId: string) => void;
  onDevicesSiteButtonClick: (siteId: string, locationId: string) => void;
  onRowClick: (rowId: string, isOpen: boolean) => void;
};

const LocationTable: VoidFunctionComponent<Props> = ({
  site,
  detailId,
  locations,
  onDeleteLocationButtonClick,
  onEditLocationButtonClick,
  onDevicesSiteButtonClick,
  onRowClick,
}) => {
  return (
    <Table background="white" size="lg" marginBottom="12">
      <Thead>
        <Tr>
          <Th />
          <Th>Id</Th>
          <Th>Street</Th>
          <Th>Postal code</Th>
          <Th>State</Th>
          <Th>City</Th>
          <Th>Country Code</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      {locations.map((location) => {
        const rowId = unwrap(location.locationId);
        const isDetailOpen = detailId === location.locationId;
        return (
          <Tbody key={location.locationId}>
            <Tr onClick={() => onRowClick(rowId, !isDetailOpen)} _hover={{ cursor: 'pointer', background: 'gray.200' }}>
              <Td>{isDetailOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</Td>
              <Td>
                <Text as="span" fontWeight={600}>
                  {location.locationId}
                </Text>
              </Td>
              <Td>
                <Text as="span">{location.street}</Text>
              </Td>
              <Td>
                <Text as="span">{location.postalCode}</Text>
              </Td>
              <Td>
                <Text as="span">{location.state}</Text>
              </Td>
              <Td>
                <Text as="span">{location.city}</Text>
              </Td>
              <Td>
                <Text as="span">{location.countryCode}</Text>
              </Td>
              <Td>
                <HStack>
                  <Tooltip label="Edit location">
                    <IconButton
                      aria-label="edit"
                      size="sm"
                      icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                      onClick={() => {
                        onEditLocationButtonClick(unwrap(site.siteId), unwrap(location.locationId));
                      }}
                    />
                  </Tooltip>
                  <Tooltip label="Manage devices">
                    <IconButton
                      aria-label="devices"
                      size="sm"
                      icon={<Icon size={12} as={FeatherIcon} icon="hard-drive" />}
                      onClick={() => {
                        onDevicesSiteButtonClick(unwrap(site.siteId), unwrap(location.locationId));
                      }}
                    />
                  </Tooltip>
                  <Tooltip label="Delete location">
                    <IconButton
                      aria-label="Delete location"
                      size="sm"
                      colorScheme="red"
                      icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                      onClick={() => {
                        onDeleteLocationButtonClick(unwrap(location.locationId));
                      }}
                    />
                  </Tooltip>
                </HStack>
              </Td>
            </Tr>
            {isDetailOpen && (
              <Tr>
                <Td colSpan={8}>
                  <LocationDetail site={site} location={location} />
                </Td>
              </Tr>
            )}
          </Tbody>
        );
      })}
    </Table>
  );
};

export default LocationTable;
