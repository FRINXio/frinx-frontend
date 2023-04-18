import React, { VoidFunctionComponent, useState } from 'react';
import { IconButton, Button, SimpleGrid, Box, Stack, Textarea, Text, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import ExternalStorageModal from './external-storage-modal';
import unescapeJs from 'unescape-js';

type Props = {
  isEscaped: boolean;
  input: Record<string, string>;
  output: Record<string, string>;
  copyToClipBoard: (value: Record<string, string>) => void;
  onEscapeChange: (isEscaped: boolean) => void;
  externalInputPayloadStoragePath?: string;
  externalOutputPayloadStoragePath?: string;
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

  const isJson = (data: string) => {
    try {
      JSON.parse(data);
    } catch (e) {
      return false;
    }
    return true;
  };

  const replaceJsonAndArray = (key: string, value: string) => {
    if (Number(value)) {
      return value;
    }
    if (isJson(value) || Array.isArray(value)) {
      return JSON.parse(value);
    }
    return value;
  };

  const getJSON = (data: Record<string, unknown> | unknown) => {
    return isEscaped
      ? JSON.stringify(data, replaceJsonAndArray, 2)
          .replace(/\\n/g, '\\n')
          .replace(/\\'/g, "\\'")
          .replace(/\\"/g, '\\"')
          .replace(/\\&/g, '\\&')
          .replace(/\\r/g, '\\r')
          .replace(/\\t/g, '\\t')
          .replace(/\\b/g, '\\b')
          .replace(/\\f/g, '\\f')
      : unescapeJs(JSON.stringify(data, replaceJsonAndArray, 2));
  };

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
          <Textarea value={getJSON(input)} isReadOnly id="workflowInput" variant="filled" minH={500} />
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
          <Textarea value={getJSON(output)} isReadOnly id="workflowOutput" variant="filled" minH={500} />
        </Box>
      </SimpleGrid>
    </>
  );
};

export default InputOutputTab;
