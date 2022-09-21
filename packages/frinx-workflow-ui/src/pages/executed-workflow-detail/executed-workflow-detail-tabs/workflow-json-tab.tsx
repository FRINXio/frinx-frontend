import React, { FC } from 'react';
import { Box, Stack, IconButton, Button, Text, Textarea, Icon } from '@chakra-ui/react';
import { ExecutedWorkflowDetailResult } from '@frinx/workflow-ui/src/helpers/types';
import FeatherIcon from 'feather-icons-react';

type Props = {
  isEscaped: boolean;
  result: ExecutedWorkflowDetailResult;
  copyToClipBoard: (value: ExecutedWorkflowDetailResult) => void;
  getUnescapedJSON: (value: ExecutedWorkflowDetailResult) => string;
  onEscapeChange: (isEscaped: boolean) => void;
};

const WorkflowJsonTab: FC<Props> = ({ isEscaped, result, copyToClipBoard, onEscapeChange, getUnescapedJSON }) => (
    <Box>
      <Stack direction="row" spacing={2} align="center" mb={2}>
        <Text as="b" fontSize="sm">
          Workflow JSON
        </Text>
        <IconButton
          aria-label="copy"
          icon={<Icon as={FeatherIcon} icon="copy" size={20} />}
          size="sm"
          className="clp"
          onClick={() => copyToClipBoard(result)}
        />
        <Button size="sm" onClick={() => onEscapeChange(!isEscaped)}>
          {isEscaped ? 'Unescape' : 'Escape'}
        </Button>
      </Stack>
      <Textarea value={getUnescapedJSON(result)} isReadOnly id="json" variant="filled" minH={500} />
    </Box>
  );

export default WorkflowJsonTab;
