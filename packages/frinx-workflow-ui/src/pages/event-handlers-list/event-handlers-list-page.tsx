import React, { ChangeEvent, useMemo, useState, VoidFunctionComponent } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Progress,
  Spacer,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { gql, useMutation, useQuery } from 'urql';
import { Pagination, useNotifications, SelectItemsPerPage } from '@frinx/shared';
import FeatherIcon from 'feather-icons-react';
import { useNavigate } from 'react-router-dom';
import {
  DeleteEventHandlerMutation,
  DeleteEventHandlerMutationVariables,
  GetEventHandlersQuery,
  GetEventHandlersQueryVariables,
  UpdateEventHandlerMutation,
  UpdateEventHandlerMutationVariables,
} from '../../__generated__/graphql';
import EventHandlersListSearchbox, { SearchEventHandlerValues } from './event-handlers-list-searchbox';
import { usePagination } from '../../hooks/use-graphql-pagination';

type Props = {
  onEventHandlerDetailClick: (event: string, name: string) => void;
  onEventHandlerEditClick: (event: string, name: string) => void;
};

type OrderBy = {
  sortKey: 'name' | 'isActive' | 'event' | 'evaluatorType';
  direction: 'ASC' | 'DESC';
};

const EVENT_HANDLERS_QUERY = gql`
  query GetEventHandlers(
    $filter: FilterEventHandlerInput
    $first: Int
    $after: String
    $last: Int
    $before: String
    $orderBy: EventHandlersOrderByInput
  ) {
    eventHandlers(filter: $filter, first: $first, after: $after, last: $last, before: $before, orderBy: $orderBy) {
      edges {
        node {
          id
          isActive
          name
          evaluatorType
          event
          actions {
            action
          }
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

const DELETE_EVENT_HANDLER_MUTATION = gql`
  mutation DeleteEventHandler($deleteEventHandlerId: String!) {
    deleteEventHandler(id: $deleteEventHandlerId) {
      isOk
    }
  }
`;

const UPDATE_EVENT_HANDLER_MUTATION = gql`
  mutation UpdateEventHandler($input: UpdateEventHandlerInput!, $name: String!, $event: String!) {
    updateEventHandler(input: $input, name: $name, event: $event) {
      id
      name
      event
    }
  }
