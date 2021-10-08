import { Box, Button, Container, Flex, Heading, Progress, useDisclosure, useToast } from '@chakra-ui/react';
import { Item } from 'chakra-ui-autocomplete';
import React, { useMemo, useState, VoidFunctionComponent } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import ConfirmDeleteModal from '../../components/confirm-delete-modal';
import Pagination from '../../components/pagination';
import unwrap from '../../helpers/unwrap';
import { usePagination } from '../../hooks/use-pagination';
import useResponseToasts from '../../hooks/user-response-toasts';
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
  const toast = useToast();
  const deleteModalDisclosure = useDisclosure();
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
  const [{ data: installDeviceData, error: installDeviceError }, installDevice] = useMutation<
    InstallDeviceMutation,
    InstallDeviceMutationVariables
  >(INSTALL_DEVICE_MUTATION);
  const [{ data: uninstallDeviceData, error: uninstallDeviceError }, uninstallDevice] = useMutation<
    UninstallDeviceMutation,
    UninstallDeviceMutationVariables
  >(UNINSTALL_DEVICE_MUTATION);
  const [{ data: deleteDeviceData, error: deleteDeviceError }, deleteDevice] = useMutation<
    DeleteDeviceMutation,
    DeleteDeviceMutationVariables
  >(DELETE_DEVICE_MUTATION);
  const isInstallSuccesfull = installDeviceData != null;
  const isInstallFailed = installDeviceError != null;
  const isUninstallSuccesfull = uninstallDeviceData != null;
  const isUninstallFailed = uninstallDeviceError != null;
  const isDeleteSuccessful = deleteDeviceData != null;
  const isDeleteFailed = deleteDeviceError != null;

  useResponseToasts({
    isSuccess: isInstallSuccesfull,
    isFailure: isInstallFailed,
    successMessage: 'Device succesfully installed',
    failureMessage: 'Device could not be installed',
  });
  useResponseToasts({
    isSuccess: isUninstallSuccesfull,
    isFailure: isUninstallFailed,
    successMessage: 'Device succesfully uninstalled',
    failureMessage: 'Device could not be uninstalled',
  });
  useResponseToasts({
    isSuccess: isDeleteSuccessful,
    isFailure: isDeleteFailed,
    successMessage: 'Device succesfully deleted',
    failureMessage: 'Device could not be deleted',
  });

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
          }).then(() => {
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

          <Box>
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
