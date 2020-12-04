// @flow
import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import Chip from '@material-ui/core/Chip';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Tag } from '../../pool.types';

const ITEM_HEIGHT = 48;

const useStyles = makeStyles(() => ({
  root: {
    display: 'inline-block',
  },
}));

type Props = {
  tags: Tag[],
  onTagAdd: (tagId: string) => void,
};

const AddTagMenu = (props: Props) => {
  const { tags, onTagAdd } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: SyntheticEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className={classes.root}>
      <Chip size="small" icon={<AddIcon />} variant="outlined" clickable onClick={handleMenuOpen} />
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={anchorEl != null}
        onClose={() => {
          setAnchorEl(null);
        }}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '220px',
          },
        }}
      >
        <MenuItem disabled>{tags.length > 0 ? 'Start typing...' : 'No tags available'}</MenuItem>
        {tags.map((tag) => (
          <MenuItem
            key={tag.id}
            onClick={() => {
              onTagAdd(tag.id);
            }}
          >
            {tag.Tag}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default AddTagMenu;
