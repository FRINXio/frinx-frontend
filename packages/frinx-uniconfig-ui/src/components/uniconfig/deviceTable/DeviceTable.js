import React, {useContext, useState} from "react";
import {withStyles} from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Checkbox from "@material-ui/core/Checkbox";
import TablePagination from "@material-ui/core/TablePagination";
import Grow from "@material-ui/core/Grow";
import SettingsIcon from '@material-ui/icons/Settings';
import DnsIcon from '@material-ui/icons/Dns';
import IconButton from "@material-ui/core/IconButton";
import ConnectionStatusBadge from "../../common/ConnectionStatusBadge";
import {useRouteMatch, useHistory} from 'react-router-dom';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white
    }
}))(TableCell);

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: "20px",
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    port: {
        color: "grey",
    },
    actionButton: {
        marginLeft: theme.spacing(1),
    }
}));

const DeviceTable = (props) => {
    const classes = useStyles();
    const {path} = useRouteMatch();
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const checkNode = (node) => {
        let newChecked = [...props.checked];

        if (Array.isArray(node)) {
            newChecked = newChecked.length > 0 ? [] : node
        } else {
            let index = newChecked.indexOf(node);
            index === -1 && newChecked.push(node) || newChecked.splice(index, 1);
        }
        props.setChecked(newChecked)
    };

    return (
        <TableContainer component={Paper} className={classes.container}>
            <Table ria-label="device table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="left" padding="checkbox">
                            <Checkbox
                                checked={props.checked.length > 0}
                                onClick={() => checkNode(props.nodes)}
                                style={{color: "white"}}
                                inputProps={{'aria-label': 'primary checkbox'}}
                            />
                        </StyledTableCell>
                        <StyledTableCell align="left">Node ID</StyledTableCell>
                        <StyledTableCell align="left">Host</StyledTableCell>
                        <StyledTableCell align="left">Status</StyledTableCell>
                        <StyledTableCell align="left">OS/Version</StyledTableCell>
                        <StyledTableCell align="right">Actions</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.nodes
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((node, i) => (
                            <Grow key={i} in={true} style={{transformOrigin: '0 0 0'}} {...{timeout: i * 200}}>
                                <TableRow key={i}>
                                    <TableCell padding="checkbox" align="center">
                                        <Checkbox
                                            checked={props.checked.indexOf(node) !== -1}
                                            onClick={() => checkNode(node)}
                                            inputProps={{'aria-label': 'primary checkbox'}}
                                        />
                                    </TableCell>
                                    <TableCell align="left">{node.nodeId}</TableCell>
                                    <TableCell align="left">{node.host || "resolving..."}<span
                                        className={classes.port}>{node.port ? ":" + node.port : null}</span></TableCell>
                                    <TableCell align="left">
                                        <ConnectionStatusBadge node={node}
                                                               checkConnectionStatus={props.updateNode}/>
                                    </TableCell>
                                    <TableCell align="left">{node.osVersion}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="secondary"
                                                    onClick={() => history.push(path + `/${node.nodeId}?topology=${node.topologyId}`)}
                                                    size="small" className={classes.actionButton}>
                                            <DnsIcon/>
                                        </IconButton>
                                        <IconButton color="primary" size="small"
                                                    onClick={() => history.push(path+ `/edit/${node.nodeId}`)}
                                                    className={classes.actionButton}>
                                            <SettingsIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            </Grow>
                        ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={props.nodes.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </TableContainer>
    )
};

export default DeviceTable;
