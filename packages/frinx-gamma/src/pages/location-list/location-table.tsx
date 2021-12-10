import { HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, Tooltip } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { CustomerLocation } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';
import LocationDetail from './location-detail';

type Props = {
  siteId: string;
  detailId: string | null;
  locations: CustomerLocation[];
  onEditLocationButtonClick: (siteId: string, locationId: string) => void;
  onDeleteLocationButtonClick: (siteId: string) => void;
  onDevicesSiteButtonClick: (siteId: string, locationId: string) => void;
  onRowClick: (rowId: string, isOpen: boolean) => void;
};

const LocationTable: VoidFunctionComponent<Props> = ({
  siteId,
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
          <Th>City</Th>
          <Th>Postal code</Th>
          <Th>Street</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      {locations.map((location) => {
        const rowId = unwrap(location.locationId);
        const isDetailOpen = detailId === location.locationId;
        return (
          <Tbody key={location.locationId}>
            <Tr
              onClick={() => onRowClick(rowId, !isDetailOpen)}
              css={`
                &:hover {
                  cursor: pointer;
                }
              `}
            >
              <Td>{isDetailOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</Td>
              <Td>
                <Text as="span" fontWeight={600}>
                  {location.locationId}
                </Text>
              </Td>
              <Td>
                <Text as="span">{location.city}</Text>
              </Td>
              <Td>
                <Text as="span">{location.postalCode}</Text>
              </Td>
              <Td>
                <Text as="span">{location.street}</Text>
              </Td>
              <Td>
                <HStack>
                  <Tooltip label="Edit location">
                    <IconButton
                      aria-label="edit"
                      size="sm"
                      icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                      onClick={() => {
                        onEditLocationButtonClick(unwrap(siteId), unwrap(location.locationId));
                      }}
                    />
                  </Tooltip>
                  <Tooltip label="Location devices">
                    <IconButton
                      aria-label="devices"
                      size="sm"
                      icon={<Icon size={12} as={FeatherIcon} icon="cpu" />}
                      onClick={() => {
                        onDevicesSiteButtonClick(unwrap(siteId), unwrap(location.locationId));
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
                <Td colSpan={6}>
                  <LocationDetail location={location} />
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
