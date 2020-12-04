// @flow weak
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
import { Link } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import { TableSortLabel } from '@material-ui/core';
import get from 'lodash/get';
import PoolTags from './PoolTags';
import { sanitizeString } from '../Filters/filter.helpers';
import type { Pool, Tag, Capacity } from '../../pool.types';

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

type Order = {
  orderBy: 'Name' | 'PoolType' | 'AllocationStrategy.Name' | 'ResourceType.Name' | 'Capacity',
  direction: 'asc' | 'desc',
};

function getCapacityValue(capacity: Capacity) {
  const { freeCapacity, utilizedCapacity } = capacity;
  return (utilizedCapacity / (freeCapacity + utilizedCapacity)) * 100;
}

function sortByCapacity(cap1: Capacity, cap2: Capacity, direction: 'asc' | 'desc'): number {
  if (direction === 'asc') {
    return getCapacityValue(cap1) < getCapacityValue(cap2) ? -1 : 1;
  }
  if (direction === 'desc') {
    return getCapacityValue(cap1) > getCapacityValue(cap2) ? -1 : 1;
  }
  return 1;
}

function sortPools(array: Pool[], order: Order): Pool[] {
  return [...array].sort((a, b) => {
    if (order == null) {
      return 1;
    }
    const { direction, orderBy } = order;
    const firstValue = get(a, orderBy);
    const secondValue = get(b, orderBy);
    if (firstValue == null || secondValue == null) {
      return 1;
    }
    if (orderBy === 'Capacity') {
      return sortByCapacity(firstValue, secondValue, direction);
    }
    if (direction === 'asc') {
      return sanitizeString(firstValue) < sanitizeString(secondValue) ? -1 : 1;
    }
    if (direction === 'desc') {
      return sanitizeString(firstValue) > sanitizeString(secondValue) ? -1 : 1;
    }
    return 1;
  });
}

type Props = {
  pools: Pool[],
  allTags: Tag[],
  onTagAdd: (tagId: string, poolId: string) => void,
  onTagDelete: (tagId: string, poolId: string) => void,
  onPoolDelete: (poolId: string) => void,
};

const PoolTable = ({ pools, allTags, onTagAdd, onTagDelete, onPoolDelete }: Props) => {
  const classes = useStyles();
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const [activeMenuID, setActiveMenuID] = useState(null);
  const [order, setOrder] = useState<Order | null>(null);

  const sortedPools = sortPools(pools, order);

  const handleActionsClick = (event, id) => {
    setActionsAnchorEl(event.currentTarget);
    setActiveMenuID(id);
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
  };

  const RESOURCE_MANAGER_URL = '/resourcemanager/frontend';

  return (
    <>
      <TableContainer component={Paper} className={classes.container}>
        <Table ria-label="pool table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Actions</StyledTableCell>
              <StyledTableCell align="left">
                <TableSortLabel
                  active={order?.orderBy === 'Name'}
                  direction={order?.orderBy === 'Name' ? order?.direction : 'asc'}
                  onClick={() => {
                    setOrder((prev) => ({
                      orderBy: 'Name',
                      direction: (prev?.direction ?? 'desc') === 'asc' ? 'desc' : 'asc',
                    }));
                  }}
                >
                  Pool Name
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align="right">Tags</StyledTableCell>
              <StyledTableCell align="right">
                <TableSortLabel
                  active={order?.orderBy === 'PoolType'}
                  direction={order?.orderBy === 'PoolType' ? order?.direction : 'asc'}
                  onClick={() => {
                    setOrder((prev) => ({
                      orderBy: 'PoolType',
                      direction: (prev?.direction ?? 'desc') === 'asc' ? 'desc' : 'asc',
                    }));
                  }}
                >
                  Pool Type
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align="right">
                <TableSortLabel
                  active={order?.orderBy === 'AllocationStrategy.Name'}
                  direction={order?.orderBy === 'AllocationStrategy.Name' ? order?.direction : 'asc'}
                  onClick={() => {
                    setOrder((prev) => ({
                      orderBy: 'AllocationStrategy.Name',
                      direction: (prev?.direction ?? 'desc') === 'asc' ? 'desc' : 'asc',
                    }));
                  }}
                >
                  Alloc. Strategy (Lang.)
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align="right">
                <TableSortLabel
                  active={order?.orderBy === 'ResourceType.Name'}
                  direction={order?.orderBy === 'ResourceType.Name' ? order?.direction : 'asc'}
                  onClick={() => {
                    setOrder((prev) => ({
                      orderBy: 'ResourceType.Name',
                      direction: (prev?.direction ?? 'desc') === 'asc' ? 'desc' : 'asc',
                    }));
                  }}
                >
                  Resource Type
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align="right">
                <TableSortLabel
                  active={order?.orderBy === 'Capacity'}
                  direction={order?.orderBy === 'Capacity' ? order?.direction : 'asc'}
                  onClick={() => {
                    setOrder((prev) => ({
                      orderBy: 'Capacity',
                      direction: (prev?.direction ?? 'desc') === 'asc' ? 'desc' : 'asc',
                    }));
                  }}
                >
                  Utilized Capacity
                </TableSortLabel>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPools.map((row) => (
              <TableRow key={row.id}>
                <TableCell padding="checkbox" align="center">
                  <IconButton
                    aria-controls="actions-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleActionsClick(event, row.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <StyledMenu
                    id={`actions-menu-${row.id}`}
                    anchorEl={actionsAnchorEl}
                    open={Boolean(actionsAnchorEl) && row.id === activeMenuID}
                    onClose={handleActionsClose}
                  >
                    <MenuItem component={Link} to={`${RESOURCE_MANAGER_URL}/pools/${row.id}`}>
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Details" />
                    </MenuItem>
                    <MenuItem onClick={() => onPoolDelete(row.id)}>
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Delete" />
                    </MenuItem>
                  </StyledMenu>
                </TableCell>
                <TableCell align="left">{row.Name}</TableCell>
                <TableCell align="right">
                  <PoolTags
                    poolTags={row.Tags}
                    allTags={allTags}
                    onTagAdd={(tagId) => {
                      onTagAdd(tagId, row.id);
                    }}
                    onDelete={(tagId) => {
                      onTagDelete(tagId, row.id);
                    }}
                  />
                </TableCell>
                <TableCell align="right">{row?.PoolType}</TableCell>
                <TableCell align="right">
                  {row.AllocationStrategy ? `${row.AllocationStrategy.Name} (${row.AllocationStrategy?.Lang})` : '-'}
                </TableCell>
                <TableCell align="right">{row.ResourceType?.Name}</TableCell>
                <TableCell align="right">
                  {row.Capacity ? (
                    <>
                      {`${row.Capacity.utilizedCapacity}/${row.Capacity.freeCapacity + row.Capacity.utilizedCapacity}`}
                      <LinearProgress value={getCapacityValue(row.Capacity)} variant="determinate" />
                    </>
                  ) : null}
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
