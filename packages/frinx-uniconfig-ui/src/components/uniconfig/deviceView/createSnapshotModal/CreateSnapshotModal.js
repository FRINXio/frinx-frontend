import React, { useState } from 'react';
import callbackUtils from '../../../../utils/callbackUtils';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  ModalFooter,
  Button,
  FormControl,
  Input,
  FormLabel,
  useDisclosure,
} from '@chakra-ui/react';

const CreateSnapshotModal = ({ deviceId, operationHandler }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [snapshotName, setSnapshotName] = useState();
  const [isLoading, setIsLoading] = useState(false);

  async function createSnapshot() {
    const target = {
      input: {
        name: snapshotName,
        'target-nodes': {
          node: [deviceId],
        },
      },
    };

    const createSnapshot = callbackUtils.createSnapshotCallback();
    setIsLoading(true);
    const response = await createSnapshot(target);
    setIsLoading(false);
    operationHandler(null, response);
    onClose();
  }

  return (
    <>
      <Button onClick={onOpen}>Create Snapshot</Button>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Snapshot</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="snapshot-name" isRequired>
              <FormLabel>Snapshot name</FormLabel>
              <Input name="snapshot" value={snapshotName} onChange={(event) => setSnapshotName(event.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} isLoading={isLoading} onClick={createSnapshot}>
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateSnapshotModal;
