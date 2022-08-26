import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import AlternativeIdModalTable from './alternative-id-modal-table';

type Props = {
  isOpen: boolean;
  altIds: Record<string, string | string[]>;
  onClose: () => void;
};

const AlternativeIdsModal: VoidFunctionComponent<Props> = ({ isOpen, onClose, altIds }) => {
  const altIdKeys = Object.keys(altIds);

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Alternative Ids</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AlternativeIdModalTable altIdKeys={altIdKeys} altIds={altIds} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AlternativeIdsModal;
