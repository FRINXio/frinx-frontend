import React, { VoidFunctionComponent } from 'react';
import { Container, Heading, Progress, Text } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { gql, useMutation, useQuery } from 'urql';
import { unwrap, useNotifications } from '@frinx/shared';
import EventHandlerForm, { FormValues } from '../../components/event-handler-form/event-handler-form';
import { removeTypenamesFromActionTasks } from '../../helpers/event-handlers.helpers';
import {
  EditEventHandlerMutation,
  EditEventHandlerMutationVariables,
  GetEventHandlerDetailQuery,
  GetEventHandlerDetailQueryVariables,
} from '../../__generated__/graphql';

const GET_EVENT_HANDLER_QUERY = gql`
  query GetEventHandlerDetail($id: ID!) {
    conductor {
      node(id: $id) {
        ... on EventHandler {
          name
          event
          condition
          actions {
            action
            startWorkflow {
              name
              version
              input
              correlationId
              taskToDomain
            }
            completeTask {
              workflowId
              taskId
              output
              taskRefName
            }
            failTask {
              workflowId
              taskId
              output
              taskRefName
            }
            expandInlineJSON
          }
          isActive
          evaluatorType
        }
      }
    }
  }
`;

const UPDATE_EVENT_HANDLER_MUTATION = gql`
  mutation EditEventHandler($input: EditEventHandlerInput!) {
    conductor {
      editEventHandler(input: $input) {
        eventHandler {
          id
          name
        }
      }
    }
  }
`;

const EventHandlerDetailEditPage: VoidFunctionComponent = () => {
  const navigate = useNavigate();
  const { addToastNotification } = useNotifications();
  const { id } = useParams<{ id: string }>();
  const [{ data, fetching, error }] = useQuery<GetEventHandlerDetailQuery, GetEventHandlerDetailQueryVariables>({
    query: GET_EVENT_HANDLER_QUERY,
    variables: {
      id: unwrap(id),
    },
  });
  const [, updateEventHandler] = useMutation<EditEventHandlerMutation, EditEventHandlerMutationVariables>(
    UPDATE_EVENT_HANDLER_MUTATION,
  );

  const handleOnSubmit = (formValues: FormValues) => {
    updateEventHandler({
      input: {
        id: unwrap(id),
        actions: formValues.actions.map((action) => ({
          ...removeTypenamesFromActionTasks(action),
          action: action.action,
          expandInlineJSON: action.expandInlineJSON,
        })),
        condition: formValues.condition,
        isActive: formValues.isActive,
        evaluatorType: formValues.evaluatorType,
      },
    })
      .then((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        navigate('/workflow-manager/event-handlers');
      })
      .catch((err) => {
        addToastNotification({
          title: 'We had a problem to create event handler',
          content: err.message,
          type: 'error',
        });
      });
  };

  if (fetching) {
    return <Progress isIndeterminate mt={-10} size="xs" />;
  }

  if (
    data == null ||
    data.conductor.node == null ||
    error != null ||
    data.conductor.node.__typename !== 'EventHandler'
  ) {
    return (
      <Container maxWidth={1200}>
        <Text>We could not find event handler.</Text>
      </Container>
    );
  }

  const eventHandler = data.conductor.node;

  return (
    <Container maxWidth={1200} mx="auto">
      <Heading mb={5}>Edit {eventHandler.name}</Heading>

      <EventHandlerForm
        isEditing
        formValues={{
          name: eventHandler.name,
          event: eventHandler.event,
          condition: eventHandler.condition,
          evaluatorType: eventHandler.evaluatorType,
          isActive: eventHandler.isActive,
          actions: eventHandler.actions.map((action) => ({
            id: uuid(),
            action: action?.action,
            expandInlineJSON: action?.expandInlineJSON,
            completeTask: {
              ...action?.completeTask,
              output: Object.entries(action?.completeTask?.output ?? {}),
            },
            failTask: {
              ...action?.failTask,
              output: Object.entries(action?.failTask?.output ?? {}),
            },
            startWorkflow: {
              ...action?.startWorkflow,
              input: Object.entries(action?.startWorkflow?.input ?? {}),
              taskToDomain: Object.entries(action?.startWorkflow?.taskToDomain ?? {}),
            },
          })),
        }}
        onSubmit={handleOnSubmit}
      />
    </Container>
  );
};

export default EventHandlerDetailEditPage;
