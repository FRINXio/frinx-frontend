import { Box, Container, Flex, Heading, Progress, useDisclosure } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import unwrap from '../../helpers/unwrap';
import useNotifications from '../../hooks/use-notifications';
import {
  AddSnapshotMutation,
  AddSnapshotMutationVariables,
  ApplySnapshotMutation,
  ApplySnapshotMutationVariables,
  CloseTransactionMutation,
  CloseTransactionMutationVariables,
  CommitDataStoreConfigMutation,
  CommitDataStoreConfigMutationVariables,
  CreateTransactionMutation,
  CreateTransactionMutationVariables,
  DataStoreQuery,
  DataStoreQueryVariables,
  DeviceNameQuery,
  DeviceNameQueryVariables,
  ResetConfigMutation,
  ResetConfigMutationVariables,
  SyncFromNetworkMutation,
  SyncFromNetworkMutationVariables,
  UpdateDataStoreMutation,
  UpdateDataStoreMutationVariables,
} from '../../__generated__/graphql';
import CreateSnapshotModal from './create-snapshot-modal';
import DeviceConfigActions from './device-config-actions';
import DeviceConfigEditors from './device-config-editors';
import DiffOutputModal from './diff-output-modal';

const DEVICE_NAME_QUERY = gql`
  query deviceName($deviceId: ID!) {
    node(id: $deviceId) {
      ... on Device {
        id
        name
      }
    }
  }
`;

const DATA_STORE_QUERY = gql`
  query dataStore($deviceId: String!, $transactionId: String!) {
    dataStore(deviceId: $deviceId, transactionId: $transactionId) {
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
  mutation updateDataStore($deviceId: String!, $transactionId: String!, $input: UpdateDataStoreInput!) {
    updateDataStore(deviceId: $deviceId, transactionId: $transactionId, input: $input) {
      dataStore {
        config
        operational
      }
    }
  }
`;

const COMMIT_DATA_STORE_MUTATION = gql`
  mutation commitDataStoreConfig($transactionId: String!, $input: CommitConfigInput!) {
    commitConfig(transactionId: $transactionId, input: $input) {
      isOk
    }
  }
`;

const RESET_CONFIG_MUTATION = gql`
  mutation resetConfig($deviceId: String!, $transactionId: String!) {
    resetConfig(deviceId: $deviceId, transactionId: $transactionId) {
      dataStore {
        config
        operational
      }
    }
  }
`;

const ADD_SNAPSHOT_MUTATION = gql`
  mutation addSnapshot($transactionId: String!, $input: AddSnapshotInput!) {
    addSnapshot(transactionId: $transactionId, input: $input) {
      snapshot {
        name
      }
    }
  }
`;

const APPLY_SNAPSHOT_MUTATION = gql`
  mutation applySnapshot($transactionId: String!, $input: ApplySnapshotInput!) {
    applySnapshot(transactionId: $transactionId, input: $input) {
      isOk
      output
    }
  }
`;

const SYNC_FROM_NETWORK_MUTATION = gql`
  mutation syncFromNetwork($deviceId: String!, $transactionId: String!) {
    syncFromNetwork(deviceId: $deviceId, transactionId: $transactionId) {
      dataStore {
        operational
      }
    }
  }
`;
const CREATE_TRANSACTION_MUTATION = gql`
  mutation createTransaction($deviceId: String!) {
    createTransaction(deviceId: $deviceId) {
      transactionId
    }
  }
`;
const CLOSE_TRANSACTION_MUTATION = gql`
  mutation closeTransaction($deviceId: String!, $transactionId: String!) {
    closeTransaction(deviceId: $deviceId, transactionId: $transactionId) {
      isOk
    }
  }
`;

const TRANSACTION_ID_KEY = 'TX_ID_INVENTORY';

