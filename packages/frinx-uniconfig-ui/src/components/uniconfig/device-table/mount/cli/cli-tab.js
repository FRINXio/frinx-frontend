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

const INITIAL_CLI_BASIC_FORM_VALUES = {
  'network-topology:node-id': 'xr5',
  'cli-topology:host': '192.168.1.215',
  'cli-topology:port': '22',
  'cli-topology:device-type': 'ios xr',
  'cli-topology:device-version': '*',
  'cli-topology:transport-type': 'ssh',
  'cli-topology:username': 'cisco',
  'cli-topology:password': 'cisco',
};

const INITIAL_CLI_ADVANCED_FORM_VALUES = {
  hasDryRun: false,
  hasLazyConnection: false,
  hasPrivilegedMode: false,
  'node-extension:reconcile': true,
  'cli-topology:journal-size': 150,
  'cli-topology:dry-run-journal-size': 150,
  'cli-topology:secret': 'cisco',
  'cli-topology:command-timeout': 60,
  'cli-topology:connection-lazy-timeout': 60,
  'cli-topology:connection-establish-timeout': 60,
  'cli-topology:keepalive-delay': 45,
  'cli-topology:keepalive-timeout': 45,
};

const getCliBasicFormFromNodeState = (state) => {
  return {
    ...cliBasicForm,
    'network-topology:node-id': state['node-id'],
    'cli-topology:device-version': state['cli-topology:device-version'].replace('x', '*'),
    ...state,
  };
};

const getCliAdvFormFromNodeState = (state) => {
  return {
    ...cliAdvForm,
    hasDryRun: !!state['cli-topology:dry-run-journal-size'],
    hasLazyConnection: !!state['cli-topology:command-timeout'],
    hasPrivilegedMode: !!state['cli-topology:secret'],
    ...state,
  };
};

const getDeviceTypeVersions = (supportedDevices, deviceType) => {
  if (supportedDevices[deviceType] == null) {
    return [];
  }

  return supportedDevices[deviceType].map((d) => d['device-version']);
};

const CliTab = ({ supportedDevices, templateNode }) => {
  const [cliBasicForm, setCliBasicForm] = useState(INITIAL_CLI_BASIC_FORM_VALUES);
  const [cliAdvForm, setCliAdvForm] = useState(INITIAL_CLI_ADVANCED_FORM_VALUES);
  const [nodeId, setNodeId] = useState();
  const [outputConsole, setOutputConsole] = useState({ output: [], isRunning: false });
  const toast = useToast();

  useEffect(async () => {
    const { nodeId, topologyId } = templateNode;

    if (topologyId === 'cli') {
      setFormsFromNode(nodeId);
    }
  }, [templateNode]);

  const getCliNodeState = async (nodeId) => {
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

    return state;
  };

  const setFormsFromNode = async (nodeId) => {
    const state = await getCliNodeState(nodeId);

    const cliBasicForm = getCliBasicFormFromNodeState(state);
    const cliAdvForm = getCliAdvFormFromNodeState(state);

    setCliBasicForm(cliBasicForm);
    setCliAdvForm(cliAdvForm);
  };

  // interval to check node connection status when console is open
  useInterval(
    () => {
      checkConnectionStatus(nodeId);
    },
    outputConsole.isRunning ? 2000 : null,
  );

  const mountCliDevice = async () => {
    const dryRunOn = {
      'cli-topology:dry-run-journal-size': parseInt(cliAdvForm['cli-topology:dry-run-journal-size']),
    };

    const privilegedModeOn = {
      'cli-topology:secret': cliAdvForm['cli-topology:secret'],
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
          ...(cliAdvForm.hasDryRun ? dryRunOn : null),
          ...(cliAdvForm.hasLazyConnection ? lazyConnectionOn : lazyConnectionOff),
          ...(cliAdvForm.hasPrivilegedMode ? privilegedModeOn : null),
        },
      ],
    };

    const nodeId = cliBasicForm['network-topology:node-id'];

    const mountCliNode = callbackUtils.mountCliNodeCallback();
    const result = await mountCliNode(nodeId, payload);

    const { status, statusText } = result;

    setNodeId(nodeId);
    setOutputConsole((prev) => ({ ...prev, isRunning: true }));
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

    setOutputConsole((prev) => ({
      ...prev,
      output: [...prev.output, connectionStatusString, connectedMessageString],
    }));
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
