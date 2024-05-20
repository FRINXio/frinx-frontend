import { Box, Container, Heading } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared';
import React, { FC, useState } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import {
  AddStreamMutation,
  AddStreamMutationVariables,
  DevicesAndBlueprintsQuery,
  DevicesAndBlueprintsQueryVariables,
} from '../../__generated__/graphql';
import CreateStreamForm from './create-stream-form';

const ADD_STREAM_MUTATION = gql`
  mutation AddStream($input: AddStreamInput!) {
    deviceInventory {
      addStream(input: $input) {
        stream {
          id
          deviceName
          streamName
        }
      }
    }
  }
`;
const FORM_LISTS_QUERY = gql`
  query DevicesAndBlueprints {
    deviceInventory {
      streams {
        edges {
          node {
            id
            deviceName
            streamName
          }
        }
      }
      devices {
        edges {
          node {
            id
            name
          }
        }
      }
      blueprints {
        edges {
          node {
            id
            name
            template
          }
        }
      }
    }
  }
`;

type FormValues = {
  deviceName: string;
  streamName: string;
  blueprintId: string | null;
  streamParameters: string | null;
};
type Props = {
  onAddStreamSuccess: () => void;
};
type Error = string | null;

const CreateStreamPage: FC<Props> = ({ onAddStreamSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToastNotification } = useNotifications();
  const [, addStream] = useMutation<AddStreamMutation, AddStreamMutationVariables>(ADD_STREAM_MUTATION);
  const [{ data: formListsData }] = useQuery<DevicesAndBlueprintsQuery, DevicesAndBlueprintsQueryVariables>({
    query: FORM_LISTS_QUERY,
  });

  const handleSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    addStream({
      input: {
        deviceName: values.deviceName,
        streamName: values.streamName,
      },
    })
      .then(({ error }) => {
        if (error != null) {
          addToastNotification({ type: 'error', content: "We couldn't add stream" });
        } else {
          addToastNotification({ type: 'success', content: 'Stream successfully added' });
          onAddStreamSuccess();
        }
      })
      .catch(() => addToastNotification({ type: 'error', content: "We couldn't add stream" }))
      .finally(() => setIsSubmitting(false));
  };

  const devices = formListsData?.deviceInventory.devices.edges ?? [];
  const streams = formListsData?.deviceInventory.streams.edges ?? [];
  const blueprints = formListsData?.deviceInventory.blueprints.edges ?? [];

  return (
    <Container maxWidth="container.xl">
      <Heading as="h1" size="xl" marginBottom={6}>
        Add stream
      </Heading>

      <Box background="white" boxShadow="base" px={4} py={2} position="relative">
        <CreateStreamForm
          onFormSubmit={handleSubmit}
          streams={streams}
          devices={devices}
          blueprints={blueprints}
          isSubmitting={isSubmitting}
        />
      </Box>
    </Container>
  );
};

export default CreateStreamPage;
