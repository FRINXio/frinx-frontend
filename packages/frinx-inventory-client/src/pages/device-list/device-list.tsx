import React, { useEffect, useMemo, useState, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import { Box, Button, Container, Flex, Heading, Progress, useToast } from '@chakra-ui/react';
import { Item } from 'chakra-ui-autocomplete';
import DeviceTable from './device-table';
import {
  DevicesQuery,
  DevicesQueryVariables,
  InstallDeviceMutation,
  InstallDeviceMutationVariables,
  UninstallDeviceMutation,
  UninstallDeviceMutationVariables,
  FilterLabelsQuery,
  DeleteDeviceMutation,
  DeleteDeviceMutationVariables,
} from '../../__generated__/graphql';
import SearchByLabelInput from '../../components/search-by-label-input';

const DEVICES_QUERY = gql`
  query Devices($labelIds: [String!]) {
    devices(filter: { labelIds: $labelIds }) {
      edges {
        node {
          id
          name
          createdAt
          isInstalled
          serviceState
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
        createdAt
        isInstalled
        serviceState
      }
    }
  }
`;
const UNINSTALL_DEVICE_MUTATION = gql`
  mutation UninstallDevice($id: String!) {
    uninstallDevice(id: $id) {
      device {
        id
        createdAt
        isInstalled
        serviceState
      }
    }
  }
`;
const LABELS_QUERY = gql`
  query FilterLabels {
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
const DELETE_DEVICE_MUTATION = gql`
  mutation DeleteDevice($deviceId: String!) {
    deleteDevice(id: $deviceId) {
      device {
        id
      }
    }
  }
`;

type Props = {
  onAddButtonClick: () => void;
  onSettingsButtonClick: (deviceId: string) => void;
};

const DeviceList: VoidFunctionComponent<Props> = ({ onAddButtonClick, onSettingsButtonClick }) => {
  const context = useMemo(() => ({ additionalTypenames: ['Device'] }), []);
  const toast = useToast();
  const [selectedLabels, setSelectedLabels] = useState<Item[]>([]);
  const [installLoadingMap, setInstallLoadingMap] = useState<Record<string, boolean>>({});
  const [{ data, fetching: isFetchingDevices, error }] = useQuery<DevicesQuery, DevicesQueryVariables>({
    query: DEVICES_QUERY,
    variables: { labelIds: selectedLabels.map((label) => label.value) },
    context,
  });
  const [{ data: labelsData, fetching: isFetchingLabels }] = useQuery<FilterLabelsQuery>({ query: LABELS_QUERY });
  const [{ data: installDeviceData, error: installDeviceError }, installDevice] = useMutation<
    InstallDeviceMutation,
    InstallDeviceMutationVariables
  >(INSTALL_DEVICE_MUTATION);
  const [, uninstallDevice] = useMutation<UninstallDeviceMutation, UninstallDeviceMutationVariables>(
    UNINSTALL_DEVICE_MUTATION,
  );
  const [{ data: deleteDeviceData, error: deleteDeviceError }, deleteDevice] = useMutation<
    DeleteDeviceMutation,
    DeleteDeviceMutationVariables
  >(DELETE_DEVICE_MUTATION);

  useEffect(() => {
    if (installDeviceData) {
      toast({
        position: 'top-right',
        variant: 'subtle',
        status: 'success',
        title: 'Device succesfully installed',
      });
    }
    if (installDeviceError) {
      toast({
        position: 'top-right',
        variant: 'subtle',
        status: 'error',
        title: 'Device could not be installed',
      });
    }
  }, [installDeviceData, installDeviceError, toast]);

  useEffect(() => {
    if (deleteDeviceData) {
      toast({
        position: 'top-right',
        variant: 'subtle',
        status: 'success',
        title: 'Device succesfully deleted',
      });
    }
    if (deleteDeviceError) {
      toast({
        position: 'top-right',
        variant: 'subtle',
        status: 'error',
        title: 'Device could not be deleted',
      });
    }
  }, [deleteDeviceData, deleteDeviceError, toast]);

  if ((isFetchingDevices && data == null) || isFetchingLabels) {
    return (
      <Box position="relative">
        <Box position="absolute" top={0} right={0} left={0}>
          <Progress size="xs" isIndeterminate />
        </Box>
      </Box>
    );
  }

  if (error) {
    return <div>{error.toString()}</div>;
  }

  const handleInstallButtonClick = (deviceId: string) => {
    setInstallLoadingMap((m) => {
      return {
        ...m,
        [deviceId]: true,
      };
    });
    installDevice({
      id: deviceId,
    }).then(() => {
      setInstallLoadingMap((m) => {
        return {
          ...m,
          [deviceId]: false,
        };
      });
    });
  };

  const handleUninstallButtonClick = (deviceId: string) => {
    setInstallLoadingMap((m) => {
      return {
        ...m,
        [deviceId]: true,
      };
    });
    uninstallDevice({
      id: deviceId,
    })
      .then(() => {
        toast({
          position: 'top-right',
          variant: 'subtle',
          status: 'success',
          title: 'Device succesfully uninstalled',
        });
      })
      .finally(() => {
        setInstallLoadingMap((m) => {
          return {
            ...m,
            [deviceId]: false,
          };
        });
      });
  };

  const handleDeleteBtnClick = (deviceId: string) => {
    deleteDevice({
      deviceId,
    }).then(() => {
      toast({
        position: 'top-right',
        variant: 'subtle',
        status: 'success',
        title: 'Device succesfully deleted',
      });
    });
  };

  const handleOnSelectionChange = (selectedItems?: Item[]) => {
    if (selectedItems) {
      setSelectedLabels([...new Set(selectedItems)]);
    }
  };

  const labels = labelsData?.labels?.edges ?? [];

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
      <Box position="relative">
        {isFetchingDevices && data != null && (
          <Box position="absolute" top={0} right={0} left={0}>
            <Progress size="xs" isIndeterminate />
          </Box>
        )}

        <Box mb={4}>
          <SearchByLabelInput
            labels={labels}
            selectedLabels={selectedLabels}
            onSelectionChange={handleOnSelectionChange}
            disableCreateItem
          />
        </Box>
        <DeviceTable
          devices={data?.devices.edges ?? []}
          onInstallButtonClick={handleInstallButtonClick}
          onUninstallButtonClick={handleUninstallButtonClick}
          onSettingsButtonClick={onSettingsButtonClick}
          onDeleteBtnClick={handleDeleteBtnClick}
          installLoadingMap={installLoadingMap}
        />
      </Box>
    </Container>
  );
};

export default DeviceList;
