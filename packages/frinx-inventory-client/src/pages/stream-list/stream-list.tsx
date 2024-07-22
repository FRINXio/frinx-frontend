import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  chakra,
  Container,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Input,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { usePagination, Pagination, useNotifications, ConfirmDeleteModal, unwrap } from '@frinx/shared';
import { Item } from '@frinx/shared/dist/components/autocomplete/autocomplete';
import React, { ChangeEvent, FormEvent, useMemo, useState, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import {
  ActivateStreamMutation,
  ActivateStreamMutationVariables,
  BulkActivateStreamsMutation,
  BulkActivateStreamsMutationVariables,
  BulkDeactivateStreamsMutation,
  BulkDeactivateStreamsMutationVariables,
  DeactivateStreamMutation,
  DeactivateStreamMutationVariables,
  DeleteStreamMutation,
  DeleteStreamMutationVariables,
  StreamFilterLabelsQuery,
  StreamsQuery,
  StreamsQueryVariables,
} from '../../__generated__/graphql';
import BulkActions from './bulk-actions';
import DeleteSelectedStreamsModal from './delete-selected-modal';
import StreamFilter from './stream-filters';
import StreamTable from './stream-table';

const STREAMS_QUERY = gql`
  query Streams(
    $labels: [String!]
    $streamName: String
    $deviceName: String
    $orderBy: StreamOrderByInput
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    deviceInventory {
      streams(
        filter: { labels: $labels, deviceName: $deviceName, streamName: $streamName }
        orderBy: $orderBy
        first: $first
        after: $after
        last: $last
        before: $before
      ) {
        edges {
          node {
            id
            streamName
            deviceName
            createdAt
            startedAt
            stoppedAt
            isActive
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

const ACTIVATE_STREAM_MUTATION = gql`
  mutation ActivateStream($id: String!) {
    deviceInventory {
      activateStream(id: $id) {
        stream {
          id
          createdAt
          isActive
        }
      }
    }
  }
`;

const DEACTIVATE_STREAM_MUTATION = gql`
  mutation DeactivateStream($id: String!) {
    deviceInventory {
      deactivateStream(id: $id) {
        stream {
          id
          createdAt
          isActive
        }
      }
    }
  }
`;

const DELETE_STREAM_MUTATION = gql`
  mutation DeleteStream($id: String!) {
    deviceInventory {
      deleteStream(id: $id) {
        stream {
          id
        }
      }
    }
  }
`;

const BULK_ACTIVATE_STREAMS_MUTATION = gql`
  mutation BulkActivateStreams($input: BulkInstallStreamsInput!) {
    deviceInventory {
      bulkInstallStreams(input: $input) {
        installedStreams {
          id
        }
      }
    }
  }
`;

const STREAM_LABELS_QUERY = gql`
  query StreamFilterLabels {
    deviceInventory {
      labels {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

const BULK_DEACTIVATE_STREAMS_MUTATION = gql`
  mutation BulkDeactivateStreams($input: BulkUninstallStreamsInput!) {
    deviceInventory {
      bulkUninstallStreams(input: $input) {
        uninstalledStreams {
          id
        }
      }
    }
  }
`;

type SortedBy = 'streamName' | 'deviceName' | 'createdAt';
type Direction = 'ASC' | 'DESC';
type Sorting = {
  sortKey: SortedBy;
  direction: Direction;
};

const Form = chakra('form');

const StreamList: VoidFunctionComponent = () => {
  const context = useMemo(() => ({ additionalTypenames: ['Stream'] }), []);
  const { addToastNotification } = useNotifications();
  const deleteModalDisclosure = useDisclosure();
  const deleteSelectedStreamsModal = useDisclosure();
  const [orderBy, setOrderBy] = useState<Sorting | null>(null);

  // filter states
  const [selectedLabels, setSelectedLabels] = useState<Item[]>([]);
  const [searchStreamName, setSearchStreamName] = useState<string | null>(null);
  const [searchDeviceName, setSearchDeviceName] = useState<string | null>(null);
  const [filterStream, setFilterStream] = useState<{ streamName: string | null; deviceName: string | null } | null>(
    null,
  );

  const [streamIdToDelete, setStreamIdToDelete] = useState<string | null>(null);
  // TODO: will be implemented laterdeletedStream.streamName
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activateLoadingMap, setActivateLoadingMap] = useState<Record<string, boolean>>({});
  // TODO: will be implemented later
  const [selectedStreams, setSelectedStreams] = useState<Set<string>>(new Set());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [streamNameFilter, setStreamNameFilter] = useState<string | null>(null);
  const [paginationArgs, { nextPage, previousPage, firstPage }] = usePagination();
  const [{ data: streamData, error }] = useQuery<StreamsQuery, StreamsQueryVariables>({
    query: STREAMS_QUERY,
    variables: {
      streamName: streamNameFilter,
      orderBy,
      labels: selectedLabels.map((label) => label.label),
      ...filterStream,
      ...paginationArgs,
    },
    context,
  });
  const [{ data: labelsData }] = useQuery<StreamFilterLabelsQuery>({ query: STREAM_LABELS_QUERY, context });

  const [, activateStream] = useMutation<ActivateStreamMutation, ActivateStreamMutationVariables>(
    ACTIVATE_STREAM_MUTATION,
  );
  const [, deactivateStream] = useMutation<DeactivateStreamMutation, DeactivateStreamMutationVariables>(
    DEACTIVATE_STREAM_MUTATION,
  );
  const [, deleteStream] = useMutation<DeleteStreamMutation, DeleteStreamMutationVariables>(DELETE_STREAM_MUTATION);
  const [, bulkInstallation] = useMutation<BulkActivateStreamsMutation, BulkActivateStreamsMutationVariables>(
    BULK_ACTIVATE_STREAMS_MUTATION,
  );
  const [, bulkUninstallation] = useMutation<BulkDeactivateStreamsMutation, BulkDeactivateStreamsMutationVariables>(
    BULK_DEACTIVATE_STREAMS_MUTATION,
  );

  const handleSort = (sortKey: SortedBy) => {
    setOrderBy({ sortKey, direction: orderBy?.direction === 'ASC' ? 'DESC' : 'ASC' });
  };

  const handleOnSelectionChange = (selectedItems?: Item[]) => {
    if (selectedItems) {
      setSelectedLabels([...new Set(selectedItems)]);
    }
  };

  const clearFilter = () => {
    setFilterStream(null);
    setSelectedLabels([]);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    firstPage();
    setFilterStream({
      deviceName: searchDeviceName,
      streamName: searchStreamName,
    });
  };

  const handleDeleteBtnClick = (streamId: string) => {
    setStreamIdToDelete(streamId);
    deleteModalDisclosure.onOpen();
  };

  const handleStreamSelection = (streamId: string, checked: boolean) => {
    if (checked) {
      setSelectedStreams((prev) => {
        const newSelectedDevices = new Set(prev.add(streamId));
        return newSelectedDevices;
      });
    } else {
      setSelectedStreams((prev) => {
        const newSelectedDevices = new Set(prev);
        newSelectedDevices.delete(streamId);

        return newSelectedDevices;
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSelectionOfAllStreams = (checked: boolean) => {
    if (checked) {
      if (streamData != null) {
        const streamId = streamData.deviceInventory.streams.edges
          .filter(({ node }) => !node.isActive)
          .map(({ node }) => node.id);
        setSelectedStreams(new Set(streamId));
      }
    } else {
      setSelectedStreams(new Set());
    }
  };

  const handleStreamInstall = (streamId: string) => {
    setActivateLoadingMap((m) => {
      return {
        ...m,
        [streamId]: true,
      };
    });
    activateStream({
      id: streamId,
    })
      .then((res) => {
        if (res.data?.deviceInventory.activateStream.stream.isActive === true) {
          addToastNotification({
            type: 'success',
            title: 'Success',
            content: 'Stream activated successsfuly',
          });
        }
        if (res.error != null) {
          throw new Error(res.error.message);
        }
      })
      .catch(() => {
        addToastNotification({
          type: 'error',
          title: 'Error',
          content: 'Installation failed',
        });
      })
      .finally(() => {
        setActivateLoadingMap((m) => {
          return {
            ...m,
            [streamId]: false,
          };
        });
      });
  };

  const handleStreamUninstall = (streamId: string) => {
    setActivateLoadingMap((m) => {
      return {
        ...m,
        [streamId]: true,
      };
    });
    deactivateStream({
      id: streamId,
    })
      .then((res) => {
        if (res.data?.deviceInventory.deactivateStream.stream.isActive === false) {
          addToastNotification({
            type: 'success',
            title: 'Success',
            content: 'Stream deactivated successfuly',
          });
        }
        if (res.error) {
          addToastNotification({
            type: 'error',
            title: 'Error',
            content: 'Deactivation failed',
          });
        }
      })
      .finally(() => {
        setActivateLoadingMap((m) => {
          return {
            ...m,
            [streamId]: false,
          };
        });
      });
  };

  const deleteStreams = (streamIds: string[]) => {
    return Promise.allSettled(
      [...streamIds].map(async (streamId: string) => {
        const res = await deleteStream({
          id: streamId,
        });
        if (res.data?.deviceInventory.deleteStream) {
          return res.data.deviceInventory.deleteStream.stream?.id;
        }
        if (res.error) {
          throw new Error(res.error?.message);
        }
        return null;
      }),
    )
      .then((res) => {
        if (res.every((item) => item.status === 'fulfilled')) {
          return addToastNotification({
            type: 'success',
            title: 'Success',
            content: res.length > 1 ? 'Streams were deleted successfully' : 'Stream was deleted successfully',
          });
        }

        if (res.every((item) => item.status === 'rejected')) {
          return addToastNotification({
            type: 'error',
            title: 'Error',
            content: res.length > 1 ? 'Failed to delete streams' : 'Failed to delete streams',
          });
        }

        return addToastNotification({
          type: 'warning',
          title: 'Warning',
          content: 'Not all selected streams were deleted',
        });
      })
      .finally(() => {
        setSelectedStreams(new Set());
        deleteModalDisclosure.onClose();
      });
  };

  const handleActivateSelectedStreams = () => {
    setActivateLoadingMap((m) => {
      return {
        ...m,
        ...[...selectedStreams].reduce((acc, streamId) => {
          return {
            ...acc,
            [streamId]: true,
          };
        }, {}),
      };
    });
    bulkInstallation({
      input: {
        streamIds: [...selectedStreams],
      },
    })
      .then((res) => {
        if (res.error != null || res.data == null) {
          throw new Error(res.error?.message ?? 'Problem with bulk activation of streams');
        }

        if (res.data?.deviceInventory.bulkInstallStreams.installedStreams.length === 0) {
          throw new Error('No streams were installed');
        }

        addToastNotification({
          type: 'success',
          title: 'Success',
          content: 'Streams activated successfuly',
        });
      })
      .catch(() => {
        addToastNotification({
          type: 'error',
          title: 'Error',
          content: 'Bulk activation of streams has failed',
        });
      })
      .finally(() => {
        setActivateLoadingMap((m) => {
          return {
            ...m,
            ...[...selectedStreams].reduce((acc, streamId) => {
              return {
                ...acc,
                [streamId]: false,
              };
            }, {}),
          };
        });
        setSelectedStreams(new Set());
      });
  };

  const handleDeactivateSelectedStreams = () => {
    setActivateLoadingMap((m) => {
      return {
        ...m,
        ...[...selectedStreams].reduce((acc, streamId) => {
          return {
            ...acc,
            [streamId]: true,
          };
        }, {}),
      };
    });
    bulkUninstallation({
      input: {
        streamIds: [...selectedStreams],
      },
    })
      .then((res) => {
        if (res.error != null || res.data == null) {
          throw new Error(res.error?.message ?? 'Problem with bulk activation of streams');
        }

        if (res.data?.deviceInventory.bulkUninstallStreams.uninstalledStreams.length === 0) {
          throw new Error('No streams were uninstalled');
        }

        addToastNotification({
          type: 'success',
          title: 'Success',
          content: 'Streams deactivated successfuly',
        });
      })
      .catch(() => {
        addToastNotification({
          type: 'error',
          title: 'Error',
          content: 'Bulk deactivation of streams has failed',
        });
      })
      .finally(() => {
        setActivateLoadingMap((m) => {
          return {
            ...m,
            ...[...selectedStreams].reduce((acc, streamId) => {
              return {
                ...acc,
                [streamId]: false,
              };
            }, {}),
          };
        });
        setSelectedStreams(new Set());
      });
  };

  const handleStreamDelete = () => {
    deleteStreams([unwrap(streamIdToDelete)]).finally(() => deleteModalDisclosure.onClose());
  };

  const handleSelectedStreamsDelete = () => {
    deleteStreams([...selectedStreams]).finally(() => deleteSelectedStreamsModal.onClose());
  };

  const areSelectedAll =
    streamData?.deviceInventory.streams.edges.filter(({ node }) => !node.isActive).length === selectedStreams.size;
  const handleSearchDeviceName = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchDeviceName(value);
  };

  const handleSearchStreamName = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchStreamName(value);
  };

  if (streamData == null && error) {
    return (
      <Container maxWidth="container.xl">
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Something went wrong...</AlertTitle>
          <br />
          <AlertDescription>{error.toString()}</AlertDescription>
        </Alert>
      </Container>
    );
  }
  if (streamData == null) {
    return null;
  }

  const labels = labelsData?.deviceInventory.labels?.edges ?? [];

  return (
    <>
      <DeleteSelectedStreamsModal
        onConfirm={handleSelectedStreamsDelete}
        isOpen={deleteSelectedStreamsModal.isOpen}
        onClose={deleteSelectedStreamsModal.onClose}
      />
      <ConfirmDeleteModal
        isOpen={deleteModalDisclosure.isOpen}
        onClose={deleteModalDisclosure.onClose}
        onConfirmBtnClick={handleStreamDelete}
        title="Delete stream"
      >
        Are you sure? You can&apos;t undo this action afterwards.
      </ConfirmDeleteModal>
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h1" size="xl">
            Streams
          </Heading>
          <HStack spacing={2} marginLeft="auto">
            <Button data-cy="add-device" as={Link} colorScheme="blue" to="./new">
              Add stream
            </Button>
          </HStack>
        </Flex>
        <VStack align="flex-start">
          <Form display="flex" alignItems="flex-start" width="half" onSubmit={handleSearchSubmit}>
            <Box flex={1}>
              <StreamFilter
                labels={labels}
                selectedLabels={selectedLabels || []}
                onSelectionChange={handleOnSelectionChange}
                isCreationDisabled
              />
            </Box>
            <Box flex={1} marginLeft="2">
              <FormLabel htmlFor="device-search">Search device</FormLabel>
              <Flex mt={2}>
                <Input
                  data-cy="search-by-name"
                  id="device-search"
                  type="text"
                  value={searchDeviceName || ''}
                  onChange={handleSearchDeviceName}
                  background="white"
                  placeholder="Search device"
                />
              </Flex>
            </Box>
            <Box flex={1} marginLeft="2">
              <FormLabel htmlFor="stream-search">Search stream</FormLabel>
              <Flex mt={2}>
                <Input
                  data-cy="search-by-name"
                  id="stream-search"
                  type="text"
                  value={searchStreamName || ''}
                  onChange={handleSearchStreamName}
                  background="white"
                  placeholder="Search stream"
                />
              </Flex>
            </Box>
            <Button mb={6} data-cy="search-button" colorScheme="blue" marginLeft="2" mt={8} type="submit">
              Search
            </Button>
            <Button
              mb={6}
              data-cy="clear-button"
              onClick={clearFilter}
              colorScheme="red"
              variant="outline"
              marginLeft="2"
              mt={8}
            >
              Clear
            </Button>
          </Form>
          <Flex justify="flex-end" mb="8">
            <BulkActions
              onActivateButtonClick={handleActivateSelectedStreams}
              onDisableButtonClick={handleDeactivateSelectedStreams}
              onDeleteButtonClick={deleteSelectedStreamsModal.onOpen}
              areButtonsDisabled={selectedStreams.size === 0}
            />
          </Flex>
        </VStack>
        <StreamTable
          data-cy="stream-table"
          streams={streamData?.deviceInventory.streams.edges}
          areSelectedAll={areSelectedAll}
          onSelectAll={handleSelectionOfAllStreams}
          selectedStreams={selectedStreams}
          orderBy={orderBy}
          onSort={handleSort}
          onInstallButtonClick={handleStreamInstall}
          onUninstallButtonClick={handleStreamUninstall}
          onDeleteBtnClick={handleDeleteBtnClick}
          installLoadingMap={activateLoadingMap}
          onStreamSelection={handleStreamSelection}
        />
        <Pagination
          onPrevious={previousPage(streamData.deviceInventory.streams.pageInfo.startCursor)}
          onNext={nextPage(streamData.deviceInventory.streams.pageInfo.endCursor)}
          hasNextPage={streamData.deviceInventory.streams.pageInfo.hasNextPage}
          hasPreviousPage={streamData.deviceInventory.streams.pageInfo.hasPreviousPage}
        />
      </Container>
    </>
  );
};

export default StreamList;