const useTransactionId = (deviceId: string) => {
  const [, createTransaction] = useMutation<CreateTransactionMutation, CreateTransactionMutationVariables>(
    CREATE_TRANSACTION_MUTATION,
  );
  const [{ fetching: isClosingTransaction }, closeTransaction] = useMutation<
    CloseTransactionMutation,
    CloseTransactionMutationVariables
  >(CLOSE_TRANSACTION_MUTATION);

  const [transactionId, setTransactionId] = useState(localStorage.getItem(TRANSACTION_ID_KEY));

  useEffect(() => {
    if (transactionId == null) {
      createTransaction({ deviceId }).then((res) => {
        const { data, error } = res;

        if (error != null) {
          throw new Error(error.toString());
        }

        if (data?.createTransaction.transactionId != null) {
          setTransactionId(data.createTransaction.transactionId);
          localStorage.setItem(TRANSACTION_ID_KEY, data.createTransaction.transactionId);
        }
      });
    }

    return () => {
      if (transactionId != null) {
        localStorage.removeItem(TRANSACTION_ID_KEY);
        closeTransaction({ deviceId, transactionId });
      }
    };
  }, [createTransaction, deviceId, closeTransaction, transactionId]);

  const removeTransaction = () => {
    localStorage.removeItem(TRANSACTION_ID_KEY);
    setTransactionId(null);
  };

  return {
    transactionId,
    isClosingTransaction,
    removeTransaction,
    closeTransaction: async () => {
      closeTransaction({ deviceId, transactionId: unwrap(transactionId) }).then(() => {
        removeTransaction();
      });
    },
  };
};

type Props = {
  deviceId: string;
};

