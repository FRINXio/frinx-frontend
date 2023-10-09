import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  chakra,
  Container,
  Flex,
  Heading,
  HStack,
  Progress,
  useDisclosure,
} from '@chakra-ui/react';
import {
  ExecuteWorkflowModal,
  unwrap,
  useNotifications,
  Workflow,
  usePagination,
  Pagination,
  ConfirmDeleteModal,
} from '@frinx/shared';
import { Item } from 'chakra-ui-autocomplete';
import React, { FormEvent, useMemo, useState, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import ImportCSVModal from '../../components/import-csv-modal';
import {
  BulkInstallDevicesMutation,
  BulkInstallDevicesMutationVariables,
  DeleteDeviceMutation,
  DeleteDeviceMutationVariables,
  DevicesQuery,
  DevicesQueryVariables,
  ExecuteModalWorkflowByNameMutation,
  ExecuteModalWorkflowByNameMutationVariables,
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

const BULK_INSTALL_DEVICES_MUTATION = gql`
  mutation BulkInstallDevices($input: BulkInstallDevicesInput!) {
    bulkInstallDevices(input: $input) {
      installedDevices {
        id
      }
    }
  }
`;

const EXECUTE_MODAL_WORKFLOW_MUTATION = gql`
  mutation ExecuteModalWorkflowByName($input: ExecuteWorkflowByName!) {
    executeWorkflowByName(input: $input)
  }
`;

type SortedBy = 'name' | 'createdAt' | 'serviceState';
type Direction = 'ASC' | 'DESC';
type Sorting = {
  sortKey: SortedBy;
  direction: Direction;
};

const Form = chakra('form');

const DeviceList: VoidFunctionComponent = () => {
  const context = useMemo(() => ({ additionalTypenames: ['Device'] }), []);
  const deleteModalDisclosure = useDisclosure();
  const { addToastNotification } = useNotifications();
  const deleteSelectedDevicesModal = useDisclosure();
  const [orderBy, setOrderBy] = useState<Sorting | null>(null);
  const [deviceIdToDelete, setDeviceIdToDelete] = useState<string | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<Item[]>([]);
  const [installLoadingMap, setInstallLoadingMap] = useState<Record<string, boolean>>({});
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState<string | null>(null);
  const [deviceNameFilter, setDeviceNameFilter] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [paginationArgs, { nextPage, previousPage, firstPage }] = usePagination();
  const [{ data: deviceData, fetching: isFetchingDevices, error }] = useQuery<DevicesQuery, DevicesQueryVariables>({
    query: DEVICES_QUERY,
    variables: {
      labels: selectedLabels.map((label) => label.label),
      deviceName: deviceNameFilter,
      orderBy,
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
  const [, executeWorkflow] = useMutation<
    ExecuteModalWorkflowByNameMutation,
    ExecuteModalWorkflowByNameMutationVariables
  >(EXECUTE_MODAL_WORKFLOW_MUTATION);
  const [, bulkInstallation] = useMutation<BulkInstallDevicesMutation, BulkInstallDevicesMutationVariables>(
    BULK_INSTALL_DEVICES_MUTATION,
  );
  const [isSendingToWorkflows, setIsSendingToWorkflows] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  const handleSort = (sortKey: SortedBy) => {
    setOrderBy({ sortKey, direction: orderBy?.direction === 'ASC' ? 'DESC' : 'ASC' });
  };

  if ((isFetchingDevices && deviceData == null) || isFetchingLabels) {
    return (
      <Box position="relative">
        <Box position="absolute" top={0} right={0} left={0}>
          <Progress size="xs" isIndeterminate />
        </Box>
      </Box>
    );
  }

  const clearFilter = () => {
    setSearchText('');
    setDeviceNameFilter(null);
    setSelectedLabels([]);
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

  const handleOnDeviceInstall = (deviceId: string) => {
    setInstallLoadingMap((m) => {
      return {
        ...m,
        [deviceId]: true,
      };
    });
    installDevice({
      id: deviceId,
    })
      .then((res) => {
        if (res.data?.installDevice.device.isInstalled === true) {
          addToastNotification({
            type: 'success',
            title: 'Success',
            content: 'Device installed successfuly',
          });
        }
        if (res.error != null) {
          throw new Error(res.error?.message);
        }
      })
      .catch(() => {
        addToastNotification({
          type: 'error',
          title: 'Error',
          content: 'Installation failed',
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

  const handleInstallSelectedDevices = () => {
    setInstallLoadingMap((m) => {
      return {
        ...m,
        ...[...selectedDevices].reduce((acc, deviceId) => {
          return {
            ...acc,
            [deviceId]: true,
          };
        }, {}),
      };
    });
    bulkInstallation({
      input: {
        deviceIds: [...selectedDevices],
      },
    })
      .then((res) => {
        if (res.error != null || res.data == null) {
          throw new Error(res.error?.message ?? 'Problem with bulk installation of devices');
        }

        if (res.data?.bulkInstallDevices.installedDevices.length === 0) {
          throw new Error('No devices were installed');
        }

        addToastNotification({
          type: 'success',
          title: 'Success',
          content: 'Devices installed successfuly',
        });
      })
      .catch(() => {
        addToastNotification({
          type: 'error',
          title: 'Error',
          content: 'Bulk installation of devices has failed',
        });
      })
      .finally(() => {
        setInstallLoadingMap((m) => {
          return {
            ...m,
            ...[...selectedDevices].reduce((acc, deviceId) => {
              return {
                ...acc,
                [deviceId]: false,
              };
            }, {}),
          };
        });
        setSelectedDevices(new Set());
      });
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

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    firstPage();
    setDeviceNameFilter(searchText);
  };

  const handleWorkflowSelect = (wf: Workflow) => {
    setIsSendingToWorkflows(false);
    setSelectedWorkflow(wf);
  };

  const handleOnExecuteWorkflow = (values: Record<string, unknown>) => {
    if (selectedWorkflow == null) {
      addToastNotification({
        content: 'We cannot execute undefined workflow',
        type: 'error',
      });

      return null;
    }

    return executeWorkflow({
      input: {
        workflowName: selectedWorkflow.name,
        workflowVersion: selectedWorkflow.version,
        inputParameters: JSON.stringify(values),
      },
    })
      .then((res) => {
        addToastNotification({ content: 'We successfully executed workflow', type: 'success' });
        return res.data?.executeWorkflowByName;
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
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Something went wrong...</AlertTitle>
            <br />
            <AlertDescription>{error.toString()}</AlertDescription>
          </Alert>
        )}
        <Box position="relative">
          {isFetchingDevices && deviceData != null && (
            <Box position="absolute" top={0} right={0} left={0}>
              <Progress size="xs" isIndeterminate />
            </Box>
          )}

          {deviceData && (
            <>
              <Box>
                <Flex justify="space-between">
                  <Form display="flex" alignItems="flex-start" width="half" onSubmit={handleSearchSubmit}>
                    <Box flex={1}>
                      <DeviceFilter
                        labels={labels}
                        selectedLabels={selectedLabels}
                        onSelectionChange={handleOnSelectionChange}
                        isCreationDisabled
                      />
                    </Box>
                    <Box flex={1} marginLeft="2">
                      <DeviceSearch text={searchText || ''} onChange={setSearchText} />
                    </Box>
                    <Button mb={6} data-cy="search-button" colorScheme="blue" marginLeft="2" mt={10} type="submit">
                      Search
                    </Button>
                    <Button
                      mb={6}
                      data-cy="clear-button"
                      onClick={clearFilter}
                      colorScheme="red"
                      variant="outline"
                      marginLeft="2"
                      mt={10}
                    >
                      Clear
                    </Button>
                  </Form>
                  <Flex width="50%" justify="flex-end">
                    <BulkActions
                      onDeleteButtonClick={deleteSelectedDevicesModal.onOpen}
                      onInstallButtonClick={handleInstallSelectedDevices}
                      areButtonsDisabled={selectedDevices.size === 0}
                      onWorkflowButtonClick={() => {
                        setIsSendingToWorkflows(true);
                      }}
                    />
                  </Flex>
                </Flex>
              </Box>
              <DeviceTable
                data-cy="device-table"
                devices={deviceData?.devices.edges}
                areSelectedAll={areSelectedAll}
                onSelectAll={handleSelectionOfAllDevices}
                selectedDevices={selectedDevices}
                orderBy={orderBy}
                onSort={handleSort}
                onInstallButtonClick={handleOnDeviceInstall}
                onUninstallButtonClick={handleUninstallButtonClick}
                onDeleteBtnClick={handleDeleteBtnClick}
                installLoadingMap={installLoadingMap}
                onDeviceSelection={handleDeviceSelection}
              />
              <Pagination
                onPrevious={previousPage(deviceData.devices.pageInfo.startCursor)}
                onNext={nextPage(deviceData.devices.pageInfo.endCursor)}
                hasNextPage={deviceData.devices.pageInfo.hasNextPage}
                hasPreviousPage={deviceData.devices.pageInfo.hasPreviousPage}
              />
            </>
          )}
        </Box>
      </Container>
    </>
  );
};

export default DeviceList;
