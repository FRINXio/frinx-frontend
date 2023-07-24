import React, { VoidFunctionComponent } from 'react';
import { Container, Heading, Progress, Text } from '@chakra-ui/react';
import { gql, useMutation, useQuery } from 'urql';
import { useParams } from 'react-router-dom';
import { unwrap } from '@frinx/shared';
import EventHandlerForm, { FormValues } from '../../components/event-handler-form/event-handler-form';

const GET_EVENT_HANDLER_QUERY = gql`
  query EventHandler($event: String!, $name: String!) {
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
  mutation UpdateEventHandler($event: String!, $name: String!, $input: UpdateEventHandlerInput!) {
    updateEventHandler(event: $event, name: $name, input: $input) {
      id
      name
    }
  }
`;

const EventHandlerDetailEditPage: VoidFunctionComponent = () => {
  const { event, name } = useParams<{ event: string; name: string }>();
  const [{ data, fetching, error }] = useQuery({
    query: GET_EVENT_HANDLER_QUERY,
    variables: {
      event: unwrap(event),
      name: unwrap(name),
    },
  });
  const [, updateEventHandler] = useMutation(UPDATE_EVENT_HANDLER_MUTATION);

  const handleOnSubmit = (formValues: FormValues) => {
    updateEventHandler(formValues);
  };

  if (fetching) {
    return <Progress isIndeterminate mt={-10} size="xs" />;
  }

  if (data == null || error != null) {
    <Container maxWidth={1200}>
      <Text>We could not find event handler.</Text>
    </Container>;
  }

  return (
    <Container maxWidth={1200} mx="auto">
      <Heading mb={5}>Add Event Handler</Heading>

      <EventHandlerForm
        formValues={{
          name: '',
          event: '',
          actions: [],
          condition: '',
          isActive: true,
          evaluatorType: 'default',
        }}
        onSubmit={handleOnSubmit}
      />
    </Container>
  );
};

export default EventHandlerDetailEditPage;
