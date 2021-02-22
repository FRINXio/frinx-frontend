// @flow
import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import _ from 'lodash';
import CliTab from './CliTab';
import NetconfTab from './NetconfTab';
import callbackUtils from '../../../../utils/callbackUtils';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    height: '50px',
    width: '50px',
  },
  paper: {
    padding: '30px',
  },
  basicTab: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px',
    width: '500px',
  },
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} {...other}>
      {value === index && <div style={{ marginTop: '40px' }}>{children}</div>}
    </div>
  );
};

type Props = {
  templateNode: any,
  onBackBtnClick: () => void,
};

const MountDevice = (props: Props) => {
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const [supportedDevices, setSupportedDevices] = useState([]);
  const [templateNode, setTemplateNode] = useState();

  useEffect(() => {
    // if node was selected as template
    const { templateNode } = props;
    setTemplateNode(templateNode);
    setTab(templateNode?.topologyId === 'topology-netconf' ? 1 : 0);
    getSupportedDevices();
  }, []);

  const getSupportedDevices = () => {
    const getCliDeviceTranslations = callbackUtils.getCliDeviceTranslationsCallback();

    getCliDeviceTranslations().then((res) => {
      console.log(res);
      try {
        const supportedDevices = res['available-cli-device-translations']['available-cli-device-translation'];
        const grouped = _.groupBy(supportedDevices, function (device) {
          return device['device-type'];
        });
        setSupportedDevices(grouped);
      } catch (e) {
        console.log(e);
      }
    });
  };

  return (
    <Container>
      <div className={classes.wrapper}>
        <Typography variant="h2" gutterBottom>
          <IconButton onClick={props.onBackBtnClick}>
            <NavigateBeforeIcon className={classes.icon} />
          </IconButton>
          Mount Device
        </Typography>
      </div>
      <Paper elevation={2} className={classes.paper}>
        <Tabs value={tab} indicatorColor="primary" textColor="primary" onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="CLI" id={`full-width-tab-${0}`} />
          <Tab label="Netconf" id={`full-width-tab-${1}`} />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <CliTab supportedDevices={supportedDevices} templateNode={templateNode} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <NetconfTab templateNode={templateNode} />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default MountDevice;
