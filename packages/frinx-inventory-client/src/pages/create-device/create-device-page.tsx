import { Container, Heading, Box, useToast, Progress } from '@chakra-ui/react';
import React, { FC } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import {
  AddDeviceMutation,
  AddDeviceMutationVariables,
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
        status
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
  const [{ data, fetching }] = useQuery<ZonesQuery, ZonesQueryVariables>({ query: ZONES_QUERY });
  const [{ data: labelsData, fetching: fetchingLabels }] = useQuery<LabelsQuery, LabelsQueryVariables>({
    query: LABELS_QUERY,
  });

  const handleOnCreateLabel = async (labelName: string) => {
    const result = await createLabel({ input: { name: labelName } });
    return result.data?.newLabel.label as Label;
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

  if (fetching || fetchingLabels) {
    return <Progress size="xs" isIndeterminate mt={-10} />;
  }

  const zones = data?.zones.edges ?? [];
  const labels = labelsData?.labels.edges ?? [];

  return (
    <Container maxWidth={1280}>
      <Heading size="3xl" as="h2" mb={2}>
        Add device
      </Heading>
      <Box background="white" boxShadow="base" px={4} py={2} height="100%">
        {zones != null && (
          <CreateDeviceForm
            onFormSubmit={handleSubmit}
            zones={zones}
            labels={labels}
            onLabelCreate={handleOnCreateLabel}
          />
        )}
      </Box>
    </Container>
  );
};

export default CreateDevicePage;
