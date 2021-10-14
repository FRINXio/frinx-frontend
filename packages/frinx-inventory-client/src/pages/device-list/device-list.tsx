import { Box, Button, Container, Flex, Heading, Progress, useDisclosure } from '@chakra-ui/react';
import { Item } from 'chakra-ui-autocomplete';
import React, { useMemo, useState, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import ConfirmDeleteModal from '../../components/confirm-delete-modal';
import Pagination from '../../components/pagination';
import unwrap from '../../helpers/unwrap';
import useNotifications from '../../hooks/use-notifications';
import { usePagination } from '../../hooks/use-pagination';
import {
  DeleteDeviceMutation,
  DeleteDeviceMutationVariables,
  DevicesQuery,
  DevicesQueryVariables,
  FilterLabelsQuery,
  InstallDeviceMutation,
  InstallDeviceMutationVariables,
  UninstallDeviceMutation,
  UninstallDeviceMutationVariables,
} from '../../__generated__/graphql';
import DeviceFilter from './device-filters';
import DeviceTable from './device-table';

const DEVICES_QUERY = gql`
  query Devices($labelIds: [String!], $first: Int, $after: String, $last: Int, $before: String) {
    devices(filter: { labelIds: $labelIds }, first: $first, after: $after, last: $last, before: $before) {
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
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
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
  onEditButtonClick: (deviceId: string) => void;
};

const DeviceList: VoidFunctionComponent<Props> = ({ onAddButtonClick, onSettingsButtonClick, onEditButtonClick }) => {
  const context = useMemo(() => ({ additionalTypenames: ['Device'] }), []);
  const deleteModalDisclosure = useDisclosure();
  const { addToastNotification } = useNotifications();
  const [deviceIdToDelete, setDeviceIdToDelete] = useState<string | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<Item[]>([]);
  const [installLoadingMap, setInstallLoadingMap] = useState<Record<string, boolean>>({});
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());
  const [paginationArgs, { nextPage, previousPage }] = usePagination();
  const [{ data: deviceData, fetching: isFetchingDevices, error }] = useQuery<DevicesQuery, DevicesQueryVariables>({
    query: DEVICES_QUERY,
    variables: { labelIds: selectedLabels.map((label) => label.value), ...paginationArgs },
    context,
  });
  const [{ data: labelsData, fetching: isFetchingLabels }] = useQuery<FilterLabelsQuery>({ query: LABELS_QUERY });
  const [, installDevice] = useMutation<InstallDeviceMutation, InstallDeviceMutationVariables>(INSTALL_DEVICE_MUTATION);
  const [, uninstallDevice] = useMutation<UninstallDeviceMutation, UninstallDeviceMutationVariables>(
    UNINSTALL_DEVICE_MUTATION,
  );
  const [, deleteDevice] = useMutation<DeleteDeviceMutation, DeleteDeviceMutationVariables>(DELETE_DEVICE_MUTATION);

  if ((isFetchingDevices && deviceData == null) || isFetchingLabels) {
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
    }).then((res) => {
      if (res.data?.installDevice.device.isInstalled) {
        addToastNotification({
          type: 'success',
          title: 'Success',
          content: 'Device installed successfuly',
        });
      }
      if (res.error) {
        addToastNotification({
          type: 'error',
          title: 'Error',
          content: 'Installation failed',
        });
      }
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
      .then((res) => {
        if (res.data?.uninstallDevice.device.isInstalled === false) {
          addToastNotification({
            type: 'success',
            title: 'Success',
            content: 'Device uninstalled successfuly',
          });
        }
        if (res.error) {
          addToastNotification({
            type: 'error',
            title: 'Error',
            content: 'Uninstallation failed',
          });
        }
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
    setDeviceIdToDelete(deviceId);
    deleteModalDisclosure.onOpen();
  };

  const handleOnSelectionChange = (selectedItems?: Item[]) => {
    if (selectedItems) {
      setSelectedLabels([...new Set(selectedItems)]);
    }
  };

  const handleDeviceSelection = (deviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedDevices((prev) => {
        const newSelectedDevices = new Set(prev.add(deviceId));
        return newSelectedDevices;
      });
    } else {
      setSelectedDevices((prev) => {
        const newSelectedDevices = new Set(prev);
        newSelectedDevices.delete(deviceId);

        return newSelectedDevices;
      });
    }
  };

  const handleSelectionOfAllDevices = (checked: boolean) => {
    if (checked) {
      if (deviceData != null) {
        const devicesId = deviceData.devices.edges.map(({ node }) => node.id);
        setSelectedDevices(new Set(devicesId));
      }
    } else {
      setSelectedDevices(new Set());
    }
  };

  const labels = labelsData?.labels?.edges ?? [];
  const areSelectedAll = deviceData?.devices.edges.length === selectedDevices.size;

  return (
    <>
      <ConfirmDeleteModal
        isOpen={deleteModalDisclosure.isOpen}
        onClose={deleteModalDisclosure.onClose}
        onConfirmBtnClick={() => {
          deleteDevice({
            deviceId: unwrap(deviceIdToDelete),
          }).then((res) => {
            if (res.data?.deleteDevice) {
              addToastNotification({
                type: 'success',
                title: 'Success',
                content: 'Device was deleted successfuly',
              });
            }
            if (res.error) {
              addToastNotification({
                type: 'error',
                title: 'Error',
                content: 'Failed to delete device',
              });
            }
            deleteModalDisclosure.onClose();
          });
        }}
        title="Delete device"
      >
        Are you sure? You can&apos;t undo this action afterwards.
      </ConfirmDeleteModal>
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
          {isFetchingDevices && deviceData != null && (
            <Box position="absolute" top={0} right={0} left={0}>
              <Progress size="xs" isIndeterminate />
            </Box>
          )}

          <Box background="white" paddingX={4} paddingTop={4} paddingBottom={0} marginBottom={4}>
            <DeviceFilter
              labels={labels}
              selectedLabels={selectedLabels}
              onSelectionChange={handleOnSelectionChange}
              isCreationDisabled
            />
          </Box>
          <DeviceTable
            devices={deviceData?.devices.edges ?? []}
            areSelectedAll={areSelectedAll}
            onSelectAll={handleSelectionOfAllDevices}
            selectedDevices={selectedDevices}
            onInstallButtonClick={handleInstallButtonClick}
            onUninstallButtonClick={handleUninstallButtonClick}
            onSettingsButtonClick={onSettingsButtonClick}
            onDeleteBtnClick={handleDeleteBtnClick}
            onEditDeviceButtonClick={onEditButtonClick}
            installLoadingMap={installLoadingMap}
            onDeviceSelection={handleDeviceSelection}
          />

          {deviceData && (
            <Box marginTop={4} paddingX={4}>
              <Pagination
                onPrevious={previousPage(deviceData.devices.pageInfo.startCursor)}
                onNext={nextPage(deviceData.devices.pageInfo.endCursor)}
                hasNextPage={deviceData.devices.pageInfo.hasNextPage}
                hasPreviousPage={deviceData.devices.pageInfo.hasPreviousPage}
              />
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default DeviceList;
