import React, { ChangeEvent, FC, useMemo, useState } from 'react';
import {
  Button,
  Link as ChakraLink,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Progress,
  // Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Switch,
} from '@chakra-ui/react';
import { gql, useMutation, useQuery } from 'urql';
import { usePagination, Pagination, useNotifications, omitNullValue, isValueOfType } from '@frinx/shared';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import { omit, truncate } from 'lodash';
import {
  DeleteEventHandlerMutation,
  DeleteEventHandlerMutationVariables,
  EditEventHandlerInput,
  EventHandlersOrderByInput,
  GetEventHandlersQuery,
  GetEventHandlersQueryVariables,
  SortEventHandlersBy,
  UpdateEventHandlerMutation,
  UpdateEventHandlerMutationVariables,
} from '../../__generated__/graphql';
import EventHandlersListSearchbox, { SearchEventHandlerValues } from './event-handlers-list-searchbox';

const EVENT_HANDLERS_QUERY = gql`
  query GetEventHandlers(
    $filter: FilterEventHandlerInput
    $first: Int
    $after: String
    $last: Int
    $before: String
    $orderBy: EventHandlersOrderByInput
  ) {
    conductor {
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
  }
`;

const DELETE_EVENT_HANDLER_MUTATION = gql`
  mutation DeleteEventHandler($name: String!) {
    conductor {
      removeEventHandlerStatus(name: $name)
    }
  }
`;

const UPDATE_EVENT_HANDLER_MUTATION = gql`
  mutation UpdateEventHandler($input: EditEventHandlerInput!) {
    conductor {
      editEventHandler(input: $input) {
        eventHandler {
          id
          name
          event
        }
      }
    }
  }
`;

const EventHandlersListPage: FC = () => {
  const [eventHandlersFilter, setEventHandlersFilter] = useState<SearchEventHandlerValues | null>(null);
  const [orderBy, setOrderBy] = useState<EventHandlersOrderByInput>({ sortKey: 'name', direction: 'ASC' });
  const [paginationArgs, { nextPage, previousPage }] = usePagination();
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

  const handleOnEventHandlerDelete = (name: string) => {
    deleteEventHandler(
      {
        name,
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

  const handleOnIsActiveClick = (e: ChangeEvent<HTMLInputElement>, eventHandler: EditEventHandlerInput) => {
    const boolChecked = Boolean(e.target.checked);
    const updatedEventHandler = omit(
      {
        ...eventHandler,
        isActive: boolChecked,
      },
      ['__typename', 'name'],
    );

    if (isValueOfType<EditEventHandlerInput>('id', updatedEventHandler)) {
      updateEventHandler(
        {
          input: updatedEventHandler,
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
    }
  };

  const handleSort = (sortKey: SortEventHandlersBy) => {
    return orderBy.direction === 'DESC'
      ? setOrderBy({ sortKey, direction: 'ASC' })
      : setOrderBy({ sortKey, direction: 'DESC' });
  };

  return (
    <Container mx="auto" maxWidth="container.xl">
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h1" size="xl">
          Event handlers
        </Heading>
        <HStack spacing={2} marginLeft="auto">
          <Button data-cy="add-device" as={Link} colorScheme="blue" to="add">
            Add new handler
          </Button>
        </HStack>
      </Flex>
      <EventHandlersListSearchbox
        filters={eventHandlersFilter}
        canDoSearch={!fetching}
        onSearchSubmit={setEventHandlersFilter}
      />
      {fetching && <Progress isIndeterminate size="xs" mt={10} />}
      {!fetching && (data == null || data.conductor.eventHandlers == null || error != null) && (
        <Text>We had a problem to load event handlers for you. Try again later please.</Text>
      )}
      {!fetching && data != null && data.conductor.eventHandlers != null && error == null && (
        <Table background="white">
          <Thead>
            <Tr>
              <Th cursor="pointer" onClick={() => handleSort('isActive')}>
                Is active
                {orderBy.sortKey === 'isActive' && (
                  <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
                )}
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('name')}>
                Name
                {orderBy.sortKey === 'name' && (
                  <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
                )}
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('event')}>
                Event
                {orderBy.sortKey === 'event' && (
                  <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
                )}
              </Th>
              <Th cursor="pointer" onClick={() => handleSort('evaluatorType')}>
                Evaluator type
                {orderBy.sortKey === 'evaluatorType' && (
                  <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
                )}
              </Th>
              <Th>Action types</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.conductor.eventHandlers.edges?.length === 0 && (
              <Tr>
                <Td>No event handlers were created yet.</Td>
              </Tr>
            )}
            {data.conductor.eventHandlers.edges?.length !== 0 &&
              data.conductor.eventHandlers.edges.map(({ node }) => (
                <Tr key={node.id}>
                  <Td>
                    <Switch
                      isChecked={node.isActive ?? false}
                      onChange={(e) =>
                        handleOnIsActiveClick(e, {
                          ...node,
                          actions: node.actions.map((action) => omit(action, ['__typename'])).filter(omitNullValue),
                        })
                      }
                    />
                  </Td>
                  <Td>
                    <ChakraLink color="blue.500" as={Link} to={node.id} title={node.name}>
                      {truncate(node.name, { length: 40 })}
                    </ChakraLink>
                  </Td>
                  <Td title={node.event}>{truncate(node.event, { length: 40 })}</Td>
                  <Td>{node.evaluatorType || 'not defined'}</Td>
                  <Td>{node.actions.map((action) => action?.action).join(', ')}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="edit event handler"
                        size="sm"
                        icon={<FeatherIcon icon="edit" size={12} />}
                        as={Link}
                        to={`${node.id}/edit`}
                      />
                      <IconButton
                        aria-label="delete event handler"
                        size="sm"
                        icon={<FeatherIcon icon="trash-2" size={12} />}
                        colorScheme="red"
                        onClick={() => handleOnEventHandlerDelete(node.name)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      )}
      {data?.conductor.eventHandlers && (
        <Flex justify="space-between">
          <Pagination
            onPrevious={previousPage(data.conductor.eventHandlers.pageInfo.startCursor)}
            onNext={nextPage(data.conductor.eventHandlers.pageInfo.endCursor)}
            hasNextPage={data.conductor.eventHandlers.pageInfo.hasNextPage}
            hasPreviousPage={data.conductor.eventHandlers.pageInfo.hasPreviousPage}
          />
        </Flex>
      )}
    </Container>
  );
};

export default EventHandlersListPage;
