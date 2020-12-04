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
import DeleteResourceTypeMutation from '../mutations/DeleteResourceTypeMutation';

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
}));

const ResourceTypesTable = ({
  // eslint-disable-next-line react/prop-types
  resourceTypesData,
  updateDataVarFunc,
  enqueueSnackbar,
}) => {
  const classes = useStyles();
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeResourceType, setActiveResourceType] = useState({});

  const handleActionsClick = (event) => {
    setActionsAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
  };

  const deleteResourceType = (resourceTypeId) => {
    const variables = {
      input: {
        resourceTypeId,
      },
    };
    DeleteResourceTypeMutation(variables, (response, err) => {
      if (err) {
        console.log(err);
        enqueueSnackbar(err.message, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Resource type deleted', {
          variant: 'warning',
        });
        updateDataVarFunc();
      }
    });
  };

  const deleteDialogRender = () => (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle id="alert-dialog-slide-title">Are you sure you want to delete this resource type?</DialogTitle>
      <DialogActions>
        <Button
          onClick={() => {
            setDialogOpen(false);
          }}
        >
          Disagree
        </Button>
        <Button
          onClick={() => {
            setActionsAnchorEl(null);
            setDialogOpen(false);
            deleteResourceType(activeResourceType.id);
          }}
          color="primary"
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
  const handleDeleteClicked = (row) => {
    setActionsAnchorEl(null);
    setActiveResourceType(row);
    setDialogOpen(true);
  };

  return (
    <TableContainer component={Paper} className={classes.container}>
      {deleteDialogRender()}
      <Table ria-label="pool table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Actions</StyledTableCell>
            <StyledTableCell align="left">Resource Type Name</StyledTableCell>
            <StyledTableCell align="left">ID</StyledTableCell>
            <StyledTableCell align="left">Properties</StyledTableCell>
            <StyledTableCell align="right">Pools</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* eslint-disable-next-line react/prop-types */}
          {resourceTypesData.map((row, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <TableRow key={i}>
              <TableCell padding="checkbox" align="center">
                <IconButton aria-controls="actions-menu" aria-haspopup="true" onClick={handleActionsClick}>
                  <MoreVertIcon />
                </IconButton>
                <StyledMenu
                  id={`actions-menu${i}`}
                  anchorEl={actionsAnchorEl}
                  open={Boolean(actionsAnchorEl)}
                  onClose={handleActionsClose}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Details" />
                  </MenuItem>
                  <MenuItem onClick={() => handleDeleteClicked(row)}>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                  </MenuItem>
                </StyledMenu>
              </TableCell>
              <TableCell align="left">{row.Name}</TableCell>
              <TableCell align="left">{row.id}</TableCell>
              <TableCell align="left">
                {row.PropertyTypes.map((pt, j) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={`propertytypes${j}`}>
                    <b>{pt.Name}</b> :{pt.Type}
                  </div>
                ))}
              </TableCell>
              <TableCell align="right">
                {row.Pools
                  ? row.Pools.slice(0, 3).map((pool, j) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <span key={`poolNameId${j}`}> {pool.Name} </span>
                    ))
                  : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default withSnackbar(ResourceTypesTable);
