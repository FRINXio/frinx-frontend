import {
  Button,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent, useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import unescapeJs from 'unescape-js';
import { gql, useQuery } from 'urql';
import { Editor } from '@frinx/shared';
import copyToClipBoard from '../../../helpers/copy-to-clipboard';
import { ExternalStorageQuery, ExternalStorageQueryVariables } from '../../../__generated__/graphql';

const EXTERNAL_STORAGE = gql`
  query ExternalStorage($path: String!) {
    conductor {
      externalStorage(path: $path)
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
  const [isEscaped, setIsEscaped] = useState(false);
  const [{ data, fetching, error }] = useQuery<ExternalStorageQuery, ExternalStorageQueryVariables>({
    query: EXTERNAL_STORAGE,
    variables: { path: storagePath },
  });

  const handleEscapeChange = () => {
    setIsEscaped((prev) => !prev);
  };

  const value = isEscaped ? storagePath : unescapeJs(storagePath);

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
              onClick={() => copyToClipBoard(data?.conductor.externalStorage)}
            />
            <Button size="sm" onClick={handleEscapeChange}>
              {isEscaped ? 'Unescape' : 'Escape'}
            </Button>
          </Stack>
          {fetching && (
            <HStack>
              <Spinner /> <Text my={5}>We are loading external storage payload for you...</Text>
            </HStack>
          )}
          {!fetching && (error || data == null) && <Text>Failed to load external storage payload</Text>}
          {!fetching && data != null && (
            <Editor value={JSON.stringify(data.conductor.externalStorage)} language="json" />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ExternalStorageModal;
