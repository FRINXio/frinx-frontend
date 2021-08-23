import React, { useState, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import { Box, Button, Container, Flex, Heading, Progress, useToast } from '@chakra-ui/react';
import DeviceTable from './device-table';
import {
  DevicesQuery,
  DevicesQueryVariables,
  InstallDeviceMutation,
  InstallDeviceMutationVariables,
  UninstallDeviceMutation,
  UninstallDeviceMutationVariables,
} from '../../__generated__/graphql';
import SearchByLabelInput from '../../components/search-by-label-input';

const LABELS = ['label', 'hostname', 'ip', 'mac'];

const DEVICES_QUERY = gql`
  query Devices {
    devices {
      edges {
        node {
          id
          name
          model
          vendor
          address
          status
          zone {
            id
            name
          }
        }
      }
    }
  }
`;
const INSTALL_DEVICE_MUTATION = gql`
  mutation InstallDevice($id: String!) {
    installDevice(id: $id) {
      device {
        id
        status
      }
    }
  }
`;
const UNINSTALL_DEVICE_MUTATION = gql`
  mutation UninstallDevice($id: String!) {
    uninstallDevice(id: $id) {
      device {
        id
        status
      }
    }
  }
`;

type Props = {
  onAddButtonClick: () => void;
  onSettingsButtonClick: (deviceId: string) => void;
};

const DeviceList: VoidFunctionComponent<Props> = ({ onAddButtonClick, onSettingsButtonClick }) => {
  const toast = useToast();
  const [selectedLabels, setSelectedLabels] = useState<string[]>(['']);
  const [labels, setLabels] = useState<string[]>([]);
  const [{ data, fetching, error }] = useQuery<DevicesQuery, DevicesQueryVariables>({ query: DEVICES_QUERY });
  const [{ fetching: isInstalLoading }, installDevice] = useMutation<
    InstallDeviceMutation,
    InstallDeviceMutationVariables
  >(INSTALL_DEVICE_MUTATION);
  const [{ fetching: isUninstallLoading }, uninstallDevice] = useMutation<
    UninstallDeviceMutation,
    UninstallDeviceMutationVariables
  >(UNINSTALL_DEVICE_MUTATION);

  if (fetching) {
    return <Progress size="xs" isIndeterminate mt={-10} />;
  }

  if (error || data == null) {
    return null;
  }

  const handleInstallButtonClick = (deviceId: string) => {
    installDevice({
      id: deviceId,
    }).then(() => {
      toast({
        position: 'top-right',
        variant: 'subtle',
        status: 'success',
        title: 'Device succesfully installed',
      });
    });
  };

  const handleUninstallButtonClick = (deviceId: string) => {
    uninstallDevice({
      id: deviceId,
    }).then(() => {
      toast({
        position: 'top-right',
        variant: 'subtle',
        status: 'success',
        title: 'Device succesfully uninstalled',
      });
    });
  };

  const handleLabelRemoval = (label: string) => {
    setSelectedLabels(selectedLabels.filter((l) => l !== label));
  };

  const handleLabelAddition = (label: string) => {
    setSelectedLabels(selectedLabels.concat(label));
  };

  const handleOnLabelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabels(LABELS.filter((l) => l.includes(e.target.value)));
  };

  const { devices } = data!;

  return (
    <Container maxWidth={1280}>
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h2" size="3xl">
          Devices
        </Heading>
        <Button colorScheme="blue" onClick={onAddButtonClick}>
          Add device
        </Button>
      </Flex>
      <Box mb={4}>
        <SearchByLabelInput
          labels={labels}
          onRemove={handleLabelRemoval}
          onAdd={handleLabelAddition}
          selectedLabels={selectedLabels}
          onChange={handleOnLabelInputChange}
        />
      </Box>
      <DeviceTable
        devices={devices.edges}
        onInstallButtonClick={handleInstallButtonClick}
        onUninstallButtonClick={handleUninstallButtonClick}
        onSettingsButtonClick={onSettingsButtonClick}
        isLoading={isInstalLoading || isUninstallLoading}
      />
    </Container>
  );
};

export default DeviceList;
