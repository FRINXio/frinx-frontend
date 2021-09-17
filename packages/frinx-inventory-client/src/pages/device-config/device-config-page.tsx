import { Container, Progress, useToast, useDisclosure, Box } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useQuery, gql, useMutation } from 'urql';
import DeviceConfigEditors from './device-config-editors';
import DeviceConfigActions from './device-config-actions';
import CreateSnapshotModal from './create-snapshot-modal';
import {
  CommitDataStoreConfigMutation,
  CommitDataStoreConfigMutationVariables,
  QueryDataStoreQuery,
  QueryDataStoreQueryVariables,
  UpdateDataStoreMutation,
  UpdateDataStoreMutationVariables,
  ResetConfigMutation,
  ResetConfigMutationVariables,
  AddSnapshotMutation,
  AddSnapshotMutationVariables,
  ApplySnapshotMutation,
  ApplySnapshotMutationVariables,
  SyncFromNetworkMutation,
  SyncFromNetworkMutationVariables,
} from '../../__generated__/graphql';
import DiffOutputModal from './diff-output-modal';

const DATA_STORE_QUERY = gql`
  query queryDataStore($deviceId: String!) {
    dataStore(deviceId: $deviceId) {
      config
      operational
      snapshots {
        name
        createdAt
      }
    }
  }
`;

const UPDATE_DATA_STORE_MUTATION = gql`
  mutation updateDataStore($deviceId: String!, $input: UpdateDataStoreInput!) {
    updateDataStore(deviceId: $deviceId, input: $input) {
      dataStore {
        config
        operational
      }
    }
  }
`;

const COMMIT_DATA_STORE_MUTATION = gql`
  mutation commitDataStoreConfig($input: CommitConfigInput!) {
    commitConfig(input: $input) {
      isOk
    }
  }
`;

const RESET_CONFIG_MUTATION = gql`
  mutation resetConfig($deviceId: String!) {
    resetConfig(deviceId: $deviceId) {
      dataStore {
        config
        operational
      }
    }
  }
`;

const ADD_SNAPSHOT_MUTATION = gql`
  mutation addSnapshot($input: AddSnapshotInput!) {
    addSnapshot(input: $input) {
      snapshot {
        name
      }
    }
  }
`;

const APPLY_SNAPSHOT_MUTATION = gql`
  mutation applySnapshot($input: ApplySnapshotInput!) {
    applySnapshot(input: $input) {
      isOk
      output
    }
  }
`;

const SYNC_FROM_NETWORK_MUTATION = gql`
  mutation syncFromNetwork($deviceId: String!) {
    syncFromNetwork(deviceId: $deviceId) {
      dataStore {
        operational
      }
    }
  }
`;

type Props = {
  deviceId: string;
};

