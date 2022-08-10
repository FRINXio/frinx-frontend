import { Box, Container, Heading, Progress } from '@chakra-ui/react';
import { useResponseToasts, unwrap } from '@frinx/shared/src';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import {
  CreateLabelMutation,
  CreateLabelMutationVariables,
  DeviceQuery,
  DeviceQueryVariables,
  DeviceServiceState,
  Label,
  LabelsQuery,
  LabelsQueryVariables,
  UpdateDeviceMutation,
  UpdateDeviceMutationVariables,
  ZonesQuery,
  ZonesQueryVariables,
} from '../../__generated__/graphql';
import EditDeviceForm from './edit-device-form';

const DEVICE_QUERY = gql`
  query Device($id: ID!) {
    device: node(id: $id) {
      id
      ... on Device {
        name
        serviceState
        mountParameters
        zone {
          id
          name
        }
        labels {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`;

const UPDATE_DEVICE_MUTATION = gql`
  mutation UpdateDevice($id: String!, $input: UpdateDeviceInput!) {
    updateDevice(id: $id, input: $input) {
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

type Props = {
  onSuccess: () => void;
  onCancelButtonClick: () => void;
};

type FormValues = {
  zoneId: string;
  mountParameters: string;
  labels: string[];
  serviceState: DeviceServiceState;
};

const EditDevicePage: FC<Props> = ({ onSuccess, onCancelButtonClick }) => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [{ data: updateDeviceData, error: updateDeviceError }, updateDevice] = useMutation<
    UpdateDeviceMutation,
    UpdateDeviceMutationVariables
  >(UPDATE_DEVICE_MUTATION);
  const [{ data: deviceData, fetching: isLoadingDevice }] = useQuery<DeviceQuery, DeviceQueryVariables>({
    query: DEVICE_QUERY,
    variables: { id: unwrap(deviceId) },
  });
  const [{ data: zones, fetching: isLoadingZones }] = useQuery<ZonesQuery, ZonesQueryVariables>({ query: ZONES_QUERY });
  const [{ data: labels, fetching: isLoadingLabels }] = useQuery<LabelsQuery, LabelsQueryVariables>({
    query: LABELS_QUERY,
  });
  const [, createLabel] = useMutation<CreateLabelMutation, CreateLabelMutationVariables>(CREATE_LABEL);

  const isUpdateSuccessfull = updateDeviceData != null;
  const isUpdateFailed = updateDeviceError != null;

  useResponseToasts({
    isSuccess: isUpdateSuccessfull,
    isFailure: isUpdateFailed,
    successMessage: 'Device succesfully edited',
    failureMessage: 'Device could not be edited',
  });

  const handleOnLabelCreate = async (labelName: string): Promise<Label | null> => {
    const result = await createLabel({
      input: {
        name: labelName,
      },
    });

    return result.data?.newLabel?.label ?? null;
  };

  const handleOnUpdateDevice = (values: FormValues) => {
    updateDevice({
      id: unwrap(deviceId),
      input: {
        labelIds: values.labels,
        mountParameters: values.mountParameters,
        serviceState: values.serviceState,
      },
    }).then(() => {
      onSuccess();
    });
  };

  if (isLoadingDevice) {
    return <Progress size="xs" isIndeterminate mt={-10} />;
  }

  if (deviceData == null || deviceData?.device == null) {
    return null;
  }

  const { device } = deviceData;

  if (device.__typename !== 'Device') {
    return null;
  }

  const isLoadingForm = (isLoadingZones && zones == null) || (isLoadingLabels && labels == null);
  const {
    name,
    mountParameters,
    zone,
    serviceState,
    labels: { edges: labelEdges },
  } = device;
  const mappedLabels = labels?.labels.edges ?? [];
  const mappedZones = zones?.zones.edges ?? [];

  return (
    <Container maxWidth={1280}>
      <Heading size="3xl" as="h2" mb={6}>
        Edit {name}
      </Heading>

      {!isLoadingForm && (
        <Box background="white" boxShadow="base" px={4} py={2} position="relative">
          <EditDeviceForm
            labels={mappedLabels}
            onLabelCreate={handleOnLabelCreate}
            onUpdate={handleOnUpdateDevice}
            onCancel={onCancelButtonClick}
            zones={mappedZones}
            mountParameters={mountParameters}
            zoneId={zone?.id}
            serviceState={serviceState}
            initialSelectedLabels={labelEdges}
          />
        </Box>
      )}
    </Container>
  );
};

export default EditDevicePage;
