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
import { usePagination, Pagination } from '@frinx/shared';
import React, { useMemo, useState, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { gql, useQuery } from 'urql';
import { StreamsQuery, StreamsQueryVariables } from '../../__generated__/graphql';
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
type SortedBy = 'streamName' | 'deviceName' | 'createdAt' | 'serviceState';
type Direction = 'ASC' | 'DESC';
type Sorting = {
  sortKey: SortedBy;
  direction: Direction;
};

const StreamList: VoidFunctionComponent = () => {
  const context = useMemo(() => ({ additionalTypenames: ['Stream'] }), []);
  const deleteModalDisclosure = useDisclosure();
  const [orderBy, setOrderBy] = useState<Sorting | null>(null);
  // TODO: will be implemented later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [streamIdToDelete, setStreamIdToDelete] = useState<string | null>(null);
  // TODO: will be implemented later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [installLoadingMap, setInstallLoadingMap] = useState<Record<string, boolean>>({});
  // TODO: will be implemented later
  const [selectedStreams, setSelectedStreams] = useState<Set<string>>(new Set());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [streamNameFilter, setStreamNameFilter] = useState<string | null>(null);
  const [paginationArgs, { nextPage, previousPage }] = usePagination();
  const [{ data: deviceData, error }] = useQuery<StreamsQuery, StreamsQueryVariables>({
    query: STREAMS_QUERY,
    variables: {
      streamName: streamNameFilter,
      // deviceName: deviceNameFilter,
      ...paginationArgs,
    },
    context,
  });

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

  const handleStreamInstall = () => {
    // eslint-disable-next-line no-console
    console.log('stream install clicked');
  };

  const handleStreamUninstall = () => {
    // eslint-disable-next-line no-console
    console.log('stream uninstall clicked');
  };

  // TODO: will be implemented later
  const areSelectedAll = false;

  if (deviceData == null && error) {
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
  if (deviceData == null) {
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
        streams={deviceData?.deviceInventory.streams.edges}
        areSelectedAll={areSelectedAll}
        onSelectAll={handleSelectionOfAllStreams}
        selectedStreams={selectedStreams}
        orderBy={orderBy}
        onSort={handleSort}
        onInstallButtonClick={handleStreamInstall}
        onUninstallButtonClick={handleStreamUninstall}
        onDeleteBtnClick={handleDeleteBtnClick}
        installLoadingMap={installLoadingMap}
        onStreamSelection={handleStreamSelection}
      />
      <Pagination
        onPrevious={previousPage(deviceData.deviceInventory.streams.pageInfo.startCursor)}
        onNext={nextPage(deviceData.deviceInventory.streams.pageInfo.endCursor)}
        hasNextPage={deviceData.deviceInventory.streams.pageInfo.hasNextPage}
        hasPreviousPage={deviceData.deviceInventory.streams.pageInfo.hasPreviousPage}
      />
    </Container>
  );
};

export default StreamList;
