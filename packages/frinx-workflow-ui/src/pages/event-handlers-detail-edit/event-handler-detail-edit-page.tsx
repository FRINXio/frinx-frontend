import React, { VoidFunctionComponent } from 'react';
import { Container, Heading, Progress, Text } from '@chakra-ui/react';
import { gql, useMutation, useQuery } from 'urql';
import { useNavigate, useParams } from 'react-router-dom';
import { unwrap, useNotifications } from '@frinx/shared';
import { v4 as uuid } from 'uuid';
import EventHandlerForm, { FormValues } from '../../components/event-handler-form/event-handler-form';
import {
  EditEventHandlerMutation,
  EditEventHandlerMutationVariables,
  GetEventHandlerDetailQuery,
  GetEventHandlerDetailQueryVariables,
} from '../../__generated__/graphql';
import { removeTypenamesFromActionTasks } from '../../helpers/event-handlers.helpers';

const GET_EVENT_HANDLER_QUERY = gql`
  query GetEventHandlerDetail($event: String!, $name: String!) {
    eventHandler(event: $event, name: $name) {
      id
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
`;

const UPDATE_EVENT_HANDLER_MUTATION = gql`
  mutation EditEventHandler($event: String!, $name: String!, $input: UpdateEventHandlerInput!) {
    updateEventHandler(event: $event, name: $name, input: $input) {
      id
      name
    }
  }
`;

const EventHandlerDetailEditPage: VoidFunctionComponent = () => {
  const navigate = useNavigate();
  const { addToastNotification } = useNotifications();
  const { event, name } = useParams<{ event: string; name: string }>();
  const [{ data, fetching, error }] = useQuery<GetEventHandlerDetailQuery, GetEventHandlerDetailQueryVariables>({
    query: GET_EVENT_HANDLER_QUERY,
    variables: {
      event: unwrap(event),
      name: unwrap(name),
    },
  });
  const [, updateEventHandler] = useMutation<EditEventHandlerMutation, EditEventHandlerMutationVariables>(
    UPDATE_EVENT_HANDLER_MUTATION,
  );

  const handleOnSubmit = (formValues: FormValues) => {
    updateEventHandler({
      name: formValues.name,
      event: formValues.event,
      input: {
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

  if (data == null || data.eventHandler == null || error != null) {
    return (
      <Container maxWidth={1200}>
        <Text>We could not find event handler.</Text>
      </Container>
    );
  }

  return (
    <Container maxWidth={1200} mx="auto">
      <Heading mb={5}>Edit {name}</Heading>

      <EventHandlerForm
        isEditing
        formValues={{
          name: data.eventHandler.name,
          event: data.eventHandler.event,
          condition: data.eventHandler.condition,
          evaluatorType: data.eventHandler.evaluatorType,
          isActive: data.eventHandler.isActive,
          actions: data.eventHandler.actions.map((action) => ({
            id: uuid(),
            action: action.action,
            expandInlineJSON: action.expandInlineJSON,
            completeTask: {
              ...action.completeTask,
              output: Object.entries(JSON.parse(action.completeTask?.output ?? '{}')),
            },
            failTask: {
              ...action.failTask,
              output: Object.entries(JSON.parse(action.failTask?.output ?? '{}')),
            },
            startWorkflow: {
              ...action.startWorkflow,
              input: Object.entries(JSON.parse(action.startWorkflow?.input ?? '{}')),
              taskToDomain: Object.entries(JSON.parse(action.startWorkflow?.taskToDomain ?? '{}')),
            },
          })),
        }}
        onSubmit={handleOnSubmit}
      />
    </Container>
  );
};

export default EventHandlerDetailEditPage;
