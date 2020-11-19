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
import {
  BrowserRouter, Switch, Route, Link,
} from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import AllocationStrategies from './configure/AllocationStrategies';
import theme from './components/layout/theme';
import ResourceTypes from './resourceTypes/ResourceTypes';
import Pools from './pools/Pools';
import ResourceList from './pools/resources/ResourcesList';
import PoolDetailPage from './pools/PoolsPage/Details/PoolDetailPage';

const styles = () => ({
  root: {

    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '24px',
  },
});
const ResourceManagerTabs = () => {
  const [value, setValue] = React.useState(0);

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const RESOURCE_MANAGER_URL = '/resourcemanager/frontend';

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <BrowserRouter>
          <AppBar position="static" elevation={0}>
            <Tabs value={value} onChange={handleChange} aria-label="">
              <Tab label="Pools" {...a11yProps(0)} component={Link} to={`${RESOURCE_MANAGER_URL}/pools`} />
              <Tab label="Strategies" {...a11yProps(1)} component={Link} to={`${RESOURCE_MANAGER_URL}/strategies`} />
              <Tab label="Resource Types" {...a11yProps(2)} component={Link} to={`${RESOURCE_MANAGER_URL}/resourceTypes`} />
              <Tab label="" {...a11yProps(3)} component={Link} to={`${RESOURCE_MANAGER_URL}/resources`} />
            </Tabs>
          </AppBar>

          <Switch>
            <Route path={`${RESOURCE_MANAGER_URL}/pools/:id`}>
              <PoolDetailPage />
            </Route>
            <Route path={`${RESOURCE_MANAGER_URL}/pools`}>
              <Pools />
            </Route>
            <Route path={`${RESOURCE_MANAGER_URL}/strategies`}>
              <AllocationStrategies />
            </Route>
            <Route path={`${RESOURCE_MANAGER_URL}/resourceTypes`}>
              <ResourceTypes />
            </Route>
            <Route path={`${RESOURCE_MANAGER_URL}/resources/:id`}>
              <ResourceList />
            </Route>
            <Route path="/">
              <Pools />
            </Route>
          </Switch>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default withStyles(styles)(ResourceManagerTabs);
