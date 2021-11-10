import React, { FC } from 'react';
import { IconButton, Button, SimpleGrid, Box, Stack, Textarea, Text } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';

type Props = {
  isEscaped: boolean;
  input: Record<string, string>;
  output: Record<string, string>;
  copyToClipBoard: (value: Record<string, string>) => void;
  getUnescapedJSON: (value: Record<string, string>) => string;
  onEscapeChange: (isEscaped: boolean) => void;
};

const InputOutputTab: FC<Props> = ({ isEscaped, input, output, getUnescapedJSON, copyToClipBoard, onEscapeChange }) => {
  return (
    <SimpleGrid columns={2} spacing={4}>
      <Box>
        <Stack direction="row" spacing={2} align="center" mb={2}>
          <Text as="b" fontSize="sm">
            Workflow Input
          </Text>
          <IconButton
            aria-label="copy"
            icon={<CopyIcon />}
            size="sm"
            className="clp"
            onClick={() => copyToClipBoard(input)}
          />
          <Button size="sm" onClick={() => onEscapeChange(!isEscaped)}>
            {isEscaped ? 'Unescape' : 'Escape'}
          </Button>
        </Stack>
        <Textarea value={getUnescapedJSON(input)} isReadOnly={true} id="workflowInput" variant="filled" minH={200} />
      </Box>
      <Box>
        <Stack direction="row" spacing={2} align="center" mb={2}>
          <Text as="b" fontSize="sm">
            Workflow Output
          </Text>
          <IconButton
            aria-label="copy"
            icon={<CopyIcon />}
            size="sm"
            className="clp"
            onClick={() => copyToClipBoard(output)}
          />
          <Button size="sm" onClick={() => onEscapeChange(!isEscaped)}>
            {isEscaped ? 'Unescape' : 'Escape'}
          </Button>
        </Stack>
        <Textarea value={getUnescapedJSON(output)} isReadOnly={true} id="workflowOutput" variant="filled" minH={200} />
      </Box>
    </SimpleGrid>
  );
};

export default InputOutputTab;
