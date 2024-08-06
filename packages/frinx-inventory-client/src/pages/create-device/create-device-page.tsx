import { Box, Container, Heading } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared';
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
  DeviceSize,
  AddLocationMutation,
  AddLocationMutationVariables,
  LocationsQuery,
  LocationsQueryVariables,
} from '../../__generated__/graphql';
import CreateDeviceForm from './create-device-form';

const ADD_DEVICE_MUTATION = gql`
  mutation AddDevice($input: AddDeviceInput!) {
    deviceInventory {
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
const BLUEPRINTS_QUERY = gql`
  query DeviceBlueprints {
    deviceInventory {
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

const ADD_LOCATION_MUTATION = gql`
  mutation AddLocation($addLocationInput: AddLocationInput!) {
    deviceInventory {
      addLocation(input: $addLocationInput) {
        location {
          id
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

type FormValues = {
  name: string;
  zoneId: string;
  mountParameters: string | null;
  labelIds: string[];
  serviceState: DeviceServiceState;
  blueprintId: string | null;
  model: string;
  address: string;
  username: string;
  password: string;
  deviceType: string;
  deviceSize: DeviceSize;
  version: string;
  vendor: string;
  port: number;
  locationId: string;
};
export type LocationData = {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};
type Props = {
  onAddDeviceSuccess: () => void;
};
type Error = string | null;

export const locationDataInitialState = {
  name: '',
  coordinates: {
    latitude: 0,
    longitude: 0,
  },
};

const CreateDevicePage: FC<Props> = ({ onAddDeviceSuccess }) => {
  const [deviceNameError, setDeviceNameError] = useState<Error>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToastNotification } = useNotifications();
  const [, addDevice] = useMutation<AddDeviceMutation, AddDeviceMutationVariables>(ADD_DEVICE_MUTATION);
  const [, addLocation] = useMutation<AddLocationMutation, AddLocationMutationVariables>(ADD_LOCATION_MUTATION);

  const [, createLabel] = useMutation<CreateLabelMutation, CreateLabelMutationVariables>(CREATE_LABEL);
  const [{ data: labelsData }] = useQuery<LabelsQuery, LabelsQueryVariables>({
    query: LABELS_QUERY,
  });
  const [{ data: locationsData }] = useQuery<LocationsQuery, LocationsQueryVariables>({
    query: LOCATIONS_QUERY,
  });
  const [{ data: zonesData, error: zonesError }] = useQuery<ZonesQuery, ZonesQueryVariables>({ query: ZONES_QUERY });
  const [{ data: blueprintsData, error: blueprintsError }] = useQuery<
    DeviceBlueprintsQuery,
    DeviceBlueprintsQueryVariables
  >({
    query: BLUEPRINTS_QUERY,
  });

  const handleOnCreateLabel = async (labelName: string): Promise<Label | null> => {
    const result = await createLabel({ input: { name: labelName } });
    return result.data?.deviceInventory.newLabel.label ?? null;
  };

  const handleAddLocation = (locationData: LocationData) => {
    addLocation({
      addLocationInput: locationData,
    });
  };

  const handleSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    addDevice({
      input: {
        ...values,
        ...(values.mountParameters && { mountParameters: values.mountParameters }),
      },
    })
      .then(({ error }) => {
        if (
          error?.message ===
          '[GraphQL] There is a unique constraint violation, a new device cannot be added with this name.'
        ) {
          setDeviceNameError('Device with this name alredy exists. Please enter a different name.');
        }
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

  const labels = labelsData?.deviceInventory.labels.edges ?? [];
  const locations = locationsData?.deviceInventory.locations.edges ?? [];
  const zones = zonesData?.deviceInventory.zones.edges ?? [];
  const blueprints = blueprintsData?.deviceInventory.blueprints.edges ?? [];

  if (zonesError != null || blueprintsError != null) {
    return null;
  }

  return (
    <Container maxWidth="container.xl">
      <Heading as="h1" size="xl" marginBottom={6}>
        Add device
      </Heading>

      <Box background="white" boxShadow="base" px={4} py={2} position="relative">
        <CreateDeviceForm
          onAddDeviceLocation={handleAddLocation}
          locations={locations}
          deviceNameError={deviceNameError}
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
