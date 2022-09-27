// @flow
import {
  Button,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent, useState, useEffect } from 'react';
import FeatherIcon from 'feather-icons-react';
import unescapeJs from 'unescape-js';
import callbackUtils from '../../../utils/callback-utils';
import copyToClipBoard from '../../../helpers/copy-to-clipboard';

type Props = {
  storagePath: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

const ExternalStorageModal: VoidFunctionComponent<Props> = ({ isOpen, onClose, storagePath, title }) => {
  const [payload, setPayload] = useState<string | null>(null);
  const [isEscaped, setIsEscaped] = useState(false);

  useEffect(() => {
    const { getExternalStorage } = callbackUtils.getCallbacks;
    getExternalStorage(storagePath).then((res) => {
      setPayload(JSON.stringify(res, null, 2));
    });
  }, [storagePath]);

  const handleEscapeChange = () => {
    setIsEscaped((prev) => !prev);
  };

  if (!payload) {
    return null;
  }

  const value = isEscaped ? payload : unescapeJs(payload);

  return (
    <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack direction="row" spacing={2} align="center" mb={2}>
            <Text as="b" fontSize="sm">
              Workflow JSON
            </Text>
            <IconButton
              aria-label="copy"
              icon={<Icon as={FeatherIcon} icon="copy" size={20} />}
              size="sm"
              className="clp"
              onClick={() => copyToClipBoard(value)}
            />
            <Button size="sm" onClick={handleEscapeChange}>
              {isEscaped ? 'Unescape' : 'Escape'}
            </Button>
          </Stack>
          {payload != null && <Textarea value={value} isReadOnly={true} id="storage" variant="filled" minH={450} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ExternalStorageModal;
