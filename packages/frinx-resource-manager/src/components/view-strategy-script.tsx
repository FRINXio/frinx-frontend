import React, { FC } from 'react';
import {
  Button,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { Editor } from '@frinx/shared/src';

type ViewStrategyScriptProps = {
  script: string;
  lang: string;
};

const ViewStrategyScript: FC<ViewStrategyScriptProps> = ({ script, lang }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Strategy</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Editor height="450px" width="100%" language={lang === 'js' ? 'javascript' : 'python'} value={script} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div>
        <IconButton
          variant="outline"
          colorScheme="blue"
          ml={2}
          aria-label="delete"
          icon={<Icon size={20} as={FeatherIcon} icon="code" color="blue" />}
          onClick={onOpen}
        />
      </div>
    </>
  );
};

export default ViewStrategyScript;
