import React from 'react';
import { Container, Heading } from '@chakra-ui/react';
import { gql, useMutation } from 'urql';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@frinx/shared';
import EventHandlerForm, { FormValues } from '../../components/event-handler-form/event-handler-form';
import {} from '../../__generated__/graphql';

const CREATE_EVENT_HANDLER = gql`
  mutation CreateEventHandler($input: CreateEventHandlerInput!) {
    conductor {
      createEventHandler(input: $input) {
        eventHandler {
          id
          name
          event
        }
      }
    }
  }
`;

const EventHandlersAddPage = () => {
  const navigate = useNavigate();
  const { addToastNotification } = useNotifications();
  // TODO: FIXME
  const [, createEventHandler] = useMutation<unknown>(CREATE_EVENT_HANDLER);

  const handleOnSubmit = (formValues: FormValues) => {
    createEventHandler({
      input: {
        name: formValues.name,
        event: formValues.event,
        actions: formValues.actions.map((action) => ({
          action: action.action,
          expandInlineJSON: action.expandInlineJSON,
          completeTask: {
            ...action.completeTask,
            output: JSON.stringify(Object.fromEntries(action.completeTask?.output ?? [])),
          },
          failTask: {
            ...action.failTask,
            output: JSON.stringify(Object.fromEntries(action.failTask?.output ?? [])),
          },
          startWorkflow: {
            ...action.startWorkflow,
            input: JSON.stringify(Object.fromEntries(action.startWorkflow?.input ?? [])),
            taskToDomain: JSON.stringify(Object.fromEntries(action.startWorkflow?.taskToDomain ?? [])),
          },
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

  return (
    <Container maxWidth={1200} mx="auto">
      <Heading mb={5}>Add Event Handler</Heading>

      <EventHandlerForm
        formValues={{
          name: '',
          event: '',
          actions: [],
          condition: '',
          isActive: false,
          evaluatorType: 'default',
        }}
        onSubmit={handleOnSubmit}
      />
    </Container>
  );
};

export default EventHandlersAddPage;
