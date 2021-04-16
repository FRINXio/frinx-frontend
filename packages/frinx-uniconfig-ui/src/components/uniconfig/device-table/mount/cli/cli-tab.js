import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Stack,
  useToast,
} from '@chakra-ui/react';
import Console from '../console';
import React, { useEffect, useState } from 'react';
import callbackUtils from '../../../../../utils/callback.utils';
import { useInterval } from '../../../../common/use-interval';
import CliBasicForm from './cli-basic-form';
import CliAdvForm from './cli-adv-form';

const CliTab = ({ supportedDevices, templateNode }) => {
  const [cliBasicForm, setCliBasicForm] = useState({
    'network-topology:node-id': 'xr5',
    'cli-topology:host': '192.168.1.215',
    'cli-topology:port': '22',
    'cli-topology:device-type': 'ios xr',
    'cli-topology:device-version': '*',
    'cli-topology:transport-type': 'ssh',
    'cli-topology:username': 'cisco',
    'cli-topology:password': 'cisco',
  });
  const [cliAdvForm, setCliAdvForm] = useState({
    dryRun: false,
    lazyConnection: false,
    privilegedMode: false,
    'node-extension:reconcile': true,
    'cli-topology:journal-size': 150,
    'cli-topology:dry-run-journal-size': 150,
    'cli-topology:secret': 'cisco',
    'cli-topology:command-timeout': 60,
    'cli-topology:connection-lazy-timeout': 60,
    'cli-topology:connection-establish-timeout': 60,
    'cli-topology:keepalive-delay': 45,
    'cli-topology:keepalive-timeout': 45,
  });
  const [nodeId, setNodeId] = useState();
  const [outputConsole, setOutputConsole] = useState({ output: [], isRunning: false });
  const toast = useToast();

  useEffect(() => {
    templateNode?.topologyId === 'cli' && setNodeTemplate(templateNode);
  }, [templateNode]);

  const setNodeTemplate = async (templateNode) => {
    if (!templateNode) {
      return null;
    }
    const { nodeId } = templateNode;

    const getCliConfigurationalState = callbackUtils.getCliConfigurationalStateCallback();
    const state = await getCliConfigurationalState(nodeId);

    if (!state) {
      toast({
        title: `${nodeId} is not available`,
        status: 'warning',
        duration: 9000,
        isClosable: true,
      });
    }

    setCliBasicForm({
      ...cliBasicForm,
      'network-topology:node-id': state['node-id'],
      'cli-topology:device-version': state['cli-topology:device-version'].replace('x', '*'),
      ...state,
    });

    setCliAdvForm({
      ...cliAdvForm,
      dryRun: !!state['cli-topology:dry-run-journal-size'],
      lazyConnection: !!state['cli-topology:command-timeout'],
      privilegedMode: !!state['cli-topology:secret'],
      ...state,
    });
  };

  // interval to check node connection status when console is open
  useInterval(
    () => {
      checkConnectionStatus(nodeId);
    },
    outputConsole.isRunning ? 2000 : null,
  );

  const getDeviceTypeVersions = (deviceType) => {
    if (!cliBasicForm['cli-topology:device-type']) {
      return [];
    }
    return supportedDevices[deviceType]?.map((d) => d['device-version']);
  };

  const mountCliDevice = async () => {
    const dryRunOn = {
      'cli-topology:dry-run-journal-size': parseInt(cliAdvForm['cli-topology:dry-run-journal-size']),
    };

    const privilegedModeOn = {
      'cli-topology:secret': cliAdvForm['cli-topology:secret'],
    };

    const privilegedModeOn = {
      'cli-topology:secret': cliMountAdvForm['cli-topology:secret'],
    };

    const lazyConnectionOn = {
      'cli-topology:command-timeout': parseInt(cliAdvForm['cli-topology:command-timeout']),
      'cli-topology:connection-lazy-timeout': parseInt(cliAdvForm['cli-topology:connection-lazy-timeout']),
      'cli-topology:connection-establish-timeout': parseInt(cliAdvForm['cli-topology:connection-establish-timeout']),
    };

    const lazyConnectionOff = {
      'cli-topology:keepalive-delay': parseInt(cliAdvForm['cli-topology:keepalive-delay']),
      'cli-topology:keepalive-timeout': parseInt(cliAdvForm['cli-topology:keepalive-timeout']),
    };

    const payload = {
      'network-topology:node': [
        {
          ...cliBasicForm,
          'node-extension:reconcile': cliAdvForm['node-extension:reconcile'],
          'cli-topology:journal-size': cliAdvForm['cli-topology:journal-size'],
          'cli-topology:dry-run-journal-size': parseInt(cliAdvForm['cli-topology:dry-run-journal-size']),
          ...(cliAdvForm.dryRun ? dryRunOn : null),
          ...(cliAdvForm.lazyConnection ? lazyConnectionOn : lazyConnectionOff),
          ...(cliAdvForm.privilegedMode ? privilegedModeOn : null),
        },
      ],
    };

    const nodeId = cliBasicForm['network-topology:node-id'];

    const mountCliNode = callbackUtils.mountCliNodeCallback();
    const result = await mountCliNode(nodeId, payload);

    const { status, statusText } = result;

    setNodeId(nodeId);
    setOutputConsole({ ...outputConsole, isRunning: true });
    toast({
      title: `${status} ${statusText}`,
      status: status.toString().startsWith('2') ? 'success' : 'error',
      duration: 9000,
      isClosable: true,
    });
  };

  const checkConnectionStatus = async (nodeId) => {
    const getCliOperationalState = callbackUtils.getCliOperationalStateCallback();
    const state = await getCliOperationalState(nodeId);

    const connectionStatus = state['cli-topology:connection-status'];
    const connectedMessage = state['cli-topology:connected-message'];
    const date = new Date().toLocaleTimeString();
    const connectionStatusString = `[${date}] ${connectionStatus}`;
    const connectedMessageString = `[${date}] ${connectedMessage}`;

    setOutputConsole({
      ...outputConsole,
      output: [...outputConsole.output, connectionStatusString, connectedMessageString],
    });
  };

  return (
    <>
      <CliBasicForm
        cliBasicForm={cliBasicForm}
        setCliBasicForm={setCliBasicForm}
        supportedDevices={supportedDevices}
        getDeviceTypeVersions={getDeviceTypeVersions}
      />
      <Accordion allowToggle mt={8} mb={8}>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Advanced Settings
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <CliAdvForm cliAdvForm={cliAdvForm} setCliAdvForm={setCliAdvForm} />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Output
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Console outputConsole={outputConsole} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Stack direction="row" justify="flex-end">
        <Button colorScheme="blue" onClick={mountCliDevice}>
          Mount
        </Button>
      </Stack>
    </>
  );
};

export default CliTab;
