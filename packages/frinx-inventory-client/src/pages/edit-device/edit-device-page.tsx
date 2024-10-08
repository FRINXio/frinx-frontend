import { Box, Container, Heading, Progress } from '@chakra-ui/react';
import { unwrap, useNotifications } from '@frinx/shared';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import { ServiceState } from '../../helpers/types';
import {
  CreateLabelMutation,
  CreateLabelMutationVariables,
  DeviceQuery,
  DeviceQueryVariables,
  DeviceServiceState,
  DeviceSize,
  Label,
  LabelsQuery,
  LabelsQueryVariables,
  LocationsQuery,
  LocationsQueryVariables,
  UpdateDeviceMutation,
  UpdateDeviceMutationVariables,
  ZonesQuery,
  ZonesQueryVariables,
} from '../../__generated__/graphql';
import EditDeviceForm from './edit-device-form';

const DEVICE_QUERY = gql`
  query Device($id: ID!) {
    deviceInventory {
      device: node(id: $id) {
        id
        ... on Device {
          name
          serviceState
          model
          vendor
          address
          deviceSize
          mountParameters
          location {
            id
          }
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
  }
`;

const UPDATE_DEVICE_MUTATION = gql`
  mutation UpdateDevice($id: String!, $input: UpdateDeviceInput!) {
    deviceInventory {
      updateDevice(id: $id, input: $input) {
        device {
          id
          name
          model
          vendor
          address
          isInstalled
          zone {
            id
            name
          }
        }
      }
    }
  }
`;

const ZONES_QUERY = gql`
  query Zones {
    deviceInventory {
      zones {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

const CREATE_LABEL = gql`
  mutation CreateLabel($input: CreateLabelInput!) {
    deviceInventory {
      newLabel: createLabel(input: $input) {
        label {
          id
          name
          createdAt
          updatedAt
        }
      }
    }
  }
`;

const LABELS_QUERY = gql`
  query Labels {
    deviceInventory {
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
`;

const LOCATIONS_QUERY = gql`
  query Locations {
    deviceInventory {
      locations {
        edges {
          node {
            id
            latitude
            longitude
            name
          }
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
  mountParameters: string | null;
  labelIds: string[];
  serviceState: DeviceServiceState;
  vendor: string | null;
  model: string | null;
  address: string | null;
  deviceSize: DeviceSize;
  locationId: string | null;
};

const EditDevicePage: FC<Props> = ({ onSuccess, onCancelButtonClick }) => {
  const { addToastNotification } = useNotifications();
  const { deviceId } = useParams<{ deviceId: string }>();
  const [, updateDevice] = useMutation<UpdateDeviceMutation, UpdateDeviceMutationVariables>(UPDATE_DEVICE_MUTATION);
  const [{ data: deviceData, fetching: isLoadingDevice }] = useQuery<DeviceQuery, DeviceQueryVariables>({
    query: DEVICE_QUERY,
    variables: { id: unwrap(deviceId) },
  });
  const [{ data: zones, fetching: isLoadingZones }] = useQuery<ZonesQuery, ZonesQueryVariables>({ query: ZONES_QUERY });
  const [{ data: labels, fetching: isLoadingLabels }] = useQuery<LabelsQuery, LabelsQueryVariables>({
    query: LABELS_QUERY,
  });
  const [{ data: locationsData }] = useQuery<LocationsQuery, LocationsQueryVariables>({
    query: LOCATIONS_QUERY,
  });
  const [, createLabel] = useMutation<CreateLabelMutation, CreateLabelMutationVariables>(CREATE_LABEL);

  const handleOnLabelCreate = async (labelName: string): Promise<Label | null> => {
    const result = await createLabel({
      input: {
        name: labelName,
      },
    });

    return result.data?.deviceInventory.newLabel?.label ?? null;
  };

  const handleOnUpdateDevice = (values: FormValues) => {
    updateDevice({
      id: unwrap(deviceId),
      input: {
        labelIds: values.labelIds,
        ...(values.mountParameters && { mountParameters: values.mountParameters }),
        serviceState: values.serviceState,
        model: values.model,
        vendor: values.vendor,
        address: values.address,
        deviceSize: values.deviceSize,
        locationId: values.locationId,
      },
    })
      .then(({ error }) => {
        if (error != null) {
          throw new Error('Problem with saving process');
        }

        onSuccess();
        addToastNotification({
          content: 'Successfull device edit',
          type: 'success',
        });
      })
      .catch(() =>
        addToastNotification({
          content: 'There was a problem with device edit',
          type: 'error',
        }),
      );
  };

  if (isLoadingDevice) {
    return <Progress size="xs" isIndeterminate mt={-10} />;
  }

  if (deviceData == null || deviceData?.deviceInventory.device == null) {
    return null;
  }

  const { device } = deviceData.deviceInventory;

  if (device.__typename !== 'Device') {
    return null;
  }

  const isLoadingForm = (isLoadingZones && zones == null) || (isLoadingLabels && labels == null);

  const formDevice = {
    id: device.id,
    name: device.name,
    vendor: device.vendor,
    host: device.address,
    model: device.model,
    mountParameters: device.mountParameters,
    serviceState: device.serviceState as ServiceState,
    zone: {
      id: device.zone.id,
      name: device.zone.name,
    },
    labels: device.labels.edges.map((e) => ({
      id: e.node.id,
      name: e.node.name,
    })),
    deviceSize: device.deviceSize,
    locationId: device.location?.id,
  };

  const mappedLabels = labels?.deviceInventory.labels.edges ?? [];
  const mappedZones = zones?.deviceInventory.zones.edges ?? [];
  const locations = locationsData?.deviceInventory.locations.edges ?? [];

  return (
    <Container maxWidth={1280}>
      <Heading as="h1" size="xl" marginBottom={6}>
        Edit {device.name}
      </Heading>

      {!isLoadingForm && (
        <Box background="white" boxShadow="base" px={4} py={2} position="relative">
          <EditDeviceForm
            labels={mappedLabels}
            onLabelCreate={handleOnLabelCreate}
            onUpdate={handleOnUpdateDevice}
            onCancel={onCancelButtonClick}
            device={formDevice}
            zones={mappedZones}
            locations={locations}
          />
        </Box>
      )}
    </Container>
  );
};

export default EditDevicePage;
