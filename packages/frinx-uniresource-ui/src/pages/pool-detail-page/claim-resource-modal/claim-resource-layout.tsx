import {
  Box,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { FC } from 'react';

type Props = {
  poolName: string;
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
};

const ClaimResourceLayout: FC<Props> = ({ poolName, isOpen, onClose, onClaim, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Claim resource for {poolName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <>
            <Box>{children}</Box>
            <Divider marginY={5} orientation="horizontal" color="gray.200" />
          </>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClaim}>
            Claim resource
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ClaimResourceLayout;
