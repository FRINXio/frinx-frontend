import React, { useEffect, useState } from 'react';
import {
  Grid,
  GridItem,
  Container,
  Box,
  Flex,
  Menu,
  Button,
  IconButton,
  MenuList,
  MenuButton,
  MenuItem,
  Stack,
  ButtonGroup,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import CreateSnapshotModal from './createSnapshotModal/CreateSnapshotModal';
import callbackUtils from '../../../utils/callbackUtils';
import Config from './editor/Config';
import Oper from './editor/Oper';
import ResponseModal from './responseModal/ResponseModal';
import ConfirmDeleteModal from './confirmDeleteModal/ConfirmDeleteModal';

const DeviceView = ({ deviceId }) => {
  const [config, setConfig] = useState();
  const [operational, setOperational] = useState();
  const [snapshots, setSnapshots] = useState([]);
  const [showDiff, setShowDiff] = useState(false);
  const [rawResponse, setRawResponse] = useState();
  const [isLoading, setIsLoading] = useState({
    config: false,
    oper: false,
    calculatedDiff: false,
    dryRun: false,
    syncFromNetwork: false,
    replaceConfigWithOper: false,
    replaceConfigWithSnapshot: false,
    deleteSnapshot: false,
    commitToNetwork: false,
  });
  const toast = useToast();

  useEffect(() => {
    const getCliConfigurationalDataStore = callbackUtils.getCliConfigurationalDataStoreCallback();
    const getCliOperationalDatastore = callbackUtils.getCliOperationalDataStoreCallback();

    setIsLoading({ oper: true, config: true });

    getCliConfigurationalDataStore(deviceId).then((datastore) => {
      setConfig(datastore);
      setIsLoading((prevState) => ({ ...prevState, config: false }));
    });

    getCliOperationalDatastore(deviceId).then((datastore) => {
      setOperational(datastore);
      setIsLoading((prevState) => ({ ...prevState, oper: false }));
    });
  }, [deviceId]);

  function operationHandler(operation, response) {
    setIsLoading((prevState) => ({ ...prevState, [operation]: false }));
    toast({
      title: `${response?.output?.['overall-status']}`,
      status: response?.output?.['overall-status'] === 'complete' ? 'success' : 'error',
      duration: 9000,
      isClosable: true,
    });
    setRawResponse(response);
  }

  async function updateConfig(newConfig) {
    const updateCliConfigurationalDataStore = callbackUtils.updateCliConfigurationalDataStoreCallback();

    setIsLoading((prevState) => ({ ...prevState, config: true }));
    const response = await updateCliConfigurationalDataStore(deviceId, newConfig);

    // config is not pulled again just replaced locally
    setConfig(newConfig);
    setIsLoading((prevState) => ({ ...prevState, config: false }));

    const { status, statusText } = response;

    toast({
      title: `${status} ${statusText}`,
      status: status >= 200 && status < 300 ? 'success' : 'error',
      duration: 9000,
      isClosable: true,
    });
  }

  async function refreshConfig() {
    const getCliConfigurationalDataStore = callbackUtils.getCliConfigurationalDataStoreCallback();

    setIsLoading((prevState) => ({ ...prevState, config: true }));
    const config = await getCliConfigurationalDataStore(deviceId);
    setIsLoading((prevState) => ({ ...prevState, config: false }));
    setConfig(config);
  }

  async function getCalculatedDiff() {
    const target = {
      input: {
        'target-nodes': { node: [deviceId.replace(/%20/g, ' ')] },
      },
    };

    setIsLoading((prevState) => ({ ...prevState, calculatedDiff: true }));
    const calculateDiff = callbackUtils.calculateDiffCallback();
    const response = await calculateDiff(target);
    operationHandler('calculatedDiff', response);
  }

  async function dryRun() {
    const target = {
      input: {
        'target-nodes': { node: [deviceId.replace(/%20/g, ' ')] },
      },
    };

    setIsLoading((prevState) => ({ ...prevState, dryRun: true }));
    const dryRunCommit = callbackUtils.dryRunCommitCallback();
    const response = await dryRunCommit(target);
    operationHandler('dryRun', response);
  }

  async function syncFromNetwork() {
    const target = {
      input: {
        'target-nodes': { node: [deviceId.replace(/%20/g, ' ')] },
      },
    };

    const syncFromNetwork = callbackUtils.syncFromNetworkCallback();
    const getCliOperationalDataStore = callbackUtils.getCliOperationalDataStoreCallback();

    setIsLoading((prevState) => ({ ...prevState, syncFromNetwork: true }));
    const syncReponse = await syncFromNetwork(target);
    const datastore = await getCliOperationalDataStore(deviceId);
    setOperational(datastore);
    operationHandler('syncFromNetwork', syncReponse);
  }

  async function replaceConfigWithOper() {
    const target = {
      input: {
        'target-nodes': { node: [deviceId.replace(/%20/g, ' ')] },
      },
    };

    const replaceConfigWithOperational = callbackUtils.replaceConfigWithOperationalCallback();

    setIsLoading((prevState) => ({ ...prevState, replaceConfigWithOper: true }));
    const replaceResponse = await replaceConfigWithOperational(target);
    operationHandler('replaceConfigWithOper', replaceResponse);
    refreshConfig();
  }

  async function getSnapshots() {
    const getSnapshots = callbackUtils.getSnapshotsCallback();

    const snapshotsResponse = await getSnapshots();
    const topologies = ['cli', 'uniconfig', 'topology-netconf', 'unitopo'];
    const snapshots = snapshotsResponse['network-topology']['topology'].filter(
      (topology) =>
        topology?.['node']?.['0']?.['node-id'] === deviceId && !topologies.includes(topology['topology-id']),
    );

    const snapshotNames = snapshots.map((ss) => ss['topology-id']);
    setSnapshots(snapshotNames);
  }

  async function replaceConfigWithSnapshot(snapshotId) {
    const target = {
      input: {
        name: snapshotId,
        'target-nodes': { node: [deviceId.replace(/%20/g, ' ')] },
      },
    };

    const replaceConfigWithSnapshot = callbackUtils.replaceConfigWithSnapshotCallback();

    setIsLoading((prevState) => ({ ...prevState, replaceConfigWithSnapshot: true }));
    const response = await replaceConfigWithSnapshot(target);
    operationHandler('replaceConfigWithSnapshot', response);
    refreshConfig();
  }

  async function deleteSnapshot(snapshotId) {
    const deleteSnapshot = callbackUtils.deleteSnapshotCallback();
    const target = { input: { name: snapshotId } };

    setIsLoading((prevState) => ({ ...prevState, deleteSnapshot: true }));
    const response = await deleteSnapshot(target);
    operationHandler('deleteSnapshot', response);
    getSnapshots();
  }

  async function commitToNetwork() {
    const target = {
      input: {
        'target-nodes': { node: [deviceId.replace(/%20/g, ' ')] },
      },
    };

    const commitToNetwork = callbackUtils.commitToNetworkCallback();
    const getCliOperationalDataStore = callbackUtils.getCliOperationalDataStoreCallback();

    setIsLoading((prevState) => ({ ...prevState, commitToNetwork: true }));
    const response = await commitToNetwork(target);
    const datastore = await getCliOperationalDataStore(deviceId);
    setOperational(datastore);
    operationHandler('commitToNetwork', response);
  }

  return (
    <Container maxWidth={1280}>
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem colSpan={12}>
          <Box boxShadow="base" borderRadius="md" bg="white" w="100%" h="100%" p={4} color="black">
            <Flex justify="space-between">
              <Stack direction="row" spacing={2}>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} onClick={getSnapshots}>
                    Load Snapshot
                  </MenuButton>
                  <MenuList>
                    {snapshots.map((snapshot) => (
                      <MenuItem onClick={() => replaceConfigWithSnapshot(snapshot)} justifyContent="space-between">
                        {snapshot}
                        <ConfirmDeleteModal
                          snapshotId={snapshot}
                          deleteSnapshot={deleteSnapshot}
                          isLoading={isLoading.deleteSnapshot}
                        />
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <CreateSnapshotModal deviceId={deviceId} operationHandler={operationHandler} />
                <ResponseModal body={rawResponse} />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Heading size="lg">{deviceId}</Heading>
              </Stack>
              <Stack direction="row" spacing={2}>
                <ButtonGroup isAttached>
                  <Button onClick={() => setShowDiff((prevState) => !prevState)}>
                    {showDiff ? 'Hide diff' : 'Show diff'}
                  </Button>
                  <Menu>
                    <MenuButton isLoading={isLoading.calculatedDiff} as={IconButton} icon={<ChevronDownIcon />} />
                    <MenuList>
                      <MenuItem onClick={getCalculatedDiff}>Show calculated diff</MenuItem>
                    </MenuList>
                  </Menu>
                </ButtonGroup>
                <Button onClick={dryRun}>Dry run</Button>
                <Button colorScheme="blue" onClick={commitToNetwork}>
                  Commit to Network
                </Button>
              </Stack>
            </Flex>
          </Box>
        </GridItem>
        <GridItem colSpan={6}>
          <Box boxShadow="base" borderRadius="md" bg="white" w="100%" h="100%" p={4}>
            <Config
              isLoading={isLoading.config}
              currentConfigState={config}
              updateConfig={updateConfig}
              refreshConfig={refreshConfig}
              replaceConfigWithOper={replaceConfigWithOper}
            />
          </Box>
        </GridItem>
        <GridItem colSpan={6}>
          <Box boxShadow="base" borderRadius="md" bg="white" w="100%" h="100%" p={4}>
            <Oper
              isLoading={isLoading.oper}
              showDiff={showDiff}
              currentOperState={operational}
              currentConfigState={config}
              syncFromNetwork={syncFromNetwork}
            />
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default DeviceView;
