import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import React, { FC, useRef } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onConfirmBtnClick: () => void;
};

const ConfirmDeleteModal: FC<Props> = ({ isOpen, onClose, title, onConfirmBtnClick, children }) => {
  const cancelRef = useRef<HTMLElement | null>(null);
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>{children}</AlertDialogBody>
          <AlertDialogFooter>
            <Button data-cy="device-cancel-delete" onClick={onClose}>
              Cancel
            </Button>
            <Button data-cy="device-confirm-delete" colorScheme="red" onClick={onConfirmBtnClick} marginLeft={4}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ConfirmDeleteModal;
