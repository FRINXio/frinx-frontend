import React, { FC } from 'react';
import { gql, useMutation, useQuery } from 'urql';

import { Container, Heading, Progress, useToast } from '@chakra-ui/react';
import EditDeviceForm from './edit-device-form';
import {
  CreateLabelMutation,
  CreateLabelMutationVariables,
  Label,
  LabelsQuery,
  LabelsQueryVariables,
  UpdateDeviceMutation,
  UpdateDeviceMutationVariables,
  ZonesQuery,
  ZonesQueryVariables,
} from '../../__generated__/graphql';
import { ServiceState } from '../../helpers/types';

const DEVICE_QUERY = gql`
  query Device($id: ID!) {
    device: node(id: $id) {
      id
      ... on Device {
        name
        serviceState
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
  deviceId: string;
  onSuccess: () => void;
};

type FormValues = {
  zoneId: string;
  mountParameters: string;
  labels: string[];
  serviceState: ServiceState;
};

const EditDevicePage: FC<Props> = ({ deviceId, onSuccess }) => {
  const toast = useToast();

  const [, updateDevice] = useMutation<UpdateDeviceMutation, UpdateDeviceMutationVariables>(UPDATE_DEVICE_MUTATION);
  const [{ data: deviceData, fetching: isLoadingDevice }] = useQuery({
    query: DEVICE_QUERY,
    variables: { id: deviceId },
  });
  const [{ data: zones, fetching: isLoadingZones }] = useQuery<ZonesQuery, ZonesQueryVariables>({ query: ZONES_QUERY });
  const [{ data: labels, fetching: isLoadingLabels }] = useQuery<LabelsQuery, LabelsQueryVariables>({
    query: LABELS_QUERY,
  });
  const [, createLabel] = useMutation<CreateLabelMutation, CreateLabelMutationVariables>(CREATE_LABEL);

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
      id: deviceId,
      input: {
        labelIds: values.labels,
        mountParameters: values.mountParameters,
        serviceState: values.serviceState,
      },
    })
      .then(() => {
        toast({
          position: 'top-right',
          status: 'success',
          variant: 'subtle',
          title: 'Device succesfully added',
        });

        onSuccess();
      })
      .catch((error) => {
        toast({
          position: 'top-right',
          status: 'error',
          variant: 'subtle',
          title: error.message,
        });
      });
  };

  if (isLoadingDevice) {
    return <Progress size="xs" isIndeterminate mt={-10} />;
  }

  const isLoadingForm = (isLoadingZones && zones == null) || (isLoadingLabels && labels == null);
  const {
    name,
    mountParameters,
    zone,
    serviceState,
    labels: { edges: labelEdges },
  } = deviceData?.device ?? { name: '', mountParameters: [], zone: null, serviceState: '', labels: { edges: [] } };
  const mappedLabels = labels?.labels.edges ?? [];
  const mappedZones = zones?.zones.edges ?? [];

  return (
    <Container maxWidth={1280}>
      <Heading as="h2" size="md" marginBottom={4}>
        Edit {name}
      </Heading>

      {!isLoadingForm && (
        <EditDeviceForm
          labels={mappedLabels}
          onLabelCreate={handleOnLabelCreate}
          onUpdate={handleOnUpdateDevice}
          zones={mappedZones}
          mountParameters={mountParameters}
          zoneId={zone?.id}
          serviceState={serviceState}
          initialSelectedLabels={labelEdges}
        />
      )}
    </Container>
  );
};

export default EditDevicePage;
