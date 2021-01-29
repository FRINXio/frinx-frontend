// @flow

import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import axios from 'axios';
import { useEffect } from 'react';
import AllocationStrategies from './configure/AllocationStrategies';
import theme from './components/layout/theme';
import ResourceTypes from './resourceTypes/ResourceTypes';
import Pools from './pools/Pools';
import ResourceList from './pools/resources/ResourcesList';
import PoolDetailPage from './pools/PoolsPage/Details/PoolDetailPage';
import { useStateValue } from './utils/StateProvider';

const styles = () => ({
  root: {
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '24px',
  },
});
const ResourceManagerTabs = () => {
  const [value, setValue] = React.useState(0);

  const [{ isAdmin }, dispatch] = useStateValue();

  const isAdminFunc = () => {
    const conductorRbacApiUrlPrefix = '/workflow/proxy/rbac/editableworkflows';

    axios.get(conductorRbacApiUrlPrefix, {}).then((val) => {
      console.log(val);
      dispatch({
        type: 'changeIsAdmin',
        newIsAdmin: val,
      });
    });
  };

  useEffect(() => {
    isAdminFunc();
  }, []);

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider />
    </ThemeProvider>
  );
};

export default withStyles(styles)(ResourceManagerTabs);
