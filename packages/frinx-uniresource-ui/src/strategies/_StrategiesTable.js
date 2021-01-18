import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withSnackbar } from 'notistack';
import TestAllocationStrategyMutation from '../mutations/TestAllocationStrategyMutation';
import DeleteStrategyMutation from '../mutations/DeleteStrategyMutation';
import TestStrategy from './TestStrategy';
import StrategiesTableRow from './StrategiesTableRow';

/* eslint-disable react/prop-types */

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.common.white,
  },
}))(TableCell);

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
  iconButton: {},
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
          {strategiesData.map((row) => (
            <StrategiesTableRow
              key={row.id}
              row={row}
              onActionClick={handleActionsClick}
              actionsAnchorEl={actionsAnchorEl}
              onMenuClose={handleActionsClose}
              onTestClick={handleTestClicked}
              onDeleteClick={handleDeleteClicked}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default withSnackbar(StrategiesTable);
