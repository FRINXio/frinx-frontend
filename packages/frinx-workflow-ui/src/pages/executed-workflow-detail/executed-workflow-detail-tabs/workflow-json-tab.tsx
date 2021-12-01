import React, { FC } from 'react';
import { Box, Stack, IconButton, Button, Text, Textarea } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { ExecutedWorkflowDetailResult } from '../../../types/types';

type Props = {
  isEscaped: boolean;
  result: ExecutedWorkflowDetailResult;
  copyToClipBoard: (value: ExecutedWorkflowDetailResult) => void;
  getUnescapedJSON: (value: ExecutedWorkflowDetailResult) => string;
  onEscapeChange: (isEscaped: boolean) => void;
};

const WorkflowJsonTab: FC<Props> = ({ isEscaped, result, copyToClipBoard, onEscapeChange, getUnescapedJSON }) => {
  return (
    <Box>
      <Stack direction="row" spacing={2} align="center" mb={2}>
        <Text as="b" fontSize="sm">
          Workflow JSON
        </Text>
        <IconButton
          aria-label="copy"
          icon={<CopyIcon />}
          size="sm"
          className="clp"
          onClick={() => copyToClipBoard(result)}
        />
        <Button size="sm" onClick={() => onEscapeChange(!isEscaped)}>
          {isEscaped ? 'Unescape' : 'Escape'}
        </Button>
      </Stack>
      <Textarea value={getUnescapedJSON(result)} isReadOnly={true} id="json" variant="filled" minH={200} />
    </Box>
  );
};

export default WorkflowJsonTab;
