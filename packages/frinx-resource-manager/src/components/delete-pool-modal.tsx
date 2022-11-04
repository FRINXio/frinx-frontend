import {
  Button,
  Box,
  ModalOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Text,
  ButtonGroup,
  Tooltip,
} from '@chakra-ui/react';
import React, { FC } from 'react';

type Props = {
  onDelete: () => void;
  canDeletePool: boolean;
  poolName: string;
};

const DeletePoolModal: FC<Props> = ({ onDelete, canDeletePool, children, poolName }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Tooltip label="Firstly you need to delete all allocated resources" shouldWrapChildren isDisabled={canDeletePool}>
        <Box
          as="span"
          maxWidth="min-content"
          onClick={() => {
            if (canDeletePool) {
              onOpen();
            }
          }}
          cursor={canDeletePool ? 'pointer' : 'not-allowed'}
        >
          {children}
        </Box>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete resource pool {poolName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete resource pool {poolName}?</Text>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup spacing={1}>
              <Button onClick={onClose}>Cancel</Button>
              <Button colorScheme="red" onClick={onDelete} isDisabled={!canDeletePool}>
                Delete
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeletePoolModal;
