// @flow
import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';

const DeleteStrategyDialog = (props) => {
  const { isOpen, onClose, onAccept } = props;
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle id="alert-dialog-slide-title">Are you sure you want to delete this allocation strategy?</DialogTitle>
      <DialogActions>
        <Button onClick={onAccept} color="primary">
          Delete
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteStrategyDialog;
