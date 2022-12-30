import { Box, Button, Container, Flex, Heading, HStack, Progress, useDisclosure } from '@chakra-ui/react';
import { Workflow } from '@frinx/shared';
import { callbackUtils, ExecuteWorkflowModal, unwrap, useNotifications } from '@frinx/shared/src';
import { Item } from 'chakra-ui-autocomplete';
import React, { useMemo, useState, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import ConfirmDeleteModal from '../../components/confirm-delete-modal';
import ImportCSVModal from '../../components/import-csv-modal';
import Pagination from '../../components/pagination';
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
import BulkActions from './bulk-actions';
import DeleteSelectedDevicesModal from './delete-selected-modal';
import DeviceFilter from './device-filters';
import DeviceSearch from './device-search';
import DeviceTable from './device-table';
import WorkflowListModal from './workflow-list-modal';

const DEVICES_QUERY = gql`
  query Devices(
    $labels: [String!]
    $deviceName: String
    $orderBy: DeviceOrderByInput
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    devices(
      filter: { labels: $labels, deviceName: $deviceName }
      orderBy: $orderBy
      first: $first
      after: $after
      last: $last
      before: $before
    ) {
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

type SortedBy = 'name' | 'created';
type Direction = 'ASC' | 'DESC';
type Sorting = {
  sortedBy: SortedBy;
  direction: Direction;
};

function getSorting(sorting: Sorting | null, sortedBy: SortedBy): Sorting | null {
  if (!sorting) {
    return {
      sortedBy,
      direction: 'ASC',
    };
  }

  if (sortedBy === sorting.sortedBy) {
    if (sorting.direction === 'DESC') {
      return null;
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

const DeviceList: VoidFunctionComponent = () => {
  const context = useMemo(() => ({ additionalTypenames: ['Device'] }), []);
  const deleteModalDisclosure = useDisclosure();
  const { addToastNotification } = useNotifications();
  const deleteSelectedDevicesModal = useDisclosure();
  const [deviceIdToDelete, setDeviceIdToDelete] = useState<string | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<Item[]>([]);
  const [installLoadingMap, setInstallLoadingMap] = useState<Record<string, boolean>>({});
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());
  const [sorting, setSorting] = useState<Sorting | null>(null);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [deviceNameFilter, setDeviceNameFilter] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [paginationArgs, { nextPage, previousPage, firstPage }] = usePagination();
  const [{ data: deviceData, fetching: isFetchingDevices, error }] = useQuery<DevicesQuery, DevicesQueryVariables>({
    query: DEVICES_QUERY,
    variables: {
      labels: selectedLabels.map((label) => label.label),
      deviceName: deviceNameFilter,
      orderBy: sorting
        ? {
            sortKey: sorting.sortedBy === 'name' ? 'NAME' : 'CREATED_AT',
            direction: sorting.direction,
          }
        : undefined,
      ...paginationArgs,
    },
    context,
  });
  const [{ data: labelsData, fetching: isFetchingLabels }] = useQuery<FilterLabelsQuery>({ query: LABELS_QUERY });
  const [, installDevice] = useMutation<InstallDeviceMutation, InstallDeviceMutationVariables>(INSTALL_DEVICE_MUTATION);
  const [, uninstallDevice] = useMutation<UninstallDeviceMutation, UninstallDeviceMutationVariables>(
    UNINSTALL_DEVICE_MUTATION,
  );
  const [, deleteDevice] = useMutation<DeleteDeviceMutation, DeleteDeviceMutationVariables>(DELETE_DEVICE_MUTATION);
  const [isSendingToWorkflows, setIsSendingToWorkflows] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

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
    firstPage();
    setSorting(newSorting);
  };

  const handleSearchSubmit = () => {
    firstPage();
    setDeviceNameFilter(searchText);
  };

  const handleWorkflowSelect = (wf: Workflow) => {
    setIsSendingToWorkflows(false);
    setSelectedWorkflow(wf);
  };

  const handleOnExecuteWorkflow = (values: Record<string, string>) => {
    if (selectedWorkflow == null) {
      addToastNotification({
        content: 'We cannot execute undefined workflow',
        type: 'error',
      });

      return null;
    }

    const { executeWorkflow } = callbackUtils.getCallbacks;

    return executeWorkflow({
      input: values,
      name: selectedWorkflow.name,
      version: selectedWorkflow.version,
    })
      .then((res) => {
        addToastNotification({ content: 'We successfully executed workflow', type: 'success' });
        return res.text;
      })
      .catch(() => {
        addToastNotification({ content: 'We have a problem to execute selected workflow', type: 'error' });
        return null;
      });
  };

  const labels = labelsData?.labels?.edges ?? [];
  const areSelectedAll =
    deviceData?.devices.edges.filter(({ node }) => !node.isInstalled).length === selectedDevices.size;

  return (
    <>
      {isImportModalOpen && (
        <ImportCSVModal
          onClose={() => {
            setIsImportModalOpen(false);
          }}
        />
      )}
      <DeleteSelectedDevicesModal
        onConfirm={handleSelectedDeviceDelete}
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
      {isSendingToWorkflows && (
        <WorkflowListModal
          onClose={() => {
            setIsSendingToWorkflows(false);
          }}
          onWorkflowSelect={handleWorkflowSelect}
        />
      )}
      {selectedWorkflow != null && (
        <ExecuteWorkflowModal
          isOpen
          onClose={() => {
            setSelectedWorkflow(null);
          }}
          workflow={selectedWorkflow}
          onSubmit={handleOnExecuteWorkflow}
        />
      )}
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h1" size="xl">
            Devices
          </Heading>
          <HStack spacing={2} marginLeft="auto">
            <Button data-cy="add-device" as={Link} colorScheme="blue" to="../new">
              Add device
            </Button>
            <Button
              data-cy="import-csv"
              onClick={() => {
                setIsImportModalOpen(true);
              }}
            >
              Import from CSV
            </Button>
          </HStack>
        </Flex>
        <Box position="relative">
          {isFetchingDevices && deviceData != null && (
            <Box position="absolute" top={0} right={0} left={0}>
              <Progress size="xs" isIndeterminate />
            </Box>
          )}

          <Box>
            <Flex>
              <Flex gridGap="4" marginRight="auto">
                <DeviceFilter
                  labels={labels}
                  selectedLabels={selectedLabels}
                  onSelectionChange={handleOnSelectionChange}
                  isCreationDisabled
                />
                <DeviceSearch text={searchText || ''} onChange={setSearchText} onSubmit={handleSearchSubmit} />
              </Flex>
              <BulkActions
                onDeleteButtonClick={deleteSelectedDevicesModal.onOpen}
                onInstallButtonClick={handleInstallSelectedDevices}
                areButtonsDisabled={selectedDevices.size === 0}
                onWorkflowButtonClick={() => {
                  setIsSendingToWorkflows(true);
                }}
              />
            </Flex>
          </Box>
          <DeviceTable
            data-cy="device-table"
            sorting={sorting}
            devices={deviceData?.devices.edges ?? []}
            areSelectedAll={areSelectedAll}
            onSelectAll={handleSelectionOfAllDevices}
            selectedDevices={selectedDevices}
            onSortingClick={handleSortingChange}
            onInstallButtonClick={(deviceId) => installDevices([deviceId])}
            onUninstallButtonClick={handleUninstallButtonClick}
            onDeleteBtnClick={handleDeleteBtnClick}
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
