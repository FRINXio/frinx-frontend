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
import callbackUtils from '../../../../utils/callback.utils';
import { useInterval } from '../../../common/use-interval';

const INITIAL_CLI_MOUNT_FORM_VALUES = {
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
  dryRun: false,
  lazyConnection: false,
  'node-extension:reconcile': true,
  'cli-topology:journal-size': 150,
  'cli-topology:dry-run-journal-size': 150,
  'cli-topology:command-timeout': 60,
  'cli-topology:connection-lazy-timeout': 60,
  'cli-topology:connection-establish-timeout': 60,
  'cli-topology:keepalive-delay': 45,
  'cli-topology:keepalive-timeout': 45,
};

const CliTab = ({ supportedDevices, templateNode }) => {
  const [cliMountForm, setCliMountForm] = useState({
    'network-topology:node-id': 'xr5',
    'cli-topology:host': '192.168.1.215',
    'cli-topology:port': '22',
    'cli-topology:device-type': 'ios xr',
    'cli-topology:device-version': '*',
    'cli-topology:transport-type': 'ssh',
    'cli-topology:username': 'cisco',
    'cli-topology:password': 'cisco',
  });
  const [cliMountAdvForm, setCliMountAdvForm] = useState({
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
  const [showPassword, setShowPassword] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
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

    setCliMountForm({
      ...cliMountForm,
      'network-topology:node-id': state['node-id'],
      'cli-topology:device-version': state['cli-topology:device-version'].replace('x', '*'),
      ...state,
    });

    setCliMountAdvForm({
      ...cliMountAdvForm,
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
    if (!cliMountForm['cli-topology:device-type']) {
      return [];
    }
    return supportedDevices[deviceType]?.map((d) => d['device-version']);
  };

  const mountCliDevice = async (event) => {
    event.preventDefault();
    const dryRunOn = {
      'cli-topology:dry-run-journal-size': parseInt(cliMountAdvForm['cli-topology:dry-run-journal-size']),
    };

    const privilegedModeOn = {
      'cli-topology:secret': cliMountAdvForm['cli-topology:secret'],
    };

    const lazyConnectionOn = {
      'cli-topology:command-timeout': parseInt(cliMountAdvForm['cli-topology:command-timeout']),
      'cli-topology:connection-lazy-timeout': parseInt(cliMountAdvForm['cli-topology:connection-lazy-timeout']),
      'cli-topology:connection-establish-timeout': parseInt(
        cliMountAdvForm['cli-topology:connection-establish-timeout'],
      ),
    };

    const lazyConnectionOff = {
      'cli-topology:keepalive-delay': parseInt(cliMountAdvForm['cli-topology:keepalive-delay']),
      'cli-topology:keepalive-timeout': parseInt(cliMountAdvForm['cli-topology:keepalive-timeout']),
    };

    const payload = {
      'network-topology:node': [
        {
          ...cliMountForm,
          'node-extension:reconcile': cliMountAdvForm['node-extension:reconcile'],
          'cli-topology:journal-size': cliMountAdvForm['cli-topology:journal-size'],
          'cli-topology:dry-run-journal-size': parseInt(cliMountAdvForm['cli-topology:dry-run-journal-size']),
          ...(cliMountAdvForm.dryRun ? dryRunOn : null),
          ...(cliMountAdvForm.lazyConnection ? lazyConnectionOn : lazyConnectionOff),
          ...(cliMountAdvForm.privilegedMode ? privilegedModeOn : null),
        },
      ],
    };

    const nodeId = cliMountForm['network-topology:node-id'];

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

    setOutputConsole((prev) => ({
      ...prev,
      output: [...prev.output, connectionStatusString, connectedMessageString],
    }));
  };

  const mountCliBasicTemplate = [
    {
      displayValue: 'Node ID',
      description: 'Unique identifier of device across all systems',
      size: 6,
      key: 'network-topology:node-id',
    },
    {
      displayValue: 'Device type',
      description: 'Type of device or OS',
      size: 2,
      select: true,
      options: Object.keys(supportedDevices),
      key: 'cli-topology:device-type',
    },
    {
      displayValue: 'Device version',
      description: 'Version of device or OS',
      size: 2,
      select: true,
      options: getDeviceTypeVersions(cliMountForm['cli-topology:device-type']),
      key: 'cli-topology:device-version',
    },
    {
      displayValue: 'Transport type',
      description: 'CLI transport protocol',
      size: 2,
      select: true,
      options: ['ssh', 'telnet'],
      key: 'cli-topology:transport-type',
    },
    {
      displayValue: 'Host',
      description: 'IP or hostname of the management endpoint on a device',
      size: 4,
      key: 'cli-topology:host',
    },
    {
      displayValue: 'Port',
      description: 'TCP port',
      size: 2,
      key: 'cli-topology:port',
    },
    {
      displayValue: 'Username',
      description: 'Username credential',
      size: 3,
      key: 'cli-topology:username',
    },
    {
      displayValue: 'Password',
      description: 'Password credential',
      size: 3,
      key: 'cli-topology:password',
    },
  ];

  const mountCliAdvTemplate = [
    {
      displayValue: 'Reconcile',
      toggle: true,
      key: 'node-extension:reconcile',
      size: 4,
    },
    {
      displayValue: 'Dry run',
      toggle: true,
      key: 'dryRun',
      size: 4,
      on: [
        {
          displayValue: 'Dry run journal size',
          description:
            'Creates dry-run mountpoint and defines number of commands in command history for dry-run mountpoint',
          key: 'cli-topology:dry-run-journal-size',
        },
      ],
      off: [],
    },
    {
      displayValue: 'Privileged mode',
      toggle: true,
      key: 'privilegedMode',
      size: 4,
      on: [
        {
          displayValue: 'Secret',
          description: 'Used for entering privileged mode on cisco devices',
          key: 'cli-topology:secret',
        },
      ],
      off: [],
    },
    {
      displayValue: 'Lazy connection',
      toggle: true,
      key: 'lazyConnection',
      size: 4,
      on: [
        {
          displayValue: 'Command timeout',
          description: 'Maximal time (in seconds) for command execution',
          key: 'cli-topology:command-timeout',
        },
        {
          displayValue: 'Connection lazy timeout',
          description: 'Maximal time (in seconds) for connection to keep alive',
          key: 'cli-topology:connection-lazy-timeout',
        },
        {
          displayValue: 'Connection establish timeout',
          description: 'Maximal time (in seconds) for connection establishment',
          key: 'cli-topology:connection-establish-timeout',
        },
      ],
      off: [
        {
          displayValue: 'Keepalive delay',
          description: 'Delay (in seconds) between sending of keepalive messages over CLI session',
          key: 'cli-topology:keepalive-delay',
        },
        {
          displayValue: 'Keepalive timeout',
          description: 'Close connection if keepalive response is not received within specified seconds',
          key: 'cli-topology:keepalive-timeout',
        },
      ],
    },
    {
      displayValue: 'Journal size',
      description: 'Number of commands in command history',
      key: 'cli-topology:journal-size',
      size: 4,
    },
  ];

  const renderBasicOptions = () =>
    mountCliBasicTemplate.map(({ displayValue, description, size, select, options, key }) => {
      return (
        <GridItem key={displayValue} colSpan={size}>
          {select ? (
            <FormControl>
              <FormLabel>{displayValue}</FormLabel>
              <Select
                placeholder={cliMountForm[key]}
                value={cliMountForm[key]}
                onChange={(e) => {
                  e.persist();
                  setCliMountForm((prev) => ({ ...prev, [key]: e.target.value }));
                }}
              >
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
                  value={cliMountForm[key]}
                  type={displayValue === 'Password' && !showPassword ? 'password' : 'text'}
                  onChange={(e) => {
                    e.persist();
                    setCliMountForm((prev) => ({ ...prev, [key]: e.target.value }));
                  }}
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
    mountCliAdvTemplate.map(({ displayValue, toggle, key, size }) => {
      if (toggle) {
        return (
          <GridItem key={displayValue} colSpan={size}>
            <FormControl display="flex" justifyContent="space-between" alignItems="center">
              <FormLabel mb="0">{displayValue}</FormLabel>
              <Switch
                isChecked={cliMountAdvForm[key]}
                onChange={(e) => {
                  e.persist();
                  setCliMountAdvForm({
                    ...cliMountAdvForm,
                    [key]: e.target.checked,
                  });
                }}
              />
            </FormControl>
          </GridItem>
        );
      }
    });

  const renderAdvOptions = () =>
    mountCliAdvTemplate.map(({ displayValue, description, size, key, toggle, on, off }) => {
      // if field is type toggle, render its on/off subfields
      if (toggle) {
        return (cliMountAdvForm[key] ? on : off)?.map(({ displayValue, key, description }) => (
          <GridItem key={displayValue} colSpan={size}>
            <FormControl>
              <FormLabel>{displayValue}</FormLabel>
              <InputGroup>
                <Input
                  value={cliMountAdvForm[key]}
                  type={displayValue === 'Secret' && !showSecret ? 'password' : 'text'}
                  onChange={(e) => {
                    e.persist();
                    setCliMountAdvForm({
                      ...cliMountAdvForm,
                      [key]: e.target.value,
                    });
                  }}
                  placeholder={displayValue}
                />
                {displayValue === 'Secret' && (
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={() => setShowSecret(!showSecret)}>
                      {showSecret ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                )}
              </InputGroup>
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
              value={cliMountAdvForm[key]}
              onChange={(e) => {
                e.persist();
                setCliMountAdvForm({
                  ...cliMountAdvForm,
                  [key]: e.target.value,
                });
              }}
              placeholder={displayValue}
            />
            <FormHelperText>{description}</FormHelperText>
          </FormControl>
        </GridItem>
      );
    });

  return (
    <form onSubmit={mountCliDevice}>
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
        <Button colorScheme="blue" type="submit">
          Mount
        </Button>
      </Stack>
    </form>
  );
};

export default CliTab;
