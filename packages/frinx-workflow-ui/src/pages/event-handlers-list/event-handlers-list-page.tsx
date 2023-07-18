import React, { ChangeEvent, useMemo, VoidFunctionComponent } from 'react';
import {
  Button,
  ButtonGroup,
  Container,
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
import { useNotifications } from '@frinx/shared';
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

type Props = {
  onEventHandlerDetailClick: (event: string, name: string) => void;
  onEventHandlerEditClick: (event: string, name: string) => void;
};

const EVENT_HANDLERS_QUERY = gql`
  query GetEventHandlers {
    eventHandlers {
      edges {
        node {
          actions {
            action
          }
          event
          id
          isActive
          name
          evaluatorType
        }
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

  if (fetching) {
    return <Progress isIndeterminate size="xs" mt={-10} />;
  }

  if (data == null || data.eventHandlers == null || error != null) {
    return <Text>We had a problem to load event handlers for you. Try again later please.</Text>;
  }

  return (
    <Container mx="auto" maxWidth={1200}>
      <HStack mb={4}>
        <Heading as="h1" size="lg">
          Event handlers
        </Heading>

        <Spacer />

        <Button colorScheme="blue" onClick={() => navigate('./add')}>
          Create new handler
        </Button>
      </HStack>

      <Table background="white">
        <Thead>
          <Tr>
            <Th>Is active</Th>
            <Th>Name</Th>
            <Th>Event</Th>
            <Th>Evaluator type</Th>
            <Th>Action types</Th>
            <Th>Available actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.eventHandlers.edges?.map(({ node }) => (
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
    </Container>
  );
};

export default EventHandlersListPage;
