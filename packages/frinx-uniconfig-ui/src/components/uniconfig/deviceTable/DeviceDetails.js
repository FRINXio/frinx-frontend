import React, {useContext, useEffect, useState} from 'react';
import {HttpClient as http} from "../../common/HttpClient";
import {GlobalContext} from "../../common/GlobalContext";
import {createNodeObject} from "./deviceUtils";
import Container from "@material-ui/core/Container";
import DeviceHeader from "./DeviceHeader";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import serverSvg from "./server.svg";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ConnectionStatusBadge from "../../common/ConnectionStatusBadge";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import _ from "lodash";
import Collapse from "@material-ui/core/Collapse";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import * as queryString from "query-string";
import Grow from "@material-ui/core/Grow";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: "30px",
    },
    basicTab: {
        display: "flex",
        justifyContent: "space-between",
        margin: "20px",
        width: "500px"
    },
    capabilitiesList: {
        overflow: 'auto',
        maxHeight: 160
    },
    errorPatternList: {
        overflow: 'auto',
        maxHeight: 310
    },
    img: {
        width: "100%",
        objectFit: "cover",
        objectPosition: "0px 10px"
    }
}));

const TabPanel = (props) => {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <div style={{marginTop: "40px"}}>
                    {children}
                </div>
            )}
        </div>
    );
};

const GET_NODE_URL = (topology, node_id) => "/rests/data/network-topology:network-topology/topology=" + topology + "/node=" + node_id + "?content=nonconfig";

const nodeKeyValueMap = (node) => {
    const basic = [
        {
            displayValue: "node ID",
            value: "nodeId"
        },
        {
            displayValue: "topology",
            value: "topologyId"
        },
        {
            displayValue: "OS/version",
            value: "osVersion"
        },
        {
            displayValue: "host",
            value: "host"
        },
        {
            displayValue: "port",
            value: "port"
        },
        {
            displayValue: "connection status",
            value: "connectionStatus"
        },
        {
            displayValue: "connected message",
            value: "connectedMessage"
        },
    ];

    if (node.topologyId === "cli") {
        return basic;
    } else if (node.topologyId === "topology-netconf") {
        return [
            ...basic,
            {
                displayValue: "fingerprint",
                value: "fingerPrint"
            }
        ]
    }

    return [];
};

const capabilitiesKeyValueMap = (node) => {
    if (node.topologyId === "cli") {
        return [
            {
                displayValue: "Available Capabilities",
                value: node?.availableCapabilities?.["available-capability"] || []
            },
        ]

    } else if (node.topologyId === "topology-netconf") {
        return [
            {
                displayValue: "Available Capabilities",
                value: _.flatMap(node?.availableCapabilities?.["available-capability"] || [], (item) => item?.capability)
            },
            {
                displayValue: "Yang Module Capabilities",
                value: node?.yangModuleCapabilities?.["capability"] || []
            },
            {
                displayValue: "Non Module Capabilities",
                value: node?.nonModuleCapabilities?.["capability"] || []
            },
            {
                displayValue: "Unavailable Capabilities",
                value: node?.unavailableCapabilities?.["unavailable-capability"] || []
            }
        ]
    }

    return [];
};

const errorPatternsKeyValueMap = (node) => {
    if (node.topologyId === "cli") {
        return [
            {
                displayValue: "Error Patterns",
                value: node?.errorPatterns?.["error-pattern"] || []
            },
        ]
    }
    return []
};

