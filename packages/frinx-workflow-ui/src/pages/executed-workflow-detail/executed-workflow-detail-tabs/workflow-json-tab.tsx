import React, { FC } from 'react';
import { Box, Stack, IconButton, Button, Text, Textarea, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { omit } from 'lodash';
import { ControlExecutedWorkflowSubscription } from '../../../__generated__/graphql';

type Props = {
  isEscaped: boolean;
  result: NonNullable<ControlExecutedWorkflowSubscription['controlExecutedWorkflow']>;
  copyToClipBoard: (value: Record<string, unknown>) => void;
  getUnescapedJSON: (value: Record<string, unknown>) => string;
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
          icon={<Icon as={FeatherIcon} icon="copy" size={20} />}
          size="sm"
          className="clp"
          onClick={() => copyToClipBoard(omit(result, ['__typename']))}
        />
        <Button size="sm" onClick={() => onEscapeChange(!isEscaped)}>
          {isEscaped ? 'Unescape' : 'Escape'}
        </Button>
      </Stack>
      <Textarea
        value={getUnescapedJSON(omit(result, ['__typename']))}
        isReadOnly
        id="json"
        variant="filled"
        minH={500}
      />
    </Box>
  );
};

export default WorkflowJsonTab;
