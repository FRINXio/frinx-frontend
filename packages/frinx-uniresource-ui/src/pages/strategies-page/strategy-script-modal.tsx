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
import AceEditor from 'react-ace';

type Props = {
  script?: string;
  lang?: string;
  isOpen: boolean;
  onClose: () => void;
};

const StrategyScriptModal: VoidFunctionComponent<Props> = ({ script, lang, isOpen, onClose }) => {
  return (
    <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>View Strategy</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {script != null && lang != null && (
            <AceEditor
              height="450px"
              width="100%"
              mode={lang === 'js' ? 'javascript' : 'python'}
              theme="tomorrow"
              name="asd"
              editorProps={{ $blockScrolling: true }}
              value={script}
              fontSize={16}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StrategyScriptModal;
