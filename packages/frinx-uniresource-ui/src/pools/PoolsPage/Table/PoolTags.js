// @flow
import React from 'react';
import { Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddTagMenu from './AddTagMenu';
import type { Tag } from '../../pool.types';

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5),
  },
}));

type Props = {
  poolTags: Tag[],
  allTags: Tag[],
  onTagAdd: (tagId: string) => void,
  onDelete: (tagId: string) => void,
};

const PoolTags = (props: Props) => {
  const { poolTags, allTags, onTagAdd, onDelete } = props;
  const classes = useStyles();
  const tagIds = poolTags.map((t) => t.id);
  const availableTags = allTags.filter((t) => !tagIds.includes(t.id));

  return (
    <>
      {poolTags.map((t) => (
        <Chip
          key={t.id}
          size="small"
          label={t.Tag}
          onDelete={() => {
            onDelete(t.id);
          }}
          className={classes.chip}
        />
      ))}
      <AddTagMenu tags={availableTags} onTagAdd={onTagAdd} />
    </>
  );
};

export default PoolTags;
