import React, { VoidFunctionComponent, useState } from 'react';
import { IconButton, Button, SimpleGrid, Box, Stack, Textarea, Text, Icon } from '@chakra-ui/react';
import ExternalStorageModal from './external-storage-modal';
import FeatherIcon from 'feather-icons-react';

type Props = {
  isEscaped: boolean;
  input: Record<string, string>;
  output: Record<string, string>;
  copyToClipBoard: (value: Record<string, string>) => void;
  getUnescapedJSON: (value: Record<string, string>) => string;
  onEscapeChange: (isEscaped: boolean) => void;
  externalInputPayloadStoragePath?: string;
  externalOutputPayloadStoragePath?: string;
};

const InputOutputTab: VoidFunctionComponent<Props> = ({
  isEscaped,
  input,
  output,
  getUnescapedJSON,
  copyToClipBoard,
  onEscapeChange,
  externalInputPayloadStoragePath,
  externalOutputPayloadStoragePath,
}) => {
  const [payload, setPayload] = useState<{ type: 'Input' | 'Output'; data: string } | null>(null);
  return (
    <>
      {payload && (
        <ExternalStorageModal
          title={payload.type}
          isOpen={payload != null}
          onClose={() => {
            setPayload(null);
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
          <Textarea value={getUnescapedJSON(input)} isReadOnly={true} id="workflowInput" variant="filled" minH={500} />
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
          <Textarea
            value={getUnescapedJSON(output)}
            isReadOnly={true}
            id="workflowOutput"
            variant="filled"
            minH={500}
          />
        </Box>
      </SimpleGrid>
    </>
  );
};

export default InputOutputTab;
