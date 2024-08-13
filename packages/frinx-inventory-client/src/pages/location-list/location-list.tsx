import {
  Box,
  Container,
  Flex,
  Heading,
  Icon,
  IconButton,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  HStack,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { ConfirmDeleteModal, getLocalDateFromUTC, Pagination, usePagination } from '@frinx/shared';
import { format, formatDistanceToNow } from 'date-fns';
import FeatherIcon from 'feather-icons-react';
import React, { useMemo, useState, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import {
  AddLocationMutation,
  AddLocationMutationVariables,
  DeleteLocationMutation,
  DeleteLocationMutationVariables,
  Location,
  LocationListQuery,
  LocationListQueryVariables,
  UpdateLocationMutation,
  UpdateLocationMutationVariables,
} from '../../__generated__/graphql';
import LocationMapModal, { LocationModal } from '../../components/location-map-modal';
import AddDeviceLocationModal, { FormValues } from '../../components/add-device-location-modal';
import { LocationData } from '../create-device/create-device-page';

const LOCATION_LIST_QUERY = gql`
  query LocationList($first: Int, $last: Int, $after: String, $before: String) {
    deviceInventory {
      locations(first: $first, last: $last, after: $after, before: $before) {
        edges {
          node {
            id
            name
            createdAt
            updatedAt
            latitude
            longitude
            country
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
`;

const ADD_LOCATION_MUTATION = gql`
  mutation AddLocation($addLocationInput: AddLocationInput!) {
    deviceInventory {
      addLocation(input: $addLocationInput) {
        location {
          id
        }
      }
    }
  }
`;

const UPDATE_LOCATION_MUTATION = gql`
  mutation UpdateLocation($id: String!, $input: UpdateLocationInput!) {
    deviceInventory {
      updateLocation(id: $id, input: $input) {
        location {
          id
        }
      }
    }
  }
`;

const DELETE_LOCATION_MUTATION = gql`
  mutation DeleteLocation($id: String!) {
    deviceInventory {
      deleteLocation(id: $id) {
        location {
          id
        }
      }
    }
  }
`;

const LocationList: VoidFunctionComponent = () => {
  const context = useMemo(() => ({ additionalTypenames: ['Location'] }), []);
  const [paginationArgs, { nextPage, previousPage }] = usePagination();
  const [{ data: locationQData, error }] = useQuery<LocationListQuery, LocationListQueryVariables>({
    query: LOCATION_LIST_QUERY,
    variables: {
      ...paginationArgs,
    },
    context,
  });
  const [, addLocation] = useMutation<AddLocationMutation, AddLocationMutationVariables>(ADD_LOCATION_MUTATION);
  const [, updateLocation] = useMutation<UpdateLocationMutation, UpdateLocationMutationVariables>(
    UPDATE_LOCATION_MUTATION,
  );
  const [, deleteLocation] = useMutation<DeleteLocationMutation, DeleteLocationMutationVariables>(
    DELETE_LOCATION_MUTATION,
  );

  const [locationToShowOnMap, setLocationToShowOnMap] = useState<LocationModal | null>(null);
  const addLocationModalDisclosure = useDisclosure();
  const editLocationModalDisclosure = useDisclosure();
  const deleteModalDisclosure = useDisclosure();
  const [locationIdToDelete, setLocationIdToDelete] = useState<string | null>(null);
  const [locationToEdit, setLocationToEdit] = useState<FormValues>();

  const handleMapBtnClick = (deviceLocation: LocationModal | null) => {
    setLocationToShowOnMap(deviceLocation);
  };

  const handleEditBtnClick = (location: Location) => {
    if (location.latitude && location.longitude) {
      setLocationToEdit({
        id: location.id,
        name: location.name,
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
      });
      editLocationModalDisclosure.onOpen();
    }
  };

  const handleDeleteBtnClick = (id: string) => {
    setLocationIdToDelete(id);
    deleteModalDisclosure.onOpen();
  };

  const handleAddLocation = (locationData: LocationData) => {
    addLocation({
      addLocationInput: locationData,
    });
  };

  const handleEditLocation = (id: string, locationData: LocationData) => {
    updateLocation({
      id,
      input: locationData,
    });
  };

  const handleLocationDelete = () => {
    if (locationIdToDelete) {
      deleteLocation({ id: locationIdToDelete });
    }
    deleteModalDisclosure.onClose();
  };

  if (locationQData == null || error != null) {
    return null;
  }
  const { locations } = locationQData.deviceInventory;

  return (
    <>
      {locationToShowOnMap != null && (
        <LocationMapModal
          locationModal={locationToShowOnMap}
          onClose={() => {
            setLocationToShowOnMap(null);
          }}
        />
      )}
      <AddDeviceLocationModal
        onAddDeviceLocation={handleAddLocation}
        isOpen={addLocationModalDisclosure.isOpen}
        onClose={addLocationModalDisclosure.onClose}
        title="Add location"
        locationList={[]}
        setLocationFieldValue={() => {}}
      />
      <AddDeviceLocationModal
        isOpen={editLocationModalDisclosure.isOpen}
        onClose={editLocationModalDisclosure.onClose}
        title="Edit location"
        locationList={[]}
        setLocationFieldValue={() => {}}
        initialLocation={locationToEdit}
        onEditLocation={handleEditLocation}
      />
      <ConfirmDeleteModal
        isOpen={deleteModalDisclosure.isOpen}
        onClose={deleteModalDisclosure.onClose}
        onConfirmBtnClick={handleLocationDelete}
        title="Delete location"
      >
        Are you sure? You can&apos;t undo this action afterwards.
      </ConfirmDeleteModal>
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h1" size="xl">
            Locations
          </Heading>
          <HStack spacing={2} marginLeft="auto">
            <Button data-cy="add-location" colorScheme="blue" onClick={addLocationModalDisclosure.onOpen}>
              Add Location
            </Button>
          </HStack>
        </Flex>
        <Box>
          <Table background="white" size="lg">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Created</Th>
                <Th>Updated</Th>
                <Th>Latitude</Th>
                <Th>Longitude</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {locations.edges.map(({ node: location }) => {
                const createdLocalDate = getLocalDateFromUTC(location.createdAt);
                const updatedLocalDate = getLocalDateFromUTC(location.updatedAt);

                return (
                  <Tr key={location.id}>
                    <Td>
                      <Text as="span" fontWeight={600}>
                        {location.name}
                      </Text>
                    </Td>
                    <Td>
                      <Tooltip label={format(createdLocalDate, 'dd/MM/yyyy, k:mm')}>
                        <Text as="span" fontSize="sm" color="blackAlpha.700">
                          {formatDistanceToNow(createdLocalDate)} ago
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label={format(updatedLocalDate, 'dd/MM/yyyy, k:mm')}>
                        <Text as="span" fontSize="sm" color="blackAlpha.700">
                          {formatDistanceToNow(updatedLocalDate)} ago
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Text as="span">{location.latitude}</Text>
                    </Td>
                    <Td>
                      <Text as="span">{location.longitude}</Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Tooltip label="Map">
                          <IconButton
                            size="sm"
                            aria-label="Map"
                            icon={<Icon as={FeatherIcon} icon="map" size={20} />}
                            onClick={() => handleMapBtnClick({ location })}
                          />
                        </Tooltip>
                        <Tooltip label="Edit">
                          <IconButton
                            size="sm"
                            aria-label="Edit"
                            icon={<Icon as={FeatherIcon} icon="edit" size={20} />}
                            onClick={() => {
                              handleEditBtnClick(location);
                            }}
                          />
                        </Tooltip>
                        <Tooltip label="Delete">
                          <IconButton
                            colorScheme="red"
                            size="sm"
                            aria-label="Delete"
                            icon={<Icon as={FeatherIcon} icon="trash-2" size={20} />}
                            onClick={() => {
                              handleDeleteBtnClick(location.id);
                            }}
                          />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          <Pagination
            onPrevious={previousPage(locations.pageInfo.startCursor)}
            onNext={nextPage(locations.pageInfo.endCursor)}
            hasNextPage={locations.pageInfo.hasNextPage}
            hasPreviousPage={locations.pageInfo.hasPreviousPage}
          />
        </Box>
      </Container>
    </>
  );
};

export default LocationList;
