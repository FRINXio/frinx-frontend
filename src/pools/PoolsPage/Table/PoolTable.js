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
import Chip from '@material-ui/core/Chip';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddTagMenu from './AddTagMenu';

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
})((props) => (
  <Menu
    elevation={0}
    {...props}
  />
));

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

const PoolTable = ({
  // eslint-disable-next-line react/prop-types
  filteredPoolArray, QueryTags, assignTagToPool, unassingTagFromPool, deletePool,
}) => {
  const classes = useStyles();
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);

  const handleActionsClick = (event) => {
    setActionsAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
  };

  const getCapacityValue = (capacity) => {
    const { freeCapacity, utilizedCapacity } = capacity;
    return ((freeCapacity / (freeCapacity + utilizedCapacity)) * 100);
  };

  const RESOURCE_MANAGER_URL = '/resourcemanager/frontend';

  const renderTags = (tags, poolId) => {
    const currentTags = tags.map((t) => t.id);
    // eslint-disable-next-line react/prop-types
    const allTagsComplement = QueryTags.filter((t) => !currentTags.includes(t.id));

    return (
      <>
        {tags.map((t) => (
          <Chip
            key={poolId}
            size="small"
            label={t.Tag}
            onDelete={() => unassingTagFromPool(t, poolId)}
            className={classes.chip}
          />
        ))}
        <AddTagMenu poolId={poolId} allTags={allTagsComplement} assignTagToPool={assignTagToPool} />
      </>
    );
  };

  return (
    <>
      <TableContainer component={Paper} className={classes.container}>
        <Table ria-label="pool table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Actions</StyledTableCell>
              <StyledTableCell align="left">Pool Name</StyledTableCell>
              <StyledTableCell align="right">Tags</StyledTableCell>
              <StyledTableCell align="right">Pool Type</StyledTableCell>
              <StyledTableCell align="right">Alloc. Strategy (Lang.)</StyledTableCell>
              <StyledTableCell align="right">Resource Type</StyledTableCell>
              <StyledTableCell align="right">Utilized Capacity</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* eslint-disable-next-line react/prop-types */}
            {filteredPoolArray.map((row, i) => (
            // eslint-disable-next-line react/no-array-index-key
              <TableRow key={i}>
                <TableCell padding="checkbox" align="center">
                  <IconButton
                    aria-controls="actions-menu"
                    aria-haspopup="true"
                    onClick={handleActionsClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <StyledMenu
                    id={`actions-menu${i}`}
                    anchorEl={actionsAnchorEl}
                    open={Boolean(actionsAnchorEl)}
                    onClose={handleActionsClose}
                  >
                    <MenuItem component={Link} to={`${RESOURCE_MANAGER_URL}/pools/${row.id}`}>
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={`Details ${i}`} />
                    </MenuItem>
                    <MenuItem onClick={() => deletePool(row.id)}>
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Delete" />
                    </MenuItem>
                  </StyledMenu>
                </TableCell>
                <TableCell align="left">{row.Name}</TableCell>
                <TableCell align="right">{renderTags(row.Tags, row.id)}</TableCell>
                <TableCell align="right">{row?.PoolType}</TableCell>
                <TableCell align="right">
                  {row.AllocationStrategy ? `${row.AllocationStrategy.Name} (${row.AllocationStrategy?.Lang})` : '-'}
                </TableCell>
                <TableCell align="right">{row.ResourceType.Name}</TableCell>
                <TableCell align="right">
                  { `${row.Capacity.utilizedCapacity}/${row.Capacity.freeCapacity + row.Capacity.utilizedCapacity}` }
                  <LinearProgress value={getCapacityValue(row.Capacity)} variant="determinate" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PoolTable;
