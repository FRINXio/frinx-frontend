import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { TableCell, TableContainer, Paper, Table, TableHead, TableRow, TableBody, Button } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import TestAllocationStrategyMutation from '../mutations/TestAllocationStrategyMutation';
import DeleteStrategyMutation from '../mutations/DeleteStrategyMutation';
import StrategiesTableRow from './StrategiesTableRow';
import TestStrategyDialog from './TestStrategyDialog';
import DeleteStrategyDialog from './DeleteStrategyDialog';
import {useStateValue} from "../utils/StateProvider";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTestStrategyDialogOpen, setIsTestStrategyDialogOpen] = useState(false);
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

  const testAllocationStrategy = () => {
    const input = {
      allocationStrategyId: 5,
      resourcePool: { ResourcePoolName: 'test12345', poolProperties: {} },
      currentResources: [],
      userInput: {},
    };
    TestAllocationStrategyMutation(input, (res, err) => {
      if (err) {
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
    setIsDeleteDialogOpen(true);
  };
  const handleTestClicked = (row) => {
    setActionsAnchorEl(null);
    setActiveStrategy(row);
    setIsTestStrategyDialogOpen(true);
  };

  const [{ isAdmin }] = useStateValue();

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Button
        onClick={() => {
          testAllocationStrategy();
        }}
      >
        Test
      </Button>
      <DeleteStrategyDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
        }}
        onAccept={() => {
          setActionsAnchorEl(null);
          setIsDeleteDialogOpen(false);
          deleteStrategy(activeStrategy.id);
        }}
      />
      <TestStrategyDialog
        isOpen={isTestStrategyDialogOpen}
        onClose={() => {
          setIsTestStrategyDialogOpen(false);
        }}
        onAccept={() => {
          setActionsAnchorEl(null);
          setIsTestStrategyDialogOpen(false);
        }}
        activeStrategy={activeStrategy}
      />
      <Table ria-label="pool table">
        <TableHead>
          <TableRow>
            {isAdmin ? <StyledTableCell align="left">Actions</StyledTableCell> : null}
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
