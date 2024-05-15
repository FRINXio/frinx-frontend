import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { usePagination, Pagination, useNotifications } from '@frinx/shared';
import React, { useMemo, useState, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import {
  ActivateStreamMutation,
  ActivateStreamMutationVariables,
  DeactivateStreamMutation,
  DeactivateStreamMutationVariables,
  StreamsQuery,
  StreamsQueryVariables,
} from '../../__generated__/graphql';
import StreamTable from './stream-table';

const STREAMS_QUERY = gql`
  query Streams(
    $streamName: String
    $orderBy: StreamOrderByInput
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    deviceInventory {
      streams(
        filter: { streamName: $streamName }
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
type SortedBy = 'streamName' | 'deviceName' | 'createdAt' | 'serviceState';
type Direction = 'ASC' | 'DESC';
type Sorting = {
  sortKey: SortedBy;
  direction: Direction;
};

const StreamList: VoidFunctionComponent = () => {
  const context = useMemo(() => ({ additionalTypenames: ['Stream'] }), []);
  const { addToastNotification } = useNotifications();
  const deleteModalDisclosure = useDisclosure();
  const [orderBy, setOrderBy] = useState<Sorting | null>(null);
  // TODO: will be implemented later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [streamIdToDelete, setStreamIdToDelete] = useState<string | null>(null);
  // TODO: will be implemented later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activateLoadingMap, setActivateLoadingMap] = useState<Record<string, boolean>>({});
  // TODO: will be implemented later
  const [selectedStreams, setSelectedStreams] = useState<Set<string>>(new Set());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [streamNameFilter, setStreamNameFilter] = useState<string | null>(null);
  const [paginationArgs, { nextPage, previousPage }] = usePagination();
  const [{ data: streamData, error }] = useQuery<StreamsQuery, StreamsQueryVariables>({
    query: STREAMS_QUERY,
    variables: {
      streamName: streamNameFilter,
      // deviceName: deviceNameFilter,
      ...paginationArgs,
    },
    context,
  });

  const [, activateStream] = useMutation<ActivateStreamMutation, ActivateStreamMutationVariables>(
    ACTIVATE_STREAM_MUTATION,
  );
  const [, deactivateStream] = useMutation<DeactivateStreamMutation, DeactivateStreamMutationVariables>(
    DEACTIVATE_STREAM_MUTATION,
  );

  const handleSort = (sortKey: SortedBy) => {
    setOrderBy({ sortKey, direction: orderBy?.direction === 'ASC' ? 'DESC' : 'ASC' });
  };

  const handleDeleteBtnClick = (deviceId: string) => {
    setStreamIdToDelete(deviceId);
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
    // eslint-disable-next-line no-console
    console.log('select all streams');
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

  // TODO: will be implemented later
  const areSelectedAll = false;

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

  return (
    <Container maxWidth={1280}>
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h1" size="xl">
          Streams
        </Heading>
        <HStack spacing={2} marginLeft="auto">
          <Button data-cy="add-device" as={Link} colorScheme="blue" to="../new">
            Add stream
          </Button>
        </HStack>
      </Flex>
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
  );
};

export default StreamList;
