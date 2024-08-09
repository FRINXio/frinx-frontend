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
  chakra,
} from '@chakra-ui/react';
import { ConfirmDeleteModal, getLocalDateFromUTC, Pagination, useNotifications, usePagination } from '@frinx/shared';
import { format, formatDistanceToNow } from 'date-fns';
import FeatherIcon from 'feather-icons-react';
import React, { useState, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import {
  CloseTransactionMutation,
  CloseTransactionMutationVariables,
  LocationListQuery,
  LocationListQueryVariables,
  RevertChangesMutation,
  RevertChangesMutationVariables,
} from '../../__generated__/graphql';
import LocationMapModal, { LocationModal } from '../../components/location-map-modal';
import AddDeviceLocationModal from '../../components/add-device-location-modal';
import { LocationData } from '../create-device/create-device-page';

const LOCATION_LIST_QUERY = gql`
  query LocationList {
    deviceInventory {
      locations {
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
const REVERT_CHANGES_MUTATION = gql`
  mutation RevertChanges($transactionId: String!) {
    deviceInventory {
      revertChanges(transactionId: $transactionId) {
        isOk
      }
    }
  }
`;
const CLOSE_TRANSACTION_MUTATION = gql`
  mutation CloseTransactionList($deviceId: String!, $transactionId: String!) {
    deviceInventory {
      closeTransaction(deviceId: $deviceId, transactionId: $transactionId) {
        isOk
      }
    }
  }
`;

const Form = chakra('form');

const LocationList: VoidFunctionComponent = () => {
  const { addToastNotification } = useNotifications();
  // const [selectedLocation, setSelectedLocation] = useState<
  //   LocationsQuery['deviceInventory']['locations'][0] | null
  // >(null);
  const [{ data: locationQData, error }] = useQuery<LocationListQuery, LocationListQueryVariables>({
    query: LOCATION_LIST_QUERY,
    requestPolicy: 'network-only',
  });
  const [{ fetching: isMutationFetching }, revertChanges] = useMutation<
    RevertChangesMutation,
    RevertChangesMutationVariables
  >(REVERT_CHANGES_MUTATION);
  const [, closeTransaction] = useMutation<CloseTransactionMutation, CloseTransactionMutationVariables>(
    CLOSE_TRANSACTION_MUTATION,
  );

  const [locationToShowOnMap, setLocationToShowOnMap] = useState<LocationModal | null>(null);
  const addLocationModalDisclosure = useDisclosure();
  const deleteModalDisclosure = useDisclosure();
  const [locationIdToDelete, setLocationIdToDelete] = useState<string | null>(null);
  const [paginationArgs, { nextPage, previousPage, firstPage }] = usePagination();

  const handleLocationMapBtnClick = (deviceLocation: LocationModal | null) => {
    setLocationToShowOnMap(deviceLocation);
  };

  const handleAddLocation = (locationData: LocationData) => {
    // addLocation({
    //   addLocationInput: locationData,
    // });
    console.log(locationData);
  };

  const handleDeleteBtnClick = (streamId: string) => {
    setLocationIdToDelete(streamId);
    deleteModalDisclosure.onOpen();
  };

  const handleLocationDelete = () => {
    // deleteStreams([unwrap(streamIdToDelete)]).finally(() => deleteModalDisclosure.onClose());
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
            <Button data-cy="add-location" colorScheme="blue"
              onClick={addLocationModalDisclosure.onOpen}>
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
                      <Text as="span">
                        {location.latitude}
                      </Text>
                    </Td>
                    <Td>
                      <Text as="span">
                        {location.longitude}
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Tooltip label="Map">
                          <IconButton
                            size="sm"
                            aria-label="Map"
                            isLoading={isMutationFetching}
                            icon={<Icon as={FeatherIcon} icon="map" size={20} />}
                            onClick={() => handleLocationMapBtnClick({ location: location })}
                          />
                        </Tooltip>
                        <Tooltip label="Edit">
                          <IconButton
                            size="sm"
                            aria-label="Edit"
                            isLoading={isMutationFetching}
                            icon={<Icon as={FeatherIcon} icon="edit" size={20} />}
                            onClick={() => {
                              // setSelectedTransaction(transaction);
                            }}
                          />
                        </Tooltip>
                        <Tooltip label="Delete">
                          <IconButton
                            colorScheme="red"
                            size="sm"
                            aria-label="Delete"
                            isLoading={isMutationFetching}
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
