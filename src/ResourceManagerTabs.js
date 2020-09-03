// @flow
import type {WithStyles} from '@material-ui/core';

import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import classNames from 'classnames';
import {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ResourceManagerTab from "./components/layout/ResourceManagerTab";
import PoolCard from "./pools/PoolCard";
import AllocationStrategies from "./configure/AllocationStrategies";
import {ThemeProvider} from "@material-ui/styles";
import theme from './components/layout/theme'
import ResourceTypes from "./resourceTypes/ResourceTypes";


const styles = theme => ({
    root: {

        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '24px',
    },
});

type Props = {
    children: React.ChildrenArray<null | React.Element<*>>,
    className?: string,
} & WithStyles<typeof styles>;

const ResourceManagerTabs = (props: Props) => {
    const {className, classes} = props;

    const [value, setValue] = React.useState(2);

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
            <AppBar position="static" elevation={0}>
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="Pools" {...a11yProps(0)} />
                    <Tab label="Strategies" {...a11yProps(1)} />
                    <Tab label="Resource Types" {...a11yProps(2)} />
                    <Tab label="" {...a11yProps(3)} />
                </Tabs>
            </AppBar>
            <ResourceManagerTab value={value} index={0}>
                <PoolCard />
            </ResourceManagerTab>
            <ResourceManagerTab value={value} index={1}>
                <AllocationStrategies />
            </ResourceManagerTab>
            <ResourceManagerTab value={value} index={2}>
                <ResourceTypes />
            </ResourceManagerTab>
            <ResourceManagerTab value={value} index={3}>
                <PoolCard />
            </ResourceManagerTab>
        </ThemeProvider>
    );
};

export default withStyles(styles)(ResourceManagerTabs);
