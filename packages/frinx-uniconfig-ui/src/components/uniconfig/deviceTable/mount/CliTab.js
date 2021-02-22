import React, { useEffect, useState } from 'react';
import { useInterval } from '../../../common/useInterval';
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
import callbackUtils from '../../../../utils/callbackUtils';

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
    'node-extension:reconcile': true,
    'cli-topology:journal-size': 150,
    'cli-topology:dry-run-journal-size': 150,
    'cli-topology:command-timeout': 60,
    'cli-topology:connection-lazy-timeout': 60,
    'cli-topology:connection-establish-timeout': 60,
    'cli-topology:keepalive-delay': 45,
    'cli-topology:keepalive-timeout': 45,
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
      // TODO error messages, alerts ...
      // return handleAlertOpen(statusCode, statusText);
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

  const getDeviceTypeVersions = (deviceType) => {
    if (!cliMountForm['cli-topology:device-type']) {
      return [];
    }
    return supportedDevices[deviceType]?.map((d) => d['device-version']);
  };

  const mountCliDevice = async () => {
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
    handleAlertOpen(status, statusText);
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
          key: 'cli-topology:dry-run-journal-size',
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
          key: 'cli-topology:command-timeout',
        },
        {
          displayValue: 'Connection lazy timeout',
          key: 'cli-topology:connection-lazy-timeout',
        },
        {
          displayValue: 'Connection establish timeout',
          key: 'cli-topology:connection-establish-timeout',
        },
      ],
      off: [
        {
          displayValue: 'Keepalive delay',
          key: 'cli-topology:keepalive-delay',
        },
        {
          displayValue: 'Keepalive timeout',
          key: 'cli-topology:keepalive-timeout',
        },
      ],
    },
    {
      displayValue: 'Journal size',
      key: 'cli-topology:journal-size',
      size: 4,
    },
  ];

  const handleToggle = (key, e) => {
    setCliMountAdvForm({
      ...cliMountAdvForm,
      [key]: e.target.checked,
    });
  };

  const renderBasicOptions = () => {
    return mountCliBasicTemplate.map(({ displayValue, description, size, select, options, key }) => {
      return (
        <Grid key={displayValue} item xs={size}>
          <TextField
            id={`inputField-${displayValue}`}
            select={select}
            label={displayValue}
            value={cliMountForm[key]}
            helperText={description}
            onChange={(e) => setCliMountForm({ ...cliMountForm, [key]: e.target.value })}
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
    return mountCliAdvTemplate.map(({ displayValue, toggle, key, size }) => {
      if (toggle) {
        return (
          <Grid key={displayValue} item xs={size}>
            <FormControlLabel
              key={key}
              control={<Switch checked={cliMountAdvForm[key]} onChange={(e) => handleToggle(key, e)} />}
              label={displayValue}
            />
          </Grid>
        );
      }
    });
  };

  const renderAdvOptions = () => {
    // if field is type toggle, render its on/off subfields
    return mountCliAdvTemplate.map(({ displayValue, description, size, key, toggle, on, off }) => {
      if (toggle) {
        return (cliMountAdvForm[key] ? on : off)?.map(({ displayValue, key }) => (
          <Grid key={displayValue} item xs={size}>
            <TextField
              id={`inputField-${key}`}
              label={displayValue}
              value={cliMountAdvForm[key]}
              helperText={description}
              onChange={(e) =>
                setCliMountAdvForm({
                  ...cliMountAdvForm,
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
            value={cliMountAdvForm[key]}
            helperText={description}
            onChange={(e) =>
              setCliMountAdvForm({
                ...cliMountAdvForm,
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
          <AccordionDetails key="advOptions" style={{ padding: 0 }}>
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
          onClick={() => mountCliDevice()}
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

export default CliTab;
