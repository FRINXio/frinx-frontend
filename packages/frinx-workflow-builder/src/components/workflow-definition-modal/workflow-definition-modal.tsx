import React, { FC } from 'react';
import AceEditor from 'react-ace';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { Workflow } from '../../helpers/types';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  workflow: Workflow;
};

const WorkflowDefinitionModal: FC<Props> = ({ isOpen, onClose, workflow }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="48rem">
        <ModalHeader>Workflow definition</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AceEditor
            readOnly
            mode="json"
            theme="textmate"
            wrapEnabled
            value={JSON.stringify(workflow, null, 2)}
            fontSize={16}
            tabSize={2}
            width="100%"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WorkflowDefinitionModal;
