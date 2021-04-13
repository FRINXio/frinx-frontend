import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Switch,
  Stack,
  useToast,
  FormHelperText,
} from '@chakra-ui/react';
import Console from './console';
import React, { useEffect, useState } from 'react';
import { useInterval } from '../../../common/use-interval';
import callbackUtils from '../../../../utils/callback.utils';

const NetconfTab = ({ templateNode }) => {
  const [netconfMountForm, setNetconfMountForm] = useState({
    'node-id': 'xr5',
    'netconf-node-topology:host': '192.168.1.213',
    'netconf-node-topology:port': 830,
    'netconf-node-topology:username': 'cisco',
    'netconf-node-topology:password': 'cisco',
  });
  const [netconfMountAdvForm, setNetconfMountAdvForm] = useState({
    dryRun: false,
    'netconf-node-topology:tcp-only': false,
    'netconf-node-topology:keepalive-delay': 0,
    'node-extension:reconcile': false,
    'netconf-node-topology:override': false,
    'netconf-node-topology:dry-run-journal-size': 180,
    'netconf-node-topology:yang-module-capabilities': {
      capability: [],
    },
    'uniconfig-config:uniconfig-native-enabled': false,
    'uniconfig-config:blacklist': {
      'uniconfig-config:path': [
        'openconfig-interfaces:interfaces',
        'ietf-interfaces:interfaces',
        'openconfig-vlan:vlans',
        'openconfig-routing-policy:routing-policy',
      ],
    },
  });
  const [nodeId, setNodeId] = useState();
  const [outputConsole, setOutputConsole] = useState({ output: [], isRunning: false });
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  useEffect(() => {
    templateNode?.topologyId === 'topology-netconf' && setNodeTemplate(templateNode);
  }, [templateNode]);

  const setNodeTemplate = async (templateNode) => {
    if (!templateNode) {
      return null;
    }
    const { nodeId } = templateNode;

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

    setNetconfMountForm({
      ...netconfMountForm,
      ...state,
    });

    setNetconfMountAdvForm({
      ...netconfMountAdvForm,
      dryRun: !!state['netconf-node-topology:dry-run-journal-size'],
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

  const mountNetconfDevice = async () => {
    const dryRunOn = {
      'netconf-node-topology:dry-run-journal-size': parseInt(
        netconfMountAdvForm['netconf-node-topology:dry-run-journal-size'],
      ),
    };

    const overrideCapabilitiesOn = {
      'netconf-node-topology:yang-module-capabilities':
        netconfMountAdvForm['netconf-node-topology:yang-module-capabilities'],
    };

    const uniconfigNativeOn = {
      'uniconfig-config:uniconfig-native-enabled': netconfMountAdvForm['uniconfig-config:uniconfig-native-enabled'],
      'uniconfig-config:blacklist': netconfMountAdvForm['uniconfig-config:blacklist'],
    };

    const payload = {
      'network-topology:node': [
        {
          ...netconfMountForm,
          'node-extension:reconcile': netconfMountAdvForm['node-extension:reconcile'],
          'netconf-node-topology:tcp-only': netconfMountAdvForm['netconf-node-topology:tcp-only'],
          'netconf-node-topology:keepalive-delay': parseInt(
            netconfMountAdvForm['netconf-node-topology:keepalive-delay'],
          ),
          ...(netconfMountAdvForm.dryRun ? dryRunOn : null),
          ...(netconfMountAdvForm['netconf-node-topology:override'] ? overrideCapabilitiesOn : null),
          ...(netconfMountAdvForm['uniconfig-config:uniconfig-native-enabled'] ? uniconfigNativeOn : null),
        },
      ],
    };

    const nodeId = netconfMountForm['node-id'];

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

  const mountNetconfBasicTemplate = [
    {
      displayValue: 'Node ID',
      description: 'Unique identifier of device across all systems',
      size: 6,
      key: 'node-id',
    },
    {
      displayValue: 'Username',
      description: 'Username credential',
      size: 3,
      key: 'netconf-node-topology:username',
    },
    {
      displayValue: 'Password',
      description: 'Password credential',
      size: 3,
      key: 'netconf-node-topology:password',
    },
    {
      displayValue: 'Host',
      description: 'IP or hostname of the management endpoint on a device',
      size: 4,
      key: 'netconf-node-topology:host',
    },
    {
      displayValue: 'Port',
      description: 'TCP port',
      size: 2,
      key: 'netconf-node-topology:port',
    },
  ];

  const mountNetconfAdvTemplate = [
    {
      displayValue: 'Reconcile',
      toggle: true,
      key: 'node-extension:reconcile',
      size: 3,
    },
    {
      displayValue: 'TCP Only',
      toggle: true,
      key: 'netconf-node-topology:tcp-only',
      size: 3,
    },
    {
      displayValue: 'Dry run',
      toggle: true,
      key: 'dryRun',
      size: 3,
      on: [
        {
          displayValue: 'Dry run journal size',
          description:
            'Creates dry-run mountpoint and defines number of commands in command history for dry-run mountpoint',
          key: 'netconf-node-topology:dry-run-journal-size',
        },
      ],
      off: [],
    },
    // TODO: find a way to display/edit capabilities (object)
    {
      displayValue: 'Override capabilities',
      toggle: true,
      isDisabled: true,
      key: 'netconf-node-topology:override',
      size: 3,
      on: [
        {
          displayValue: 'Capabilities',
          key: 'netconf-node-topology:yang-module-capabilities',
        },
      ],
      off: [],
    },
    {
      displayValue: 'Keepalive delay',
      description: 'Delay (in seconds) between sending of keepalive messages over CLI session',
      key: 'netconf-node-topology:keepalive-delay',
      size: 4,
    },
  ];

  const renderBasicOptions = () =>
    mountNetconfBasicTemplate.map(({ displayValue, description, size, select, options, key }) => {
      return (
        <GridItem key={displayValue} colSpan={size}>
          {select ? (
            <FormControl>
              <FormLabel>{displayValue}</FormLabel>
              <Select placeholder={netconfMountForm[key]}>
                {options?.map((o) => (
                  <option key={`option-${o}`} value={o}>
                    {o}
                  </option>
                ))}
              </Select>
              <FormHelperText>{description}</FormHelperText>
            </FormControl>
          ) : (
            <FormControl>
              <FormLabel>{displayValue}</FormLabel>
              <InputGroup>
                <Input
                  value={netconfMountForm[key]}
                  type={displayValue === 'Password' && !showPassword ? 'password' : 'text'}
                  onChange={(e) => setNetconfMountForm({ ...netconfMountForm, [key]: e.target.value })}
                  placeholder={displayValue}
                />
                {displayValue === 'Password' && (
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                )}
              </InputGroup>
              <FormHelperText>{description}</FormHelperText>
            </FormControl>
          )}
        </GridItem>
      );
    });

  const renderToggles = () =>
    mountNetconfAdvTemplate.map(({ displayValue, toggle, isDisabled, key, size }) => {
      if (toggle) {
        return (
          <GridItem key={displayValue} colSpan={size}>
            <FormControl display="flex" justifyContent="space-between" alignItems="center">
              <FormLabel mb="0">{displayValue}</FormLabel>
              <Switch
                isChecked={netconfMountAdvForm[key]}
                isDisabled={isDisabled}
                onChange={(e) =>
                  setNetconfMountAdvForm({
                    ...netconfMountAdvForm,
                    [key]: e.target.checked,
                  })
                }
              />
            </FormControl>
          </GridItem>
        );
      }
    });

  const renderAdvOptions = () =>
    // if field is type toggle, render its on/off subfields
    mountNetconfAdvTemplate.map(({ displayValue, description, size, key, toggle, on, off }) => {
      if (toggle) {
        return (netconfMountAdvForm[key] ? on : off)?.map(({ displayValue, key, description }) => (
          <GridItem key={displayValue} colSpan={size}>
            <FormControl>
              <FormLabel>{displayValue}</FormLabel>
              <Input
                value={netconfMountAdvForm[key]}
                onChange={(e) => setNetconfMountAdvForm({ ...netconfMountAdvForm, [key]: e.target.value })}
                placeholder={displayValue}
              />
              <FormHelperText>{description}</FormHelperText>
            </FormControl>
          </GridItem>
        ));
      }
      return (
        <GridItem key={displayValue} colSpan={size}>
          <FormControl>
            <FormLabel>{displayValue}</FormLabel>
            <Input
              value={netconfMountForm[key]}
              onChange={(e) => setNetconfMountAdvForm({ ...netconfMountAdvForm, [key]: e.target.value })}
              placeholder={displayValue}
            />
            <FormHelperText>{description}</FormHelperText>
          </FormControl>
        </GridItem>
      );
    });

  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={4}>
        {renderBasicOptions()}
      </Grid>
      <Accordion allowToggle mt={8} mb={8}>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Advanced Settings
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Grid templateColumns="repeat(12, 1fr)" columnGap={24} rowGap={4} mt={4}>
              {renderToggles()}
            </Grid>
            <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={12}>
              {renderAdvOptions()}
            </Grid>
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
