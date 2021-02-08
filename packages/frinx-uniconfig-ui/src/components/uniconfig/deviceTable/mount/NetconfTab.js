import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../common/GlobalContext';
import { useInterval } from '../../../common/useInterval';
import { HttpClient as http } from '../../../common/HttpClient';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Console from './Console';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const MOUNT_NETCONF_DEVICE_URL = (nodeId) =>
  '/rests/data/network-topology:network-topology/topology=topology-netconf/node=' + nodeId;
const GET_NETCONF_NODE_NONCONFIG_URL = (nodeId) =>
  '/rests/data/network-topology:network-topology/topology=topology-netconf/node=' + nodeId + '?content=nonconfig';
const GET_NETCONF_NODE_CONFIG_URL = (nodeId) =>
  '/rests/data/network-topology:network-topology/topology=topology-netconf/node=' + nodeId + '?content=config';

const NetconfTab = ({ templateNode }) => {
  const global = useContext(GlobalContext);
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
  const [alert, setAlert] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  useEffect(() => {
    templateNode?.topologyId === 'topology-netconf' && setNodeTemplate(templateNode);
  }, [templateNode]);

  const setNodeTemplate = async (templateNode) => {
    if (!templateNode) {
      return null;
    }
    const { nodeId } = templateNode;
    const result = await http.get(global.backendApiUrlPrefix + GET_NETCONF_NODE_CONFIG_URL(nodeId), global.authToken);

    if (!result) {
      const { statusCode, statusText } = result;
      return handleAlertOpen(statusCode, statusText);
    }

    const node = result?.node[0];

    setNetconfMountForm({
      ...netconfMountForm,
      ...node,
    });

    setNetconfMountAdvForm({
      ...netconfMountAdvForm,
      dryRun: !!node['netconf-node-topology:dry-run-journal-size'],
      ...node,
    });
  };

  // interval to check node connection status when console is open
  useInterval(
    () => {
      checkConnectionStatus(nodeId);
    },
    outputConsole.isRunning ? 2000 : null,
  );

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  const handleAlertOpen = (statusCode, statusText) => {
    statusCode = statusCode.toString();
    if (statusCode.startsWith('2')) {
      setAlert({ ...alert, open: true, severity: 'success', message: `${statusCode} ${statusText}` });
    } else if (statusCode.startsWith('4')) {
      setAlert({ ...alert, open: true, severity: 'warning', message: `${statusCode} ${statusText}` });
    } else if (statusCode.startsWith('5')) {
      setAlert({ ...alert, open: true, severity: 'error', message: `${statusCode} ${statusText}` });
    } else {
      setAlert({ ...alert, open: true, severity: 'info', message: `${statusCode} ${statusText}` });
    }
  };

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
      'network-topology:node': {
        ...netconfMountForm,
        'node-extension:reconcile': netconfMountAdvForm['node-extension:reconcile'],
        'netconf-node-topology:tcp-only': netconfMountAdvForm['netconf-node-topology:tcp-only'],
        'netconf-node-topology:keepalive-delay': parseInt(netconfMountAdvForm['netconf-node-topology:keepalive-delay']),
        ...(netconfMountAdvForm.dryRun ? dryRunOn : null),
        ...(netconfMountAdvForm['netconf-node-topology:override'] ? overrideCapabilitiesOn : null),
        ...(netconfMountAdvForm['uniconfig-config:uniconfig-native-enabled'] ? uniconfigNativeOn : null),
      },
    };

    const nodeId = netconfMountForm['node-id'];

    const result = await http.put(
      global.backendApiUrlPrefix + MOUNT_NETCONF_DEVICE_URL(nodeId),
      payload,
      global.authToken,
    );
    const { statusCode, statusText } = result;

    setNodeId(nodeId);
    setOutputConsole({ ...outputConsole, isRunning: true });
    handleAlertOpen(statusCode, statusText);
  };

  const checkConnectionStatus = async (nodeId) => {
    const result = await http.get(
      global.backendApiUrlPrefix + GET_NETCONF_NODE_NONCONFIG_URL(nodeId),
      global.authToken,
    );
    const connectionStatus = result?.node[0]?.['netconf-node-topology:connection-status'];
    const connectedMessage = result?.node[0]?.['netconf-node-topology:connected-message'];
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
          key: 'netconf-node-topology:dry-run-journal-size',
        },
      ],
      off: [],
    },
    {
      displayValue: 'Override capabilities',
      toggle: true,
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
      key: 'netconf-node-topology:keepalive-delay',
      size: 4,
    },
  ];

  const handleToggle = (key, e) => {
    setNetconfMountAdvForm({
      ...netconfMountAdvForm,
      [key]: e.target.checked,
    });
  };

  const renderBasicOptions = () => {
    return mountNetconfBasicTemplate.map(({ displayValue, description, size, select, options, key }) => {
      return (
        <Grid key={displayValue} item xs={size}>
          <TextField
            id={`inputField-${displayValue}`}
            select={select}
            label={displayValue}
            value={netconfMountForm[key]}
            helperText={description}
            onChange={(e) => setNetconfMountForm({ ...netconfMountForm, [key]: e.target.value })}
            variant="outlined"
            type={displayValue === 'Password' && !showPassword ? 'password' : 'text'}
            fullWidth
            InputProps={{
              endAdornment: displayValue === 'Password' && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          >
            {select &&
              options?.map((option, i) => (
                <MenuItem key={`option-${i}-${displayValue}`} value={option}>
                  {option}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
      );
    });
  };

  const renderToggles = () => {
    return mountNetconfAdvTemplate.map(({ displayValue, toggle, key, size }) => {
      if (toggle) {
        return (
          <Grid key={displayValue} item xs={size}>
            <FormControlLabel
              key={key}
              control={<Switch checked={netconfMountAdvForm[key]} onChange={(e) => handleToggle(key, e)} />}
              label={displayValue}
            />
          </Grid>
        );
      }
    });
  };

  const renderAdvOptions = () => {
    // if field is type toggle, render its on/off subfields
    return mountNetconfAdvTemplate.map(({ displayValue, description, size, key, toggle, on, off }) => {
      if (toggle) {
        return (netconfMountAdvForm[key] ? on : off)?.map(({ displayValue, key }) => (
          <Grid key={displayValue} item xs={size}>
            <TextField
              id={`inputField-${key}`}
              label={displayValue}
              value={netconfMountAdvForm[key]}
              helperText={description}
              onChange={(e) =>
                setNetconfMountAdvForm({
                  ...netconfMountAdvForm,
                  [key]: e.target.value,
                })
              }
              variant="outlined"
              fullWidth
            />
          </Grid>
        ));
      }
      return (
        <Grid key={displayValue} item xs={size}>
          <TextField
            id={`inputField-${key}`}
            label={displayValue}
            value={netconfMountAdvForm[key]}
            helperText={description}
            onChange={(e) =>
              setNetconfMountAdvForm({
                ...netconfMountAdvForm,
                [key]: e.target.value,
              })
            }
            variant="outlined"
            fullWidth
          />
        </Grid>
      );
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          {renderBasicOptions()}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Accordion style={{ boxShadow: 'none' }}>
          <AccordionSummary style={{ padding: 0 }} expandIcon={<ExpandMoreIcon />}>
            <Typography color="textSecondary" variant="button">
              Advanced settings
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ padding: 0 }}>
            <Grid container spacing={3}>
              {renderToggles()}
              {renderAdvOptions()}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item xs={12}>
        <Accordion style={{ boxShadow: 'none' }}>
          <AccordionSummary style={{ padding: 0 }} expandIcon={<ExpandMoreIcon />}>
            <Typography color="textSecondary" variant="button">
              Output
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ padding: 0 }}>
            <Console outputConsole={outputConsole} />
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid item xs={12}>
        <Button
          style={{ float: 'right' }}
          size="large"
          variant="contained"
          color="primary"
          onClick={() => mountNetconfDevice()}
        >
          Mount
        </Button>
        <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleAlertClose}>
          <MuiAlert onClose={handleAlertClose} severity={alert.severity} elevation={6} variant="filled">
            {alert.message}
          </MuiAlert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};

export default NetconfTab;
