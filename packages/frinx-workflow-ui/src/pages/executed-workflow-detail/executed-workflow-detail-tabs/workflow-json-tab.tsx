import React, { FC } from 'react';
import { Box, Stack, IconButton, Button, Text, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { omit } from 'lodash';
import { Editor, omitDeep } from '@frinx/shared';
import { ExecutedWorkflowDetailQuery } from '../../../__generated__/graphql';

type Props = {
  isEscaped: boolean;
  result: NonNullable<ExecutedWorkflowDetailQuery['conductor']['node']>;
  copyToClipBoard: (value: Record<string, unknown>) => void;
  onEscapeChange: (isEscaped: boolean) => void;
};

const WorkflowJsonTab: FC<Props> = ({ isEscaped, result, copyToClipBoard, onEscapeChange }) => (
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
    <Editor
      value={JSON.stringify(omitDeep(result, ['__typename']), null, 2)}
      options={{ readOnly: true, lineNumbers: 'off', minimap: { enabled: false } }}
    />
  </Box>
);

export default WorkflowJsonTab;
