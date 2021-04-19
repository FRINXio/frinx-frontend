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
  const [cliMountForm, setCliMountForm] = useState(INITIAL_CLI_MOUNT_FORM_VALUES);
  const [cliMountAdvForm, setCliMountAdvForm] = useState(INITIAL_CLI_ADVANCED_FORM_VALUES);
  const [nodeId, setNodeId] = useState(null);
  const [outputConsole, setOutputConsole] = useState({ output: [], isRunning: false });
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <>
      {mountCliBasicTemplate.map(({ displayValue, description, size, select, options, key }) => {
        return (
          <GridItem key={displayValue} colSpan={size}>
            {select ? (
              <FormControl>
                <FormLabel>{displayValue}</FormLabel>
                <Select
                  placeholder={cliMountForm[key]}
                  value={cliMountForm[key]}
                  onChange={(e) => setCliMountForm((prev) => ({ ...prev, [key]: e.target.value }))}
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
                    onChange={(e) => setCliMountForm((prev) => ({ ...prev, [key]: e.target.value }))}
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
      })}
    </>
  );
};

export default CliTab;
