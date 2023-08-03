import React, { VoidFunctionComponent } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Editor } from '@frinx/shared';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  json?: string | null;
};

const EventHandlerDetailActionJsonModal: VoidFunctionComponent<Props> = ({ json, onClose, isOpen }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Event handler actions</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Editor
            value={json == null || json.length === 0 ? '// any content was not provided to be shown' : json}
            height="200px"
            language="json"
            options={{
              minimap: {
                enabled: false,
              },
              autoIndent: 'full',
              readOnly: true,
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EventHandlerDetailActionJsonModal;
