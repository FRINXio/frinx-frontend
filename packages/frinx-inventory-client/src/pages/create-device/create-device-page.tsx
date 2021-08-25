import { Container, Heading, Box, useToast } from '@chakra-ui/react';
import React, { FC } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import {
  AddDeviceMutation,
  AddDeviceMutationVariables,
  ZonesQuery,
  ZonesQueryVariables,
  CreateLabelMutation,
  CreateLabelMutationVariables,
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

type FormValues = {
  name: string;
  zoneId: string;
  mountParameters: string;
  labels: string;
};
type Props = {
  onAddDeviceSuccess: () => void;
};

const CreateDevicePage: FC<Props> = ({ onAddDeviceSuccess }) => {
  const toast = useToast();
  const [, addDevice] = useMutation<AddDeviceMutation, AddDeviceMutationVariables>(ADD_DEVICE_MUTATION);
  const [, createLabel] = useMutation<CreateLabelMutation, CreateLabelMutationVariables>(CREATE_LABEL);
  const [{ data, fetching, error }] = useQuery<ZonesQuery, ZonesQueryVariables>({ query: ZONES_QUERY });

  const handleSubmit = async (values: FormValues) => {
    const labels = await Promise.all(
      values.labels.split(',').map(async (label) => {
        const { data: createdLabel } = await createLabel({ input: { name: label } });

        if (createdLabel == null) return null;

        return createdLabel.newLabel;
      }),
    );
    addDevice({
      input: {
        name: values.name,
        mountParameters: values.mountParameters,
        zoneId: values.zoneId,
        labelIds: [...labels].filter(Boolean).map((label) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return label!.label!.id;
        }),
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

  if (fetching || error) {
    return null;
  }

  const zones = data?.zones.edges ?? [];

  return (
    <Container maxWidth={1280}>
      <Heading size="3xl" as="h2" mb={2}>
        Add device
      </Heading>
      <Box background="white" boxShadow="base" px={4} py={2} height="100%">
        {zones != null && <CreateDeviceForm onFormSubmit={handleSubmit} zones={zones} />}
      </Box>
    </Container>
  );
};

export default CreateDevicePage;
