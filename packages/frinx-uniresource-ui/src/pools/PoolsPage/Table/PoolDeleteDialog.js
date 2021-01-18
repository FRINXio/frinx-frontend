import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';

const PoolDeleteDialog = (props) => {
    const { isOpen, onClose, onAccept } = props;
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle id="alert-dialog-slide-title">Are you sure you want to delete this pool?</DialogTitle>
            <DialogActions>
                <Button onClick={onAccept} color="primary">
                    Delete
                </Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PoolDeleteDialog;
