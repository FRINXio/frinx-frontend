import { Box, Heading, Text } from '@chakra-ui/react';
import React, { memo, VoidFunctionComponent } from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';
import { ExtendedTask } from '../../helpers/types';
import { ExecutionState, getBackgroundColor } from './node-helpers';

type Props = NodeProps<{
  type: string;
  label: string;
  handles: string[];
  task: ExtendedTask;
  isReadOnly: boolean;
  status: ExecutionState;
}>;

const BaseNode: VoidFunctionComponent<Props> = memo(({ id, data }) => {
  const { task, status } = data;

  return (
    <Box
      minWidth={300}
      borderWidth={2}
      borderStyle="solid"
      borderRadius="md"
      position="relative"
      background={getBackgroundColor(status)}
      display="flex"
      justifyContent="center"
    >
      <Handle type="target" position={Position.Top} />

      <Box paddingX={2} paddingTop={4} minHeight={14} display="flex" alignItems="center" flexDirection="column">
        <Heading as="h6" size="xs">
          {task.taskReferenceName}
        </Heading>
        <Text>{task.name}</Text>
      </Box>
      <Handle id={`node-${id}-source`} type="source" position={Position.Bottom} />
    </Box>
  );
});

export default BaseNode;