const DeviceConfig: FC<Props> = ({ deviceId }) => {
  const [{ data: deviceData, fetching: isFetchingDevice, error: deviceError }] = useQuery<
    DeviceNameQuery,
    DeviceNameQueryVariables
  >({
    query: DEVICE_NAME_QUERY,
    variables: { deviceId },
  });
  const { transactionId, isClosingTransaction, closeTransaction, removeTransaction } = useTransactionId(deviceId);
  const [{ data, fetching, error }, reexecuteQuery] = useQuery<DataStoreQuery, DataStoreQueryVariables>({
    query: DATA_STORE_QUERY,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    variables: { deviceId, transactionId },
    pause: transactionId == null,
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
  // const toast = useToast();
  const { addToastNotification } = useNotifications();
  const { isOpen: isSnapshotModalOpen, onClose: onSnapshotModalClose, onOpen: onSnapshotModalOpen } = useDisclosure();
  const { isOpen: isDiffModalOpen, onClose: onDiffModalClose, onOpen: onDiffModalOpen } = useDisclosure();

  useEffect(() => {
    if (data != null && data.dataStore != null) {
      setConfig(JSON.stringify(JSON.parse(data.dataStore.config ?? ''), null, 2));
    }
  }, [data]);

  if (transactionId == null) {
    return null;
  }

  const handleOnSaveConfig = async () => {
    const { data: responseData, error: responseError } = await updateDataStore({
      deviceId,
      transactionId,
      input: { config: JSON.stringify(JSON.parse(config ?? ''), null, 0) },
    });

    if (responseError != null) {
      addToastNotification({
        type: 'error',
        title: 'Error',
        content: 'Failed to update config data store',
      });
    }

    if (responseData != null) {
      reexecuteQuery({ requestPolicy: 'network-only' });

      addToastNotification({
        type: 'success',
        title: 'Success',
        content: 'Successfully updated config data store',
      });
    }
  };

  const handleOnCommitConfig = async (isDryRun?: boolean) => {
    const { data: responseData, error: responseError } = await commitConfig({
      transactionId,
      input: { deviceId, shouldDryRun: isDryRun },
    });

    if (responseError != null) {
      addToastNotification({
        type: 'error',
        title: 'Error',
        content: isDryRun ? 'Dry run failed' : 'Failed to commit to network',
      });
    }

    if (responseData != null) {
      removeTransaction();
      reexecuteQuery({ requestPolicy: 'network-only' });

      addToastNotification({
        type: 'success',
        title: 'Success',
        content: isDryRun ? 'Dry run successfull' : 'Successfully commited to network',
      });
    }
  };

  const handleOnResetConfig = async () => {
    const { data: responseData, error: responseError } = await resetConfig({ deviceId, transactionId });

    if (responseError != null) {
      addToastNotification({
        type: 'error',
        title: 'Error',
        content: 'Failed to replace config with operational',
      });
    }

    if (responseData != null) {
      reexecuteQuery({ requestPolicy: 'network-only' });

      addToastNotification({
        type: 'success',
        title: 'Success',
        content: 'Successfully replaced config with operational',
      });
    }
  };

  const handleOnAddSnapshot = async (name: string) => {
    const { data: responseData, error: responseError } = await addSnapshot({
      input: { name, deviceId },
      transactionId,
    });

    if (responseError != null) {
      addToastNotification({
        type: 'error',
        title: 'Error',
        content: 'Failed to create snapshot',
      });
    }

    if (responseData != null) {
      reexecuteQuery({ requestPolicy: 'network-only' });

      addToastNotification({
        type: 'success',
        title: 'Success',
        content: 'Successfully created snapshot',
      });
    }
  };

  const handleOnApplySnapshot = async (name: string) => {
    const { data: responseData, error: responseError } = await applySnapshot({
      input: { name, deviceId },
      transactionId,
    });
    reexecuteQuery({ requestPolicy: 'network-only' });

    if (responseError != null) {
      addToastNotification({
        type: 'error',
        title: 'Error',
        content: 'Failed to apply snapshot',
      });
    }

    if (responseData != null) {
      reexecuteQuery({ requestPolicy: 'network-only' });

      addToastNotification({
        type: 'success',
        title: 'Success',
        content: 'Successfully applied snapshot',
      });
    }
  };

  const handleSyncBtnClick = async () => {
    const { data: responseData, error: responseError } = await syncFromNetwork({ deviceId, transactionId });

    if (responseError != null) {
      addToastNotification({
        type: 'error',
        title: 'Error',
        content: 'Failed to sync from network',
      });
    }

    if (responseData != null) {
      reexecuteQuery({ requestPolicy: 'network-only' });

      addToastNotification({
        type: 'success',
        title: 'Success',
        content: 'Successfully synced from network',
      });
    }
  };

  const handleCloseTransactionBtnClick = async () => {
    closeTransaction().then(() => {
      addToastNotification({
        type: 'success',
        title: 'Success',
        content: 'Sucessfully discarded changes',
      });
    });
  };

  const isInitialLoading = fetching && data == null;

  if (isInitialLoading) {
    return <Progress size="xs" isIndeterminate mt={-10} />;
  }

  if (isFetchingDevice) {
    return <Progress size="xs" isIndeterminate mt={-10} />;
  }

  if (deviceData == null || deviceError) {
    return null;
  }

  if (deviceData.node?.__typename !== 'Device') {
    return null;
  }

  const { name } = deviceData.node;

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
      {isDiffModalOpen && (
        <DiffOutputModal onClose={onDiffModalClose} deviceId={deviceId} transactionId={transactionId} />
      )}
      <Container maxWidth={1280}>
        <Flex justify="space-between" align="center" marginBottom={6}>
          <Heading as="h2" size="3xl">
            {name}
          </Heading>
        </Flex>
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
          onTransactionCloseBtnClick={handleCloseTransactionBtnClick}
          isApplySnapshotLoading={isApplySnapshotLoading}
          isCommitLoading={isCommitLoading}
          isCloseTransactionLoading={isClosingTransaction}
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
            isRefreshLoading={fetching && data != null}
          />
        </Box>
      </Container>
    </>
  );
};

export default DeviceConfig;
