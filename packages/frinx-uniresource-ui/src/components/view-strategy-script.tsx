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
import AceEditor from 'react-ace';

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
