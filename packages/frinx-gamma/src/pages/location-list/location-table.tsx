import {
  Button,
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
import { CustomerLocation, VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';
import LocationDetail from './location-detail';

type Props = {
  size: 'sm' | 'md';
  site: VpnSite;
  detailId: string | null;
  locations: CustomerLocation[];
  onDeleteLocationButtonClick: (siteId: string) => void;
  onRowClick: (rowId: string, isOpen: boolean) => void;
};

const LocationTable: VoidFunctionComponent<Props> = ({
  size,
  site,
  detailId,
  locations,
  onDeleteLocationButtonClick,
  onRowClick,
}) => {
  return (
    <Table background="white" size={size} marginBottom="12">
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
                  <Menu size="sm">
                    <MenuButton size="sm" as={Button} rightIcon={<Icon as={FeatherIcon} icon="chevron-down" />}>
                      Manage
                    </MenuButton>
                    <Portal>
                      <MenuList>
                        <MenuItem
                          as={Link}
                          to={`../sites/${site.siteId}/devices`}
                          icon={<Icon size={12} as={FeatherIcon} icon="hard-drive" />}
                        >
                          Devices
                        </MenuItem>
                      </MenuList>
                    </Portal>
                  </Menu>
                  <Tooltip label="Edit location">
                    <IconButton
                      aria-label="edit"
                      colorScheme="blue"
                      size="sm"
                      icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                      as={Link}
                      to={`../sites/${site.siteId}/locations/edit/${location.locationId}`}
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
