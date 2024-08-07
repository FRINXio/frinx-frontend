import React, { VoidFunctionComponent } from 'react';
import { ConfirmDeleteModal } from '@frinx/shared/src';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteSelectedDevicesModal: VoidFunctionComponent<Props> = ({ onConfirm, isOpen, onClose }) => {
  return (
    <ConfirmDeleteModal isOpen={isOpen} onClose={onClose} onConfirmBtnClick={onConfirm} title="Delete selected streams">
      Are you sure? You can&apos;t undo this action afterwards.
    </ConfirmDeleteModal>
  );
};

export default DeleteSelectedDevicesModal;
