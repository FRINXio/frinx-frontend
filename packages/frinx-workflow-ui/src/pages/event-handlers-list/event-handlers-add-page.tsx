import React from 'react';
import { Container, Heading } from '@chakra-ui/react';
import { gql, useMutation } from 'urql';
import EventHandlerForm from '../../components/event-handler-form/event-handler-form';

const CREATE_EVENT_HANDLER = gql`
  mutation Mutation($input: CreateEventHandlerInput!) {
    createEventHandler(input: $input) {
      id
      name
      event
    }
  }
`;

const EventHandlersAddPage = () => {
  const [, createEventHandler] = useMutation(CREATE_EVENT_HANDLER);
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
        onSubmit={() => {
          console.log('submit');
        }}
      />
    </Container>
  );
};

export default EventHandlersAddPage;
