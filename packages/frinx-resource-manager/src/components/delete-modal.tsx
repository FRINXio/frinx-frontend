import {
  Button,
  Box,
  Divider,
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
  type: string;
  onDelete: () => void;
  canDeletePool?: boolean;
  entityName: string;
};

const getWarningText = (typeName: 'strategy' | 'resource type') => {
  if (typeName === 'resource type') {
    return 'You are also deleting strategy';
  }
  if (typeName === 'strategy') {
    return 'You are also deleting resource type';
  }
  return '';
};

const DeleteModal: FC<Props> = ({ type, onDelete, canDeletePool = true, children, entityName }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Tooltip
        label={type === 'resource pool' ? 'Firstly you need to delete all allocated resources' : ''}
        shouldWrapChildren
        isDisabled={canDeletePool}
      >
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
          <ModalHeader>
            Delete {type} {entityName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete {type} {entityName}?
            </Text>
            {(type === 'strategy' || type === 'resource type') && (
              <>
                <Divider mt={4} mb={4} />
                <Text color="red.500">
                  {getWarningText(type)} {entityName}
                </Text>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <ButtonGroup spacing={1}>
              <Button data-cy="delete-cancel" onClick={onClose}>
                Cancel
              </Button>
              <Button data-cy="delete-confirm" colorScheme="red" onClick={onDelete} isDisabled={!canDeletePool}>
                Delete
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteModal;
