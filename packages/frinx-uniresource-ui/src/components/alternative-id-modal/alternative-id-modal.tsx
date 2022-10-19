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
  altIds?: Record<string, string | string[]> | null;
  onClose: () => void;
};

const AlternativeIdsModal: VoidFunctionComponent<Props> = ({ isOpen, onClose, altIds }) => {
  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Alternative Ids</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {altIds != null && Object.keys(altIds).length > 0 && (
            <AlternativeIdModalTable altIdKeys={Object.keys(altIds)} altIds={altIds} />
          )}
          {(altIds == null || Object.keys(altIds).length === 0) && (
            <div>This allocated resources doesn&apos;t any alternative ids</div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AlternativeIdsModal;
