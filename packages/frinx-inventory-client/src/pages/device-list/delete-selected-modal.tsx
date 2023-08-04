import React, { VoidFunctionComponent } from 'react';
import { ConfirmDeleteModal } from '@frinx/shared';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteSelectedDevicesModal: VoidFunctionComponent<Props> = ({ onConfirm, isOpen, onClose }) => {
  return (
    <ConfirmDeleteModal isOpen={isOpen} onClose={onClose} onConfirmBtnClick={onConfirm} title="Delete selected devices">
      Are you sure? You can&apos;t undo this action afterwards.
    </ConfirmDeleteModal>
  );
};

export default DeleteSelectedDevicesModal;
