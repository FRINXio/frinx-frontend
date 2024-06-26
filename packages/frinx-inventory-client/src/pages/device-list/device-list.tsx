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
  useDisclosure,
} from '@chakra-ui/react';
import {
  ExecuteWorkflowModal,
  unwrap,
  useNotifications,
  usePagination,
  Pagination,
  ConfirmDeleteModal,
  KafkaHealthCheckToolbar,
  usePerformanceMonitoring,
} from '@frinx/shared';
import { Item } from 'chakra-ui-autocomplete';
import React, { FormEvent, useEffect, useMemo, useState, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { gql, useMutation, useQuery, useSubscription } from 'urql';
import ImportCSVModal from '../../components/import-csv-modal';
import { ModalWorkflow } from '../../helpers/convert';
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
  KafkaHealthCheckQuery,
  KafkaHealthCheckQueryVariables,
  UninstallDeviceMutation,
  UninstallDeviceMutationVariables,
  KafkaReconnectMutation,
  KafkaReconnectMutationVariables,
  DevicesUsageSubscription,
  DevicesUsageSubscriptionVariables,
  DevicesConnectionSubscriptionVariables,
  DevicesConnectionSubscription,
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
    deviceInventory {
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
            version
            model
            software
            zone {
              id
              name
            }
            mountParameters
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
  }
`;
const INSTALL_DEVICE_MUTATION = gql`
  mutation InstallDevice($id: String!) {
    deviceInventory {
      installDevice(id: $id) {
        device {
          id
          createdAt
          isInstalled
          serviceState
        }
      }
    }
  }
`;
const UNINSTALL_DEVICE_MUTATION = gql`
  mutation UninstallDevice($id: String!) {
    deviceInventory {
      uninstallDevice(id: $id) {
        device {
          id
          createdAt
          isInstalled
          serviceState
        }
      }
    }
  }
`;
const LABELS_QUERY = gql`
  query FilterLabels {
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
const DELETE_DEVICE_MUTATION = gql`
  mutation DeleteDevice($deviceId: String!) {
    deviceInventory {
      deleteDevice(id: $deviceId) {
        device {
          id
        }
      }
    }
  }
`;

const BULK_INSTALL_DEVICES_MUTATION = gql`
  mutation BulkInstallDevices($input: BulkInstallDevicesInput!) {
    deviceInventory {
      bulkInstallDevices(input: $input) {
        installedDevices {
          id
        }
      }
    }
  }
`;

const EXECUTE_MODAL_WORKFLOW_MUTATION = gql`
  mutation ExecuteModalWorkflowByName($input: ExecuteWorkflowByNameInput!) {
    conductor {
      executeWorkflowByName(input: $input)
    }
  }
`;

const KAFKA_HEALTHCHECK_QUERY = gql`
  query KafkaHealthCheck {
    deviceInventory {
      kafkaHealthCheck {
        isOk
      }
    }
  }
`;

const KAFKA_RECONNECT_MUTATION = gql`
  mutation KafkaReconnect {
    deviceInventory {
      reconnectKafka {
        isOk
      }
    }
  }
`;

const DEVICES_USAGE_SUBSCRIPTION = gql`
  subscription DevicesUsage($deviceNames: [String!]!, $refreshEverySec: Int) {
    deviceInventory {
      devicesUsage(deviceNames: $deviceNames, refreshEverySec: $refreshEverySec) {
        devicesUsage {
          cpuLoad
          deviceName
          memoryLoad
        }
      }
    }
  }
`;

const DEVICES_STATUS_SUBSCRIPTION = gql`
  subscription DevicesConnection($targetDevices: [String!]!, $connectionTimeout: Int) {
    deviceInventory {
      devicesConnection(targetDevices: $targetDevices, connectionTimeout: $connectionTimeout) {
        deviceStatuses {
          deviceName
          status
        }
      }
    }
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
  const { isEnabled: isPerformanceMonitoringEnabled } = usePerformanceMonitoring();
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
  const [{ data: deviceData, error }] = useQuery<DevicesQuery, DevicesQueryVariables>({
    query: DEVICES_QUERY,
    variables: {
      labels: selectedLabels.map((label) => label.label),
      deviceName: deviceNameFilter,
      orderBy,
      ...paginationArgs,
    },
    context,
  });
  const [{ data: labelsData }] = useQuery<FilterLabelsQuery>({ query: LABELS_QUERY, context });
  const [{ data: isKafkaOk, error: kafkaHealthCheckError, fetching: isLoadingKafkaStatus }] = useQuery<
    KafkaHealthCheckQuery,
    KafkaHealthCheckQueryVariables
  >({ query: KAFKA_HEALTHCHECK_QUERY, pause: !isPerformanceMonitoringEnabled });
  const [, reconnectKafka] = useMutation<KafkaReconnectMutation, KafkaReconnectMutationVariables>(
    KAFKA_RECONNECT_MUTATION,
  );
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
  const [{ data: devicesUsage }] = useSubscription<DevicesUsageSubscriptionVariables, DevicesUsageSubscription>({
    query: DEVICES_USAGE_SUBSCRIPTION,
    variables: {
      deviceNames: deviceData?.deviceInventory.devices.edges.map(({ node }) => node.name) ?? [],
      refreshEverySec: 5,
    },
    pause: !isPerformanceMonitoringEnabled,
  });

  const deviceInstallStatuses = deviceData?.deviceInventory.devices.edges.map((device) => ({
    name: device.node.name,
    isInstalled: device.node.isInstalled,
  }));

  const [{ data: devicesConnection }] = useSubscription<
    DevicesConnectionSubscriptionVariables,
    DevicesConnectionSubscription
  >({
    query: DEVICES_STATUS_SUBSCRIPTION,
    variables: {
      connectionTimeout: 10,
      targetDevices: deviceInstallStatuses?.filter((device) => device.isInstalled).map((device) => device.name) ?? [],
    },
    pause: !isPerformanceMonitoringEnabled,
  });

  const [isSendingToWorkflows, setIsSendingToWorkflows] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ModalWorkflow | null>(null);

  const kafkaHealthCheckToolbar = useDisclosure({ defaultIsOpen: true });

  useEffect(() => {
    let kafkaToolbarTimeout: NodeJS.Timeout;

    if (kafkaHealthCheckToolbar.isOpen && isKafkaOk?.deviceInventory.kafkaHealthCheck?.isOk) {
      kafkaToolbarTimeout = setTimeout(() => {
        kafkaHealthCheckToolbar.onClose();
      }, 5000);
    }

    return () => {
      clearTimeout(kafkaToolbarTimeout);
    };
  }, [kafkaHealthCheckToolbar, isKafkaOk]);

  const handleSort = (sortKey: SortedBy) => {
    setOrderBy({ sortKey, direction: orderBy?.direction === 'ASC' ? 'DESC' : 'ASC' });
  };

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
        if (res.data?.deviceInventory.uninstallDevice.device.isInstalled === false) {
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
      [...devicesId].map(async (deviceId: string) => {
        const res = await deleteDevice({
          deviceId,
        });
        if (res.data?.deviceInventory.deleteDevice) {
          return res.data.deviceInventory.deleteDevice.device?.id;
        }
        if (res.error) {
          throw new Error(res.error?.message);
        }
        return null;
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
        if (res.data?.deviceInventory.installDevice.device.isInstalled === true) {
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

        if (res.data?.deviceInventory.bulkInstallDevices.installedDevices.length === 0) {
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
        const devicesId = deviceData.deviceInventory.devices.edges
          .filter(({ node }) => !node.isInstalled)
          .map(({ node }) => node.id);
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

  const handleWorkflowSelect = (wf: ModalWorkflow) => {
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
        return res.data?.conductor.executeWorkflowByName;
      })
      .catch(() => {
        addToastNotification({ content: 'We have a problem to execute selected workflow', type: 'error' });
        return null;
      });
  };

  const labels = labelsData?.deviceInventory.labels?.edges ?? [];
  const areSelectedAll =
    deviceData?.deviceInventory.devices.edges.filter(({ node }) => !node.isInstalled).length === selectedDevices.size;

  if (isPerformanceMonitoringEnabled && isLoadingKafkaStatus) {
    return (
      <Container maxWidth="container.xl">
        <Alert status="info">
          <AlertIcon />
          <AlertTitle>Checking Kafka status...</AlertTitle>
        </Alert>
      </Container>
    );
  }

  if (deviceData == null && error) {
    return (
      <Container maxWidth="container.xl">
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Something went wrong...</AlertTitle>
          <br />
          <AlertDescription>{error.toString()}</AlertDescription>
        </Alert>
      </Container>
    );
  }
  if (deviceData == null) {
    return null;
  }

  const isBeingInstalled = Object.values(installLoadingMap).some((isInstalling) => isInstalling);

  return (
    <>
      {isPerformanceMonitoringEnabled && kafkaHealthCheckToolbar.isOpen && (
        <KafkaHealthCheckToolbar
          mt={-10}
          onClose={kafkaHealthCheckToolbar.onClose}
          isKafkaHealthy={isKafkaOk?.deviceInventory.kafkaHealthCheck?.isOk ?? false}
          isKafkaHealthyError={kafkaHealthCheckError?.message}
          onReconnect={() =>
            reconnectKafka({})
              .then(() => {
                addToastNotification({
                  type: 'success',
                  title: 'Success',
                  content: 'Kafka reconnected successfuly',
                });
                kafkaHealthCheckToolbar.onClose();
              })
              .catch(() => {
                addToastNotification({
                  type: 'error',
                  title: 'Error',
                  content: 'Kafka reconnection failed',
                });
                kafkaHealthCheckToolbar.onOpen();
              })
          }
        />
      )}
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
        <Flex justify="space-between">
          <Form display="flex" alignItems="flex-start" width="half" onSubmit={handleSearchSubmit}>
            <Box flex={1}>
              <DeviceFilter
                labels={labels}
                selectedLabels={selectedLabels || []}
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
              areButtonsDisabled={selectedDevices.size === 0 || isBeingInstalled}
              onWorkflowButtonClick={() => {
                setIsSendingToWorkflows(true);
              }}
            />
          </Flex>
        </Flex>
        <DeviceTable
          deviceInstallStatuses={deviceInstallStatuses}
          devicesConnection={devicesConnection?.deviceInventory.devicesConnection?.deviceStatuses}
          data-cy="device-table"
          devices={deviceData?.deviceInventory.devices.edges}
          devicesUsage={devicesUsage}
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
          isPerformanceMonitoringEnabled={isPerformanceMonitoringEnabled}
        />
        <Pagination
          onPrevious={previousPage(deviceData.deviceInventory.devices.pageInfo.startCursor)}
          onNext={nextPage(deviceData.deviceInventory.devices.pageInfo.endCursor)}
          hasNextPage={deviceData.deviceInventory.devices.pageInfo.hasNextPage}
          hasPreviousPage={deviceData.deviceInventory.devices.pageInfo.hasPreviousPage}
        />
      </Container>
    </>
  );
};

export default DeviceList;
