import {
  Button,
  Code,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  onClose: () => void;
  configuration: string;
};

const CommitOutputModal: VoidFunctionComponent<Props> = ({ onClose, configuration }) => {
  return (
    <Modal isOpen onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dry run commit output</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowX="auto">
          <pre>
            <Code width="100%">{configuration}</Code>
          </pre>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={() => {
              onClose();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CommitOutputModal;