`;

const EventHandlersListPage: VoidFunctionComponent<Props> = ({
  onEventHandlerDetailClick,
  onEventHandlerEditClick,
}) => {
  const [eventHandlersFilter, setEventHandlersFilter] = useState<SearchEventHandlerValues | null>(null);
  const [orderBy, setOrderBy] = useState<OrderBy>({ sortKey: 'name', direction: 'ASC' });
  const [paginationArgs, { nextPage, previousPage, setItemsCount, firstPage }] = usePagination();

  const navigate = useNavigate();
  const ctx = useMemo(
    () => ({
      additionalTypenames: ['EventHandler'],
    }),
    [],
  );
  const [{ data, fetching, error }] = useQuery<GetEventHandlersQuery, GetEventHandlersQueryVariables>({
    query: EVENT_HANDLERS_QUERY,
    context: ctx,
    variables: {
      filter: eventHandlersFilter,
      orderBy,
      ...paginationArgs,
    },
  });
  const [, deleteEventHandler] = useMutation<DeleteEventHandlerMutation, DeleteEventHandlerMutationVariables>(
    DELETE_EVENT_HANDLER_MUTATION,
  );
  const [, updateEventHandler] = useMutation<UpdateEventHandlerMutation, UpdateEventHandlerMutationVariables>(
    UPDATE_EVENT_HANDLER_MUTATION,
  );

  const { addToastNotification } = useNotifications();

  const handleOnEventHandlerDelete = (id: string) => {
    deleteEventHandler(
      {
        deleteEventHandlerId: id,
      },
      ctx,
    )
      .then((response) => {
        if (response.error != null) {
          throw new Error(response.error.message);
        }

        addToastNotification({
          content: 'Successfully deleted event handler',
          type: 'success',
        });
      })
      .catch((err) => {
        addToastNotification({
          content: err.message,
          type: 'error',
        });
      });
  };

  const handleOnIsActiveClick = (
    e: ChangeEvent<HTMLInputElement>,
    eventHandler: {
      name: string;
      event: string;
    },
  ) => {
    const boolChecked = Boolean(e.target.checked);

    updateEventHandler(
      {
        input: {
          isActive: boolChecked,
        },
        event: eventHandler.event,
        name: eventHandler.name,
      },
      ctx,
    )
      .then((response) => {
        if (response.error != null) {
          throw new Error(response.error.message);
        }

        addToastNotification({
          type: 'success',
          content: 'Successfully updated event handler',
        });
      })
      .catch((err) => {
        addToastNotification({
          content: err.message,
          type: 'error',
        });
      });
  };

  const handleSort = (sortKey: OrderBy['sortKey']) => {
    return orderBy.direction === 'DESC'
      ? setOrderBy({ sortKey, direction: 'ASC' })
      : setOrderBy({ sortKey, direction: 'DESC' });
  };

  return (
    <Container mx="auto" mb={20} maxWidth={1200}>
      <HStack mb={5}>
        <Heading as="h1" size="lg">
          Event handlers
        </Heading>

        <Spacer />

        <Button colorScheme="blue" onClick={() => navigate('./add')}>
          Create new handler
        </Button>
      </HStack>
      <EventHandlersListSearchbox
        filters={eventHandlersFilter}
        canDoSearch={!fetching}
        onSearchSubmit={setEventHandlersFilter}
      />
      {fetching && <Progress isIndeterminate size="xs" mt={-10} />}
      {(data == null || data.eventHandlers == null || error != null) && (
        <Text>We had a problem to load event handlers for you. Try again later please.</Text>
      )}
      {!fetching && data != null && data.eventHandlers != null && error == null && (
        <Table background="white">
          <Thead>
            <Tr>
              <Th cursor="pointer" onClick={() => handleSort('isActive')}>
                Is active
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('name')}>
                Name
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('event')}>
                Event
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('evaluatorType')}>
                Evaluator type
              </Th>
              <Th>Action types</Th>
              <Th>Available actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.eventHandlers.edges?.length === 0 && (
              <Tr>
                <Td>No event handlers were created yet.</Td>
              </Tr>
            )}

            {data.eventHandlers.edges?.length !== 0 &&
              data.eventHandlers.edges?.map(({ node }) => (
                <Tr key={node.id}>
                  <Td>
                    <Switch
                      isChecked={node.isActive ?? false}
                      onChange={(e) =>
                        handleOnIsActiveClick(e, {
                          event: node.event,
                          name: node.name,
                        })
                      }
                    />
                  </Td>
                  <Td>{node.name}</Td>
                  <Td>{node.event}</Td>
                  <Td>{node.evaluatorType || 'not defined'}</Td>
                  <Td>{node.actions.map((action) => action.action).join(', ')}</Td>
                  <Td>
                    <ButtonGroup variant="solid" size="xs">
                      <IconButton
                        aria-label="detail of event handler"
                        icon={<FeatherIcon icon="settings" size={12} />}
                        colorScheme="blue"
                        onClick={() => onEventHandlerDetailClick(node.event, node.name)}
                      />
                      <IconButton
                        aria-label="edit event handler"
                        icon={<FeatherIcon icon="edit" size={12} />}
                        onClick={() => onEventHandlerEditClick(node.event, node.name)}
                      />
                      <IconButton
                        aria-label="delete event handler"
                        icon={<FeatherIcon icon="trash-2" size={12} />}
                        colorScheme="red"
                        onClick={() => handleOnEventHandlerDelete(node.id)}
                      />
                    </ButtonGroup>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      )}
      {data?.eventHandlers && (
        <Flex justify="space-between">
          <Box my={4} paddingX={4}>
            <Pagination
              onPrevious={previousPage(data.eventHandlers.pageInfo.startCursor)}
              onNext={nextPage(data.eventHandlers.pageInfo.endCursor)}
              hasNextPage={data.eventHandlers.pageInfo.hasNextPage}
              hasPreviousPage={data.eventHandlers.pageInfo.hasPreviousPage}
            />
          </Box>
          <SelectItemsPerPage
            onItemsPerPageChange={firstPage}
            first={paginationArgs.first}
            last={paginationArgs.last}
            setItemsCount={setItemsCount}
          />
        </Flex>
      )}
    </Container>
  );
};

export default EventHandlersListPage;
