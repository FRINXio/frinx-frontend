import { HStack, Icon, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';
import { VpnSite } from '../../components/forms/site-types';
import unwrap from '../../helpers/unwrap';

type Props = {
  site: VpnSite;
  onEditLocationButtonClick: (siteId: string, locationId: string) => void;
  onDeleteLocationButtonClick: (siteId: string) => void;
  onDevicesSiteButtonClick: (siteId: string, locationId: string) => void;
};

const LocationTable: VoidFunctionComponent<Props> = ({
  site,
  onDeleteLocationButtonClick,
  onEditLocationButtonClick,
  onDevicesSiteButtonClick,
}) => {
  return (
    <Table background="white" size="lg">
      <Thead>
        <Tr>
          <Th>Id</Th>
          <Th>City</Th>
          <Th>Postal code</Th>
          <Th>Street</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {site.customerLocations.map((location) => {
          return (
            <Tr key={location.locationId}>
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
                  <IconButton
                    aria-label="edit"
                    size="sm"
                    icon={<Icon size={12} as={FeatherIcon} icon="edit" />}
                    onClick={() => {
                      onEditLocationButtonClick(unwrap(site.siteId), unwrap(location.locationId));
                    }}
                  />
                  <IconButton
                    aria-label="devices"
                    size="sm"
                    icon={<Icon size={12} as={FeatherIcon} icon="cpu" />}
                    onClick={() => {
                      onDevicesSiteButtonClick(unwrap(site.siteId), unwrap(location.locationId));
                    }}
                  />
                  <IconButton
                    aria-label="Delete device"
                    size="sm"
                    colorScheme="red"
                    icon={<Icon size={12} as={FeatherIcon} icon="trash-2" />}
                    onClick={() => {
                      onDeleteLocationButtonClick(unwrap(location.locationId));
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

export default LocationTable;
