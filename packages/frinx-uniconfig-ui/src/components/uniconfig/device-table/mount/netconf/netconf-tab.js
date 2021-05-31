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
import { useInterval } from '../../../../common/use-interval';
import callbackUtils from '../../../../../utils/callback.utils';
import NetconfBasicForm from './netconf-basic-form/netconf-basic-form';
import NetconfAdvForm from './netconf-adv-form/netconf-adv-form';

const INITIAL_NETCONF_BASIC_FORM_VALUES = {
  'node-id': 'xr5',
  'netconf-node-topology:host': '192.168.1.213',
  'netconf-node-topology:port': 830,
  'netconf-node-topology:username': 'cisco',
  'netconf-node-topology:password': 'cisco',
};

const INITIAL_NETCONF_ADVANCED_FORM_VALUES = {
  hasDryRun: false,
  override: false,
  'netconf-node-topology:tcp-only': false,
  'netconf-node-topology:keepalive-delay': 0,
  'node-extension:reconcile': false,
  'netconf-node-topology:dry-run-journal-size': 180,
  'netconf-node-topology:yang-module-capabilities': '{"capability": []}',
  'uniconfig-config:uniconfig-native-enabled': true,
  'uniconfig-config:blacklist': {
    'uniconfig-config:path': [
      'openconfig-interfaces:interfaces',
      'ietf-interfaces:interfaces',
      'openconfig-vlan:vlans',
      'openconfig-routing-policy:routing-policy',
    ],
  },
};

const jsonParse = (data) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
};

const getNetconfBasicFormFromNodeState = (state) => {
  return {
    ...netconfBasicForm,
    ...state,
  };
};

const getNetconfAdvFormFromNodeState = (state) => {
  return {
    ...netconfAdvForm,
    dryRun: !!state['netconf-node-topology:dry-run-journal-size'],
    'netconf-node-topology:yang-module-capabilities': JSON.stringify(
      state['netconf-node-topology:yang-module-capabilities'],
      null,
      2,
    ),
    ...state,
  };
};

const NetconfTab = ({ templateNode }) => {
  const [netconfBasicForm, setNetconfBasicForm] = useState(INITIAL_NETCONF_BASIC_FORM_VALUES);
  const [netconfAdvForm, setNetconfAdvForm] = useState(INITIAL_NETCONF_ADVANCED_FORM_VALUES);
  const [nodeId, setNodeId] = useState();
  const [outputConsole, setOutputConsole] = useState({ output: [], isRunning: false });
  const toast = useToast();

  useEffect(() => {
    if (templateNode != null) {
      const { nodeId, topologyId } = templateNode;

      if (topologyId === 'topology-netconf') {
        setFormsFromNode(nodeId);
      }
    }
  }, [templateNode]);

  const getNetconfNodeState = async (nodeId) => {
    const getNetconfConfigurationalState = callbackUtils.getNetconfConfigurationalStateCallback();
    const state = await getNetconfConfigurationalState(nodeId);

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
    const state = await getNetconfNodeState(nodeId);

    const netconfBasicForm = getNetconfBasicFormFromNodeState(state);
    const netconfAdvForm = getNetconfAdvFormFromNodeState(state);

    setNetconfBasicForm(netconfBasicForm);
    setNetconfAdvForm(netconfAdvForm);
  };

  // interval to check node connection status when console is open
  useInterval(
    () => {
      checkConnectionStatus(nodeId);
    },
    outputConsole.isRunning ? 2000 : null,
  );

  const mountNetconfDevice = async () => {
    const dryRunOn = {
      'netconf-node-topology:dry-run-journal-size': parseInt(
        netconfAdvForm['netconf-node-topology:dry-run-journal-size'],
      ),
    };

    const overrideCapabilitiesOn = {
      'netconf-node-topology:yang-module-capabilities': jsonParse(
        netconfAdvForm['netconf-node-topology:yang-module-capabilities'],
      ),
    };

    const uniconfigNativeOn = {
      'uniconfig-config:uniconfig-native-enabled': netconfAdvForm['uniconfig-config:uniconfig-native-enabled'],
      'uniconfig-config:blacklist': netconfAdvForm['uniconfig-config:blacklist'],
    };

    const payload = {
      'network-topology:node': [
        {
          ...netconfBasicForm,
          'node-extension:reconcile': netconfAdvForm['node-extension:reconcile'],
          'netconf-node-topology:tcp-only': netconfAdvForm['netconf-node-topology:tcp-only'],
          'netconf-node-topology:keepalive-delay': parseInt(netconfAdvForm['netconf-node-topology:keepalive-delay']),
          ...(netconfAdvForm.hasDryRun ? dryRunOn : null),
          ...(netconfAdvForm.override ? overrideCapabilitiesOn : null),
          ...(netconfAdvForm['uniconfig-config:uniconfig-native-enabled'] ? uniconfigNativeOn : null),
        },
      ],
    };

    const nodeId = netconfBasicForm['node-id'];

    const mountNetconfNode = callbackUtils.mountNetconfNodeCallback();
    const result = await mountNetconfNode(nodeId, payload);

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
    const getNetconfOperationalState = callbackUtils.getNetconfOperationalStateCallback();
    const state = await getNetconfOperationalState(nodeId);

    const connectionStatus = state['netconf-node-topology:connection-status'];
    const connectedMessage = state['netconf-node-topology:connected-message'];
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
      <NetconfBasicForm netconfBasicForm={netconfBasicForm} setNetconfBasicForm={setNetconfBasicForm} />
      <Accordion allowToggle mt={8} mb={8}>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Advanced Settings
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <NetconfAdvForm netconfAdvForm={netconfAdvForm} setNetconfAdvForm={setNetconfAdvForm} />
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
        <Button colorScheme="blue" onClick={mountNetconfDevice}>
          Mount
        </Button>
      </Stack>
    </>
  );
};

export default NetconfTab;
