import { Box, Container, Heading, Progress, useToast } from '@chakra-ui/react';
import React, { FC } from 'react';
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
} from '../../__generated__/graphql';
import CreateDeviceForm from './create-device-form';

const ADD_DEVICE_MUTATION = gql`
  mutation AddDevice($input: AddDeviceInput!) {
    addDevice(input: $input) {
      device {
        id
        name
        model
        address
        vendor
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
  labels: string[];
};
type Props = {
  onAddDeviceSuccess: () => void;
};

const CreateDevicePage: FC<Props> = ({ onAddDeviceSuccess }) => {
  const toast = useToast();
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

  const handleSubmit = async (values: FormValues) => {
    addDevice({
      input: {
        name: values.name,
        mountParameters: values.mountParameters,
        zoneId: values.zoneId,
        labelIds: values.labels,
      },
    }).then(() => {
      toast({
        position: 'top-right',
        status: 'success',
        variant: 'subtle',
        title: 'Device succesfully added',
      });
      onAddDeviceSuccess();
    });
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
      <Heading size="3xl" as="h2" mb={6}>
        Add device
      </Heading>

      <Box background="white" boxShadow="base" px={4} py={2} position="relative">
        <CreateDeviceForm
          onFormSubmit={handleSubmit}
          zones={zones}
          blueprints={blueprints}
          labels={labels}
          onLabelCreate={handleOnCreateLabel}
        />
      </Box>
    </Container>
  );
};

export default CreateDevicePage;
