// @flow
import React from 'react';
import {
  withStyles,
  TableCell,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  makeStyles,
  TableRow,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';

import { useStateValue } from '../utils/StateProvider';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => <Menu elevation={0} {...props} />);
const useStyles = makeStyles(() => ({
  iconButton: {},
}));

type Row = { Name: string, Lang: string, id: string, Script: string };
type Props = {
  row: Row,
  onActionClick: () => void,
  actionsAnchorEl: HTMLElement,
  onMenuClose: () => void,
  onTestClick: (Row) => void,
  onDeleteClick: (Row) => void,
};

const StrategiesTableRow = (props: Props) => {
  const classes = useStyles();
  const { row, onActionClick, actionsAnchorEl, onMenuClose, onTestClick, onDeleteClick } = props;
  const { Name, Lang, id, Script } = row;
  const [isOpen, setIsOpen] = React.useState(false);
  const [{ isAdmin }] = useStateValue();

  return (
    <>
      <TableRow className={classes.root}>
        {isAdmin ? (
          <td>
            <IconButton
              className={classes.iconButton}
              aria-controls="actions-menu"
              aria-haspopup="true"
              onClick={onActionClick}
            >
              <MoreVertIcon />
            </IconButton>
            <StyledMenu
              id={`actions-menu-$${id}`}
              getContentAnchorEl={null}
              anchorEl={actionsAnchorEl}
              open={Boolean(actionsAnchorEl)}
              onClose={onMenuClose}
            >
              <MenuItem
                onClick={() => {
                  setIsOpen((prev) => !prev);
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Details" />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onTestClick(row);
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Test Strategy" />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDeleteClick(row);
                }}
              >
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Delete" />
              </MenuItem>
            </StyledMenu>
          </td>
        ) : null}
        <TableCell align="left">{Name}</TableCell>
        <TableCell align="left">{id}</TableCell>
        <TableCell align="left">{Lang}</TableCell>
        <TableCell align="right">
          <IconButton aria-label="expand row" size="small" onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <AceEditor
                className={classes.editor}
                height="450px"
                width="100%"
                mode="javascript"
                theme="tomorrow"
                name={id}
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

export default StrategiesTableRow;
