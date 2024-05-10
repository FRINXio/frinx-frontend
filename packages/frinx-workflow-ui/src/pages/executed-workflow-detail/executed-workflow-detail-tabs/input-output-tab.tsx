import React, { VoidFunctionComponent, useState, useEffect } from 'react';
import { IconButton, Button, SimpleGrid, Box, Stack, Text, Icon, useDisclosure } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { Editor } from '@frinx/shared';
import ExternalStorageModal from './external-storage-modal';

type Props = {
  isEscaped: boolean;
  input: Record<string, string>;
  output: Record<string, string>;
  copyToClipBoard: (value: Record<string, string>) => void;
  onEscapeChange: (isEscaped: boolean) => void;
  externalInputPayloadStoragePath?: string | null;
  externalOutputPayloadStoragePath?: string | null;
};

const InputOutputTab: VoidFunctionComponent<Props> = ({
  isEscaped,
  input,
  output,
  copyToClipBoard,
  onEscapeChange,
  externalInputPayloadStoragePath,
  externalOutputPayloadStoragePath,
}) => {
  const [payload, setPayload] = useState<{ type: 'Input' | 'Output'; data: string } | null>(null);
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    if (payload) {
      onOpen();
    }
  }, [payload, onOpen]);

  return (
    <>
      {payload != null && (
        <ExternalStorageModal
          title={payload.type}
          isOpen={isOpen}
          onClose={() => {
            setPayload(null);
            onClose();
          }}
          storagePath={payload.data}
        />
      )}

      <SimpleGrid columns={2} spacing={4}>
        <Box>
          <Stack direction="row" spacing={2} align="center" mb={2}>
            <Text as="b" fontSize="sm">
              Workflow Input
            </Text>
            <IconButton
              aria-label="copy"
              icon={<Icon as={FeatherIcon} icon="copy" size={20} />}
              size="sm"
              className="clp"
              onClick={() => copyToClipBoard(input)}
            />
            <Button size="sm" onClick={() => onEscapeChange(!isEscaped)}>
              Textarea,
              {isEscaped ? 'Unescape' : 'Escape'}
            </Button>
            {externalInputPayloadStoragePath && (
              <Button
                size="sm"
                onClick={() => {
                  setPayload({ type: 'Input', data: externalInputPayloadStoragePath });
                }}
              >
                External storage input
              </Button>
            )}
          </Stack>
          <Editor value={JSON.stringify(input, null, 2)} options={{ readOnly: true, lineNumbers: 'off' }} />
        </Box>
        <Box>
          <Stack direction="row" spacing={2} align="center" mb={2}>
            <Text as="b" fontSize="sm">
              Workflow Output
            </Text>
            <IconButton
              aria-label="copy"
              icon={<Icon as={FeatherIcon} icon="copy" size={20} />}
              size="sm"
              className="clp"
              onClick={() => copyToClipBoard(output)}
            />
            <Button size="sm" onClick={() => onEscapeChange(!isEscaped)}>
              {isEscaped ? 'Unescape' : 'Escape'}
            </Button>
            {externalOutputPayloadStoragePath && (
              <Button
                size="sm"
                onClick={() => {
                  setPayload({ type: 'Output', data: externalOutputPayloadStoragePath });
                }}
              >
                External storage output
              </Button>
            )}
          </Stack>
          <Editor value={JSON.stringify(output, null, 2)} options={{ readOnly: true, lineNumbers: 'off' }} />
        </Box>
      </SimpleGrid>
    </>
  );
};

export default InputOutputTab;
