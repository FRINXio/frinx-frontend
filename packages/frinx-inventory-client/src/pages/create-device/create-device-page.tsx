import { Box, Container, Heading, Progress } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared/src';
import React, { FC, useState } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import {
  AddDeviceMutation,
  AddDeviceMutationVariables,
  DeviceBlueprintsQuery,
  DeviceBlueprintsQueryVariables,
  ZonesQuery,
  ZonesQueryVariables,
  CreateLabelMutation,
  CreateLabelMutationVariables,
  LabelsQuery,
  LabelsQueryVariables,
  Label,
  DeviceServiceState,
} from '../../__generated__/graphql';
import CreateDeviceForm from './create-device-form';

const ADD_DEVICE_MUTATION = gql`
  mutation AddDevice($input: AddDeviceInput!) {
    addDevice(input: $input) {
      device {
        id
        name
        isInstalled
        zone {
          id
          name
        }
      }
    }
  }
`;
const ZONES_QUERY = gql`
  query Zones {
    zones {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
const BLUEPRINTS_QUERY = gql`
  query DeviceBlueprints {
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
`;

const CREATE_LABEL = gql`
  mutation CreateLabel($input: CreateLabelInput!) {
    newLabel: createLabel(input: $input) {
      label {
        id
        name
        createdAt
        updatedAt
      }
    }
  }
`;

const LABELS_QUERY = gql`
  query Labels {
    labels {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

type FormValues = {
  name: string;
  zoneId: string;
  mountParameters: string;
  labelIds: string[];
  serviceState: DeviceServiceState;
  blueprintId: string | null;
  model: string;
  address: string;
  username: string;
  password: string;
  deviceType: string;
  version: string;
  vendor: string;
  port: number;
};
type Props = {
  onAddDeviceSuccess: () => void;
};

const CreateDevicePage: FC<Props> = ({ onAddDeviceSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToastNotification } = useNotifications();
  const [, addDevice] = useMutation<AddDeviceMutation, AddDeviceMutationVariables>(ADD_DEVICE_MUTATION);
  const [, createLabel] = useMutation<CreateLabelMutation, CreateLabelMutationVariables>(CREATE_LABEL);
  const [{ data: labelsData, fetching: isFetchingLabels }] = useQuery<LabelsQuery, LabelsQueryVariables>({
    query: LABELS_QUERY,
  });
  const [{ data: zonesData, fetching: isFetchingZones, error: zonesError }] = useQuery<ZonesQuery, ZonesQueryVariables>(
    { query: ZONES_QUERY },
  );
  const [{ data: blueprintsData, fetching: isFetchingBlueprints, error: blueprintsError }] = useQuery<
    DeviceBlueprintsQuery,
    DeviceBlueprintsQueryVariables
  >({
    query: BLUEPRINTS_QUERY,
  });

  const handleOnCreateLabel = async (labelName: string): Promise<Label | null> => {
    const result = await createLabel({ input: { name: labelName } });
    return result.data?.newLabel.label ?? null;
  };

  const handleSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    addDevice({
      input: values,
    })
      .then(({ error }) => {
        if (error != null) {
          throw new Error('Problem with device addition');
        }
        onAddDeviceSuccess();
        addToastNotification({
          content: 'Device successfully added',
          type: 'success',
        });
      })
      .catch(() => addToastNotification({ content: "We couldn't add device", type: 'error' }))
      .finally(() => setIsSubmitting(false));
  };

  if (isFetchingZones || isFetchingLabels) {
    return <Progress size="xs" isIndeterminate mt={-10} />;
  }

  const labels = labelsData?.labels.edges ?? [];

  const zones = zonesData?.zones.edges ?? [];
  const blueprints = blueprintsData?.blueprints.edges ?? [];

  if (isFetchingZones && isFetchingBlueprints) {
    return null;
  }

  if (zonesError != null || blueprintsError != null) {
    return null;
  }

  return (
    <Container maxWidth={1280}>
      <Heading as="h1" size="xl" marginBottom={6}>
        Add device
      </Heading>

      <Box background="white" boxShadow="base" px={4} py={2} position="relative">
        <CreateDeviceForm
          onFormSubmit={handleSubmit}
          zones={zones}
          blueprints={blueprints}
          labels={labels}
          onLabelCreate={handleOnCreateLabel}
          isSubmitting={isSubmitting}
        />
      </Box>
    </Container>
  );
};

export default CreateDevicePage;