const DeviceConfig: FC<Props> = ({ deviceId }) => {
  const [{ data, fetching, error }, reexecuteQuery] = useQuery<QueryDataStoreQuery, QueryDataStoreQueryVariables>({
    query: DATA_STORE_QUERY,
    variables: { deviceId },
  });
  const [{ fetching: isUpdateStoreLoading }, updateDataStore] = useMutation<
    UpdateDataStoreMutation,
    UpdateDataStoreMutationVariables
  >(UPDATE_DATA_STORE_MUTATION);
  const [{ fetching: isCommitLoading }, commitConfig] = useMutation<
    CommitDataStoreConfigMutation,
    CommitDataStoreConfigMutationVariables
  >(COMMIT_DATA_STORE_MUTATION);
  const [{ fetching: isResetLoading }, resetConfig] = useMutation<ResetConfigMutation, ResetConfigMutationVariables>(
    RESET_CONFIG_MUTATION,
  );
  const [{ fetching: isAddLoading }, addSnapshot] = useMutation<AddSnapshotMutation, AddSnapshotMutationVariables>(
    ADD_SNAPSHOT_MUTATION,
  );
  const [{ fetching: isApplySnapshotLoading }, applySnapshot] = useMutation<
    ApplySnapshotMutation,
    ApplySnapshotMutationVariables
  >(APPLY_SNAPSHOT_MUTATION);
  const [{ fetching: isSyncLoading }, syncFromNetwork] = useMutation<
    SyncFromNetworkMutation,
    SyncFromNetworkMutationVariables
  >(SYNC_FROM_NETWORK_MUTATION);

  const [config, setConfig] = useState<string>();
  const toast = useToast();
  const { isOpen: isSnapshotModalOpen, onClose: onSnapshotModalClose, onOpen: onSnapshotModalOpen } = useDisclosure();
  const { isOpen: isDiffModalOpen, onClose: onDiffModalClose, onOpen: onDiffModalOpen } = useDisclosure();

  useEffect(() => {
    if (data != null && data.dataStore != null) {
      setConfig(JSON.stringify(JSON.parse(data.dataStore.config ?? ''), null, 2));
    }
  }, [data]);

  const handleOnSaveConfig = async () => {
    const { data: responseData, error: responseError } = await updateDataStore({
      deviceId,
      input: { config: JSON.stringify(JSON.parse(config ?? ''), null, 0) },
    });

    if (responseError != null) {
      toast({
        title: 'Failed to update config data store',
        isClosable: true,
        duration: 2000,
        status: 'error',
      });
    }

    if (responseData != null) {
      reexecuteQuery({ requestPolicy: 'network-only' });

      toast({
        title: 'Successfully updated config data store',
        isClosable: true,
        duration: 2000,
        status: 'success',
      });
    }
  };

  const handleOnCommitConfig = async (isDryRun?: boolean) => {
    const { data: responseData } = await commitConfig({ input: { deviceId, shouldDryRun: isDryRun } });

    if (responseData?.commitConfig.isOk) {
      toast({
        duration: 2000,
        isClosable: true,
        status: 'success',
        title: 'Successfully commited to network',
      });
    } else {
      toast({
        duration: 2000,
        isClosable: true,
        status: 'error',
        title: 'Failed to commit to network',
      });
    }
  };

  const handleOnResetConfig = async () => {
    const { data: responseData } = await resetConfig({ deviceId });
    if (responseData != null) {
      toast({
        duration: 2000,
        isClosable: true,
        status: 'success',
        title: 'Successfully replaced config with operational',
      });

      reexecuteQuery({ requestPolicy: 'network-only' });
    } else {
      toast({
        duration: 2000,
        isClosable: true,
        status: 'error',
        title: 'Failed to replaced config with operational',
      });
    }
  };

  const handleOnAddSnapshot = async (name: string) => {
    const { error: responseError } = await addSnapshot({ input: { name, deviceId } });
    const hasError = responseError != null;

    toast({
      duration: 2000,
      isClosable: true,
      status: hasError ? 'error' : 'success',
      title: hasError ? 'Failed to create snapshot' : 'Successfully created snapshot',
    });
  };

  const handleOnApplySnapshot = async (name: string) => {
    const { error: responseError } = await applySnapshot({ input: { name, deviceId } });
    const hasError = responseError != null;
    reexecuteQuery({ requestPolicy: 'network-only' });
    toast({
      duration: 2000,
      isClosable: true,
      status: hasError ? 'error' : 'success',
      title: hasError ? 'Failed to apply snapshot' : 'Successfully applied snapshot',
    });
  };

  const handleSyncBtnClick = async () => {
    const { error: responseError } = await syncFromNetwork({ deviceId });
    const hasError = responseError != null;

    toast({
      duration: 2000,
      isClosable: true,
      status: hasError ? 'error' : 'success',
      title: hasError ? 'Failed to sync from network' : 'Successfully synced from network',
    });
  };

  const isInitialLoading = fetching && data == null;

  if (isInitialLoading) {
    return <Progress size="xs" isIndeterminate mt={-10} />;
  }

  if (error != null) {
    return <div>{error.message}</div>;
  }

  const snapshots = data?.dataStore?.snapshots ?? [];

  return (
    <>
      <CreateSnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={onSnapshotModalClose}
        onFormSubmit={handleOnAddSnapshot}
        isLoading={isAddLoading}
      />
      {isDiffModalOpen && <DiffOutputModal onClose={onDiffModalClose} deviceId={deviceId} />}
      <Container maxWidth={1280}>
        <DeviceConfigActions
          onCreateSnapshotBtnClick={onSnapshotModalOpen}
          snapshots={snapshots}
          onLoadSnapshotClick={handleOnApplySnapshot}
          onCommitBtnClick={() => {
            handleOnCommitConfig();
          }}
          onDryRunBtnClick={() => {
            handleOnCommitConfig(true);
          }}
          onCalculateDiffBtnClick={onDiffModalOpen}
          isApplySnapshotLoading={isApplySnapshotLoading}
          isCommitLoading={isCommitLoading}
        />
        <Box background="white" padding={4}>
          <DeviceConfigEditors
            config={config ?? ''}
            operational={JSON.stringify(JSON.parse(data?.dataStore?.operational ?? ''), null, 2)}
            onConfigChange={(cfg) => {
              setConfig(cfg);
            }}
            onReplaceBtnClick={handleOnResetConfig}
            onConfigSaveBtnClick={handleOnSaveConfig}
            onRefreshBtnClick={() => {
              reexecuteQuery({ requestPolicy: 'network-only' });
            }}
            onSyncBtnClick={handleSyncBtnClick}
            isResetLoading={isResetLoading}
            isUpdateStoreLoading={isUpdateStoreLoading}
            isSyncLoading={isSyncLoading}
          />
        </Box>
      </Container>
    </>
  );
};

export default DeviceConfig;
