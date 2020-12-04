import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withSnackbar } from 'notistack';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AceEditor from 'react-ace';
import TestAllocationStrategyMutation from '../mutations/TestAllocationStrategyMutation';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';
import DeleteStrategyMutation from '../mutations/DeleteStrategyMutation';
import TestStrategy from './TestStrategy';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.common.white,
  },
}))(TableCell);

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => <Menu elevation={0} {...props} />);

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '20px',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  whiteCheckBox: {
    color: 'white',
    '&$checked': {
      color: 'white',
    },
    checked: {},
  },
  iconButton: {
    position: 'absolute',
  },
}));

const StrategiesTable = ({
  // eslint-disable-next-line react/prop-types
  strategiesData,
  updateDataVarFunc,
  enqueueSnackbar,
}) => {
  const classes = useStyles();
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [testStrategyDialogOpen, setTestStrategyDialogOpen] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState({});

  const handleActionsClick = (event) => {
    setActionsAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
  };

  const deleteStrategy = (allocationStrategyId) => {
    const variables = {
      input: {
        allocationStrategyId,
      },
    };
    DeleteStrategyMutation(variables, (res, err) => {
      if (err) {
        console.log(err);
        enqueueSnackbar(err.message, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Allocation strategy deleted', {
          variant: 'warning',
        });
        updateDataVarFunc();
      }
    });
  };

  const deleteDialogRender = () => (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle id="alert-dialog-slide-title">Are you sure you want to delete this allocation strategy?</DialogTitle>
      <DialogActions>
        <Button onClick={() => setDialogOpen(false)}>Disagree</Button>
        <Button
          onClick={() => {
            setActionsAnchorEl(null);
            setDialogOpen(false);
            deleteStrategy(activeStrategy.id);
          }}
          color="primary"
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );

  const testAllocationStrategy = () => {
    const input = {
      allocationStrategyId: 5,
      resourcePool: { ResourcePoolName: 'test12345', poolProperties: {} },
      currentResources: [],
      userInput: {},
    };
    TestAllocationStrategyMutation(input, (res, err) => {
      if (err) {
        console.log(err);
        enqueueSnackbar(err.message, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Test successful', {
          variant: 'success',
        });
        updateDataVarFunc();
      }
    });
  };

  const handleDeleteClicked = (row) => {
    setActionsAnchorEl(null);
    setActiveStrategy(row);
    setDialogOpen(true);
  };
  const handleTestClicked = (row) => {
    setActionsAnchorEl(null);
    setActiveStrategy(row);
    setTestStrategyDialogOpen(true);
  };

  const Row = (props) => {
    // eslint-disable-next-line react/prop-types
    const { row, i } = props;
    const {
      // eslint-disable-next-line react/prop-types
      Name,
      Lang,
      id,
      Script,
    } = row;
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <TableRow className={classes.root}>
          <TableCell>
            <StyledMenu
              id={`actions-menu${i}`}
              getContentAnchorEl={null}
              anchorEl={actionsAnchorEl}
              open={Boolean(actionsAnchorEl)}
              onClose={handleActionsClose}
            >
              <MenuItem onClick={() => setOpen(!open)}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Details" />
              </MenuItem>
              <MenuItem onClick={() => handleTestClicked(row)}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Test Strategy" />
              </MenuItem>
              <MenuItem onClick={() => handleDeleteClicked(row)}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Delete" />
              </MenuItem>
            </StyledMenu>
          </TableCell>
          <TableCell align="left">{Name}</TableCell>
          <TableCell align="left">{id}</TableCell>
          <TableCell align="left">{Lang}</TableCell>
          <TableCell align="right">
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <AceEditor
                  className={classes.editor}
                  height="450px"
                  width="100%"
                  mode="javascript"
                  theme="tomorrow"
                  name="UNIQUE_ID_OF_DIV"
                  editorProps={{ $blockScrolling: true }}
                  value={Script}
                  readOnly
                  fontSize={16}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  const testStrategyRender = () => (
    <Dialog open={testStrategyDialogOpen} onClose={() => setTestStrategyDialogOpen(false)}>
      <DialogTitle id="alert-dialog-slide-title">Testing Allocation strategy</DialogTitle>
      <TestStrategy strategy={activeStrategy} />
      <DialogActions>
        <Button onClick={() => setTestStrategyDialogOpen(false)}>Disagree</Button>
        <Button
          onClick={() => {
            setActionsAnchorEl(null);
            setTestStrategyDialogOpen(false);
          }}
          color="primary"
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Button
        onClick={() => {
          testAllocationStrategy();
        }}
      >
        Test
      </Button>
      {deleteDialogRender()}
      {testStrategyRender()}
      <Table ria-label="pool table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Actions</StyledTableCell>
            <StyledTableCell align="left">Strategy Name</StyledTableCell>
            <StyledTableCell align="left">ID</StyledTableCell>
            <StyledTableCell align="left">Lang</StyledTableCell>
            <StyledTableCell align="right">Script</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* eslint-disable-next-line react/prop-types */}
          {strategiesData.map((row, i) => (
            <>
              <IconButton
                className={classes.iconButton}
                aria-controls="actions-menu"
                aria-haspopup="true"
                onClick={handleActionsClick}
              >
                <MoreVertIcon />
              </IconButton>
              {/* eslint-disable-next-line react/prop-types,react/no-array-index-key */}
              <Row key={`asnd${row.name}${i}`} row={row} i={i} />
            </>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default withSnackbar(StrategiesTable);
