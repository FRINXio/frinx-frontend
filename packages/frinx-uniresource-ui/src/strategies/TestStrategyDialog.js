// @flow
import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';
import TestStrategy from './TestStrategy';

type Props = {
  isOpen: Boolean,
  onClose: () => void,
  activeStrategy: Object,
  onAccept: () => void,
};

const TestStrategyDialog = (props: Props) => {
  const { isOpen, onClose, activeStrategy, onAccept } = props;
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle id="alert-dialog-slide-title">Testing Allocation strategy</DialogTitle>
      <TestStrategy strategy={activeStrategy} />
      <DialogActions>
        <Button onClick={onClose}>Disagree</Button>
        <Button onClick={onAccept} color="primary">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestStrategyDialog;
