import { Box, Button, Container, Flex, Heading, HStack, Progress, Spacer, useDisclosure } from '@chakra-ui/react';
import { Item } from 'chakra-ui-autocomplete';
import React, { FC, useMemo, useState, VoidFunctionComponent } from 'react';
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
import DeviceSearch from './device-search';

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

type SortedBy = 'name' | 'created' | null;
type Direction = 'ASC' | 'DESC';
type Sorting = {
  sortedBy: SortedBy;
  direction: Direction;
};

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

const DeleteSelectedDevicesModal: FC<DeleteModalProps> = ({ onSubmit, isOpen, onClose }) => {
  return (
    <ConfirmDeleteModal isOpen={isOpen} onClose={onClose} onConfirmBtnClick={onSubmit} title="Delete selected devices">
      Are you sure? You can&apos;t undo this action afterwards.
    </ConfirmDeleteModal>
  );
};

function getSorting(sorting: Sorting, sortedBy: SortedBy): Sorting {
  if (sortedBy === sorting.sortedBy) {
    if (sorting.direction === 'DESC') {
      return {
        sortedBy: null,
        direction: 'ASC',
      };
    }
    return {
      ...sorting,
      direction: 'DESC',
    };
  }

  return {
    sortedBy,
    direction: 'ASC',
  };
}

const DeviceList: VoidFunctionComponent<Props> = ({ onAddButtonClick, onSettingsButtonClick, onEditButtonClick }) => {
  const context = useMemo(() => ({ additionalTypenames: ['Device'] }), []);
  const deleteModalDisclosure = useDisclosure();
  const { addToastNotification } = useNotifications();
  const deleteSelectedDevicesModal = useDisclosure();
  const [deviceIdToDelete, setDeviceIdToDelete] = useState<string | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<Item[]>([]);
  const [installLoadingMap, setInstallLoadingMap] = useState<Record<string, boolean>>({});
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());
  const [sorting, setSorting] = useState<Sorting>({
    sortedBy: null,
    direction: 'ASC',
  });
  const [searchText, setSearchText] = useState<string | null>(null);
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

  const deleteDevices = (devicesId: string[]) => {
    return Promise.allSettled(
      [...devicesId].map((deviceId: string) => {
        return deleteDevice({
          deviceId,
        }).then((res) => {
          if (res.data?.deleteDevice) {
            return res.data.deleteDevice.device?.id;
          }
          if (res.error) {
            throw new Error(res.error?.message);
          }

          return null;
        });
      }),
    )
      .then((res) => {
        if (res.every((item) => item.status === 'fulfilled')) {
          return addToastNotification({
            type: 'success',
            title: 'Success',
            content: res.length > 1 ? 'Devices were deleted successfully' : 'Device was deleted successfully',
          });
        }

        if (res.every((item) => item.status === 'rejected')) {
          return addToastNotification({
            type: 'error',
            title: 'Error',
            content: res.length > 1 ? 'Failed to delete devices' : 'Failed to delete device',
          });
        }

        return addToastNotification({
          type: 'warning',
          title: 'Warning',
          content: 'Not all selected devices were deleted',
        });
      })
      .finally(() => {
        setSelectedDevices(new Set());
        deleteModalDisclosure.onClose();
      });
  };

  const installDevices = (devicesId: string[]) => {
    Promise.allSettled(
      devicesId.map((deviceId) => {
        setInstallLoadingMap((m) => {
          return {
            ...m,
            [deviceId]: true,
          };
        });
        return installDevice({
          id: deviceId,
        })
          .then((res) => {
            if (res.data?.installDevice.device.isInstalled) {
              return res.data.installDevice.device.isInstalled;
            }
            if (res.error) {
              throw new Error(res.error.message);
            }

            return null;
          })
          .finally(() => {
            setInstallLoadingMap((m) => {
              return {
                ...m,
                [deviceId]: false,
              };
            });
          });
      }),
    )
      .then((res) => {
        if (res.every((item) => item.status === 'fulfilled')) {
          return addToastNotification({
            type: 'success',
            title: 'Success',
            content: res.length > 1 ? 'Devices were installed successfuly' : 'Device was installed successfully',
          });
        }

        if (res.every((item) => item.status === 'rejected')) {
          return addToastNotification({
            type: 'error',
            title: 'Error',
            content: res.length > 1 ? 'Failed to install devices' : 'Failed to install device',
          });
        }

        return addToastNotification({
          type: 'warning',
          title: 'Warning',
          content: 'Not all selected devices were installed successfully',
        });
      })
      .finally(() => setSelectedDevices(new Set()));
  };

  const handleInstallSelectedDevices = () => {
    installDevices([...selectedDevices]);
  };

  const handleDeviceDelete = () => {
    deleteDevices([unwrap(deviceIdToDelete)]).finally(() => deleteModalDisclosure.onClose());
  };

  const handleSelectedDeviceDelete = () => {
    deleteDevices([...selectedDevices]).finally(() => deleteSelectedDevicesModal.onClose());
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
        const devicesId = deviceData.devices.edges.filter(({ node }) => !node.isInstalled).map(({ node }) => node.id);
        setSelectedDevices(new Set(devicesId));
      }
    } else {
      setSelectedDevices(new Set());
    }
  };

  const handleSortingChange = (sortedBy: SortedBy) => {
    const newSorting = getSorting(sorting, sortedBy);
    setSorting(newSorting);
    // eslint-disable-next-line no-console
    console.log('submit sorting', sorting);
  };

  const handleSearchSubmit = (text: string | null) => {
    // eslint-disable-next-line no-console
    console.log('submit search text', text);
  };

  const labels = labelsData?.labels?.edges ?? [];
  const areSelectedAll =
    deviceData?.devices.edges.filter(({ node }) => !node.isInstalled).length === selectedDevices.size;

  return (
    <>
      <DeleteSelectedDevicesModal
        onSubmit={handleSelectedDeviceDelete}
        isOpen={deleteSelectedDevicesModal.isOpen}
        onClose={deleteSelectedDevicesModal.onClose}
      />
      <ConfirmDeleteModal
        isOpen={deleteModalDisclosure.isOpen}
        onClose={deleteModalDisclosure.onClose}
        onConfirmBtnClick={handleDeviceDelete}
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

          <Box>
            <Flex>
              <Flex gridGap="4">
                <DeviceFilter
                  labels={labels}
                  selectedLabels={selectedLabels}
                  onSelectionChange={handleOnSelectionChange}
                  isCreationDisabled
                />
                <DeviceSearch text={searchText || ''} onChange={setSearchText} onSubmit={handleSearchSubmit} />
              </Flex>
              <Spacer />
              <HStack>
                <Button
                  isDisabled={selectedDevices.size === 0}
                  onClick={handleInstallSelectedDevices}
                  variant="outline"
                  colorScheme="blue"
                  size="sm"
                >
                  Install selected
                </Button>
                <Button
                  isDisabled={selectedDevices.size === 0}
                  onClick={deleteSelectedDevicesModal.onOpen}
                  variant="outline"
                  colorScheme="red"
                  size="sm"
                >
                  Delete selected
                </Button>
              </HStack>
            </Flex>
          </Box>
          <DeviceTable
            sorting={sorting}
            devices={deviceData?.devices.edges ?? []}
            areSelectedAll={areSelectedAll}
            onSelectAll={handleSelectionOfAllDevices}
            selectedDevices={selectedDevices}
            onSortingClick={handleSortingChange}
            onInstallButtonClick={(deviceId) => installDevices([deviceId])}
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
