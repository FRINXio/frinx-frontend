import React, { useMemo, useState, VoidFunctionComponent } from 'react';
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
} from '../../__generated__/graphql';
import SearchByLabelInput from '../../components/search-by-label-input';
import Pagination from '../../components/pagination';
import { usePagination } from '../../hooks/usePagination';

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

type Props = {
  onAddButtonClick: () => void;
  onSettingsButtonClick: (deviceId: string) => void;
};

const DeviceList: VoidFunctionComponent<Props> = ({ onAddButtonClick, onSettingsButtonClick }) => {
  const context = useMemo(() => ({ additionalTypenames: ['Device'] }), []);
  const toast = useToast();
  const [selectedLabels, setSelectedLabels] = useState<Item[]>([]);
  const [paginationArgs, { nextPage, previousPage }] = usePagination();
  const [{ data, fetching: isFetchingDevices, error }] = useQuery<DevicesQuery, DevicesQueryVariables>({
    query: DEVICES_QUERY,
    variables: { labelIds: selectedLabels.map((label) => label.value), ...paginationArgs },
    context,
  });
  const [{ data: labelsData, fetching: isFetchingLabels }] = useQuery<FilterLabelsQuery>({ query: LABELS_QUERY });
  const [{ fetching: isInstalLoading }, installDevice] = useMutation<
    InstallDeviceMutation,
    InstallDeviceMutationVariables
  >(INSTALL_DEVICE_MUTATION);
  const [{ fetching: isUninstallLoading }, uninstallDevice] = useMutation<
    UninstallDeviceMutation,
    UninstallDeviceMutationVariables
  >(UNINSTALL_DEVICE_MUTATION);

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
          devices={data?.devices.edges}
          onInstallButtonClick={handleInstallButtonClick}
          onUninstallButtonClick={handleUninstallButtonClick}
          onSettingsButtonClick={onSettingsButtonClick}
          isLoading={isInstalLoading || isUninstallLoading}
        />

        {data && (
          <Pagination
            onPrevious={previousPage(data.devices.pageInfo.startCursor)}
            onNext={nextPage(data.devices.pageInfo.endCursor)}
            hasNextPage={data.devices.pageInfo.hasNextPage}
            hasPreviousPage={data.devices.pageInfo.hasPreviousPage}
          />
        )}
      </Box>
    </Container>
  );
};

export default DeviceList;
