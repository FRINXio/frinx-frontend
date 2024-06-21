import { Box, Container, Heading, Progress } from '@chakra-ui/react';
import { unwrap, useNotifications } from '@frinx/shared';
import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import {
  StreamQuery,
  StreamQueryVariables,
  UpdateStreamMutation,
  UpdateStreamMutationVariables,
} from '../../__generated__/graphql';
import EditStreamForm from './edit-stream-form';

const STREAM_QUERY = gql`
  query Stream($id: ID!) {
    deviceInventory {
      stream: node(id: $id) {
        id
        ... on Stream {
          streamName
          deviceName
          streamParameters
        }
      }
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

const UPDATE_STREAM_MUTATION = gql`
  mutation UpdateStream($id: String!, $input: UpdateStreamInput!) {
    deviceInventory {
      updateStream(id: $id, input: $input) {
        stream {
          id
          streamName
          deviceName
          isActive
        }
      }
    }
  }
`;

type Props = {
  onSuccess: () => void;
  onCancelButtonClick: () => void;
};

type FormValues = {
  streamParameters: string | null;
  streamName: string;
  deviceName: string;
};

const EditStreamPage: FC<Props> = ({ onSuccess, onCancelButtonClick }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToastNotification } = useNotifications();
  const { streamId } = useParams<{ streamId: string }>();
  const [, updateStream] = useMutation<UpdateStreamMutation, UpdateStreamMutationVariables>(UPDATE_STREAM_MUTATION);
  const [{ data: streamData, fetching: isLoadingStream }] = useQuery<StreamQuery, StreamQueryVariables>({
    query: STREAM_QUERY,
    variables: { id: unwrap(streamId) },
  });

  const handleOnUpdateStream = (values: FormValues) => {
    setIsSubmitting(true);
    updateStream({
      id: unwrap(streamId),
      input: {
        ...(values.streamParameters && { streamParameters: values.streamParameters }),
        streamName: values.streamName,
        deviceName: values.deviceName,
      },
    })
      .then(({ error }) => {
        if (error != null) {
          throw new Error('Problem with saving process');
        }

        onSuccess();
        addToastNotification({
          content: 'Successfull stream edit',
          type: 'success',
        });
      })
      .catch(() =>
        addToastNotification({
          content: 'There was a problem with stream edit',
          type: 'error',
        }),
      )
      .finally(() => setIsSubmitting(false));
  };

  if (isLoadingStream) {
    return <Progress size="xs" isIndeterminate mt={-10} />;
  }

  if (streamData == null || streamData?.deviceInventory.stream == null) {
    return null;
  }

  const { stream } = streamData.deviceInventory;

  if (stream.__typename !== 'Stream') {
    return null;
  }

  const formStream = {
    id: stream.id,
    streamName: stream.streamName,
    deviceName: stream.deviceName,
    streamParameters: stream.streamParameters,
    blueprintId: null,
  };

  const devices = streamData.deviceInventory.devices.edges ?? [];
  const streams = streamData.deviceInventory.streams.edges ?? [];
  const blueprints = streamData.deviceInventory.blueprints.edges ?? [];

  return (
    <Container maxWidth={1280}>
      <Heading as="h1" size="xl" marginBottom={6}>
        Edit {`${stream.streamName} on device ${stream.deviceName}`}
      </Heading>

      <Box background="white" boxShadow="base" px={4} py={2} position="relative">
        <EditStreamForm
          onUpdate={handleOnUpdateStream}
          onCancel={onCancelButtonClick}
          editedStream={formStream}
          streams={streams}
          devices={devices}
          blueprints={blueprints}
          isSubmitting={isSubmitting}
        />
      </Box>
    </Container>
  );
};

export default EditStreamPage;
