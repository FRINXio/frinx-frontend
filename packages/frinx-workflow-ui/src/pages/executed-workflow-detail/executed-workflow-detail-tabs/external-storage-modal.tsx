// @flow
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent, useState, useEffect } from 'react';
import callbackUtils from '../../../utils/callback-utils';

type Props = {
  storagePath: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

const ExternalStorageModal: VoidFunctionComponent<Props> = ({ isOpen, onClose, storagePath, title }) => {
  const [payload, setPayload] = useState<string | null>(null);

  useEffect(() => {
    const getExternalStorage = callbackUtils.getExternalStorageCallback();
    getExternalStorage(storagePath).then((res) => {
      setPayload(JSON.stringify(res, null, 2));
    });
  }, [storagePath]);

  return (
    <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {payload != null && <Textarea value={payload} isReadOnly={true} id="storage" variant="filled" minH={450} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ExternalStorageModal;
