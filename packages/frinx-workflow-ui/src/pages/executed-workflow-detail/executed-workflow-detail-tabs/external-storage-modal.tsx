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
import React, { VoidFunctionComponent, useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import unescapeJs from 'unescape-js';
import { gql, useQuery } from 'urql';
import copyToClipBoard from '../../../helpers/copy-to-clipboard';
import { ExternalStorageQuery, ExternalStorageQueryVariables } from '../../../__generated__/graphql';

const EXTERNAL_STORAGE = gql`
  query ExternalStorage($path: String!) {
    externalStorage(path: $path) {
      data
    }
  }
`;

type Props = {
  storagePath: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

const ExternalStorageModal: VoidFunctionComponent<Props> = ({ isOpen, onClose, storagePath, title }) => {
  const [{ data }] = useQuery<ExternalStorageQuery, ExternalStorageQueryVariables>({
    query: EXTERNAL_STORAGE,
    variables: {
      path: storagePath,
    },
  });

  const [isEscaped, setIsEscaped] = useState(false);

  const handleEscapeChange = () => {
    setIsEscaped((prev) => !prev);
  };

  if (!data) {
    return null;
  }

  const payload = data.externalStorage?.data ?? '';

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
          {payload != null && <Textarea value={value} isReadOnly id="storage" variant="filled" minH={450} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ExternalStorageModal;
