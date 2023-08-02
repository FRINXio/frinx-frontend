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
  Text,
} from '@chakra-ui/react';
import { Editor } from '@frinx/shared/src';

type Props = {
  script?: string;
  lang?: string;
  strategyName?: string;
  isOpen: boolean;
  onClose: () => void;
};

const StrategyScriptModal: VoidFunctionComponent<Props> = ({ strategyName, script, lang, isOpen, onClose }) => {
  return (
    <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          View{' '}
          <Text as="span" color="red" fontFamily="monospace">
            {strategyName}
          </Text>{' '}
          Strategy
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {script != null && lang != null && (
            <Editor height="450px" width="100%" language={lang === 'js' ? 'javascript' : 'python'} value={script} />
          )}
        </ModalBody>
        <ModalFooter>
          <Button data-cy="strategy-code-close" colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StrategyScriptModal;
