import React, { useEffect, useState } from 'react';
import {
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  Textarea,
} from '@chakra-ui/react';

const ResponseModal = ({ body }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [colorScheme, setColorScheme] = useState('gray');

  useEffect(() => {
    const timer = setTimeout(() => setColorScheme('gray'), 4000);

    if (body?.output['overall-status'] === 'complete') {
      setColorScheme('green');
    } else if (body?.output['overall-status'] === 'fail') {
      setColorScheme('red');
    }

    return () => {
      clearTimeout(timer);
    };
  }, [body]);

  return (
    <>
      <Button colorScheme={colorScheme} onClick={onOpen}>
        Response
      </Button>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Response</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea value={JSON.stringify(body, null, 2)} readOnly height={96} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ResponseModal;