const DeviceDetails = (props) => {
    const global = useContext(GlobalContext);
    const [node, setNode] = useState({});
    const [tab, setTab] = useState(0);
    const classes = useStyles();

    useEffect(() => {
        const {nodeId} = props?.match?.params;
        const {topology} = queryString.parse(props?.location?.search);
        fetchDevice(topology, nodeId);
    }, []);

    const fetchDevice = async (topologyId, nodeId) => {
        let result = await http.get(global.backendApiUrlPrefix + GET_NODE_URL(topologyId, nodeId), global.authToken);
        let node = result?.node?.[0];

        if (!node) {
            console.log('node not mounted');
            return;
        }

        let nodeObj = await createNodeObject(topologyId, node);
        setNode(nodeObj);
    };

    const BasicInfo = ({node}) => {
        return nodeKeyValueMap(node).map(({displayValue, value}) => {
            return (
                <div key={displayValue} className={classes.basicTab}>
                    <Box fontSize={16} fontWeight="fontWeightMedium"
                         style={{marginRight: "20px"}}>
                        {displayValue}:
                    </Box>
                    <Box fontSize={16}>
                        {value === "connectionStatus" ?
                            <ConnectionStatusBadge node={node}/> : node[value]}
                    </Box>
                </div>
            )
        })
    };

    const CapabilitiesList = ({node}) => {
        const [openedCapabilities, setOpenedCapabilities] = useState();

        const handleOpenCapabilities = (which) => {
            if (which === openedCapabilities) {
                setOpenedCapabilities(null)
            } else {
                setOpenedCapabilities(which)
            }
        };

        return capabilitiesKeyValueMap(node).map(({displayValue, value}) => (
            <>
                <ListItem button onClick={() => handleOpenCapabilities(displayValue)}>
                    <ListItemText primary={`${displayValue} (${value.length})`}/>
                    {openedCapabilities === displayValue ? <ExpandLess/> : <ExpandMore/>}
                </ListItem>
                <Collapse in={openedCapabilities === displayValue} timeout="auto" unmountOnExit>
                    <List component="div" className={classes.capabilitiesList} disablePadding>
                        {value?.map((item) => (
                            <ListItem key={`item-${displayValue}-${item}`}>
                                <ListItemText>
                                    <Box fontFamily="Monospace" fontSize={12}>
                                        {item}
                                    </Box>
                                </ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </>
        ))
    };

    const ErrorPatternsList = ({node}) => {
        const [openedErrorPatterns, setOpenedErrorPatterns] = useState("Error Patterns");

        const handleOpenErrorPatterns = (which) => {
            if (which === openedErrorPatterns) {
                setOpenedErrorPatterns(null)
            } else {
                setOpenedErrorPatterns(which)
            }
        };

        return errorPatternsKeyValueMap(node).map(({displayValue, value}) => (
            <>
                <ListItem button onClick={() => handleOpenErrorPatterns(displayValue)}>
                    <ListItemText primary={`${displayValue} (${value.length})`}/>
                    {openedErrorPatterns === displayValue ? <ExpandLess/> : <ExpandMore/>}
                </ListItem>
                <Collapse in={openedErrorPatterns === displayValue} timeout="auto" unmountOnExit>
                    <List component="div" className={classes.errorPatternList} disablePadding>
                        {value?.map((item) => (
                            <ListItem key={`item-${displayValue}-${item}`}>
                                <ListItemText>
                                    <Box fontFamily="Monospace" fontSize={12}>
                                        {item}
                                    </Box>
                                </ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </>
        ))
    };

    return (
        <Grow in>
            <Container>
                <DeviceHeader title={node?.nodeId}/>
                <Paper elevation={2} className={classes.paper}>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Tabs
                                value={tab}
                                indicatorColor="primary"
                                textColor="primary"
                                onChange={(e, newValue) => setTab(newValue)}
                            >
                                <Tab label="Basic" id={`full-width-tab-${0}`}/>
                                <Tab label="Capabilities" id={`full-width-tab-${1}`}/>
                                <Tab label="Error Patterns" disabled={node?.topologyId === "topology-netconf"}
                                     id={`full-width-tab-${2}`}/>
                            </Tabs>
                            <TabPanel value={tab} index={0}>
                                <BasicInfo node={node}/>
                            </TabPanel>
                            <TabPanel value={tab} index={1}>
                                <CapabilitiesList node={node}/>
                            </TabPanel>
                            <TabPanel value={tab} index={2}>
                                <ErrorPatternsList node={node}/>
                            </TabPanel>
                        </Grid>
                        <Grid item xs={6}>
                            <div style={{maxWidth: "100%"}}>
                                <img className={classes.img} src={serverSvg} alt="device image"/>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Grow>
    )
};

export default DeviceDetails