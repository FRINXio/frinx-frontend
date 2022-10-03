import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import React, { memo, VoidFunctionComponent } from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';
import { ExtendedDecisionTask } from '../../../helpers/types';
import { ExecutionState, getBackgroundColor } from './node.helpers';

type Props = NodeProps<{
  type: string;
  label: string;
  handles: string[];
  task: ExtendedDecisionTask;
  isReadOnly: boolean;
  status: ExecutionState;
}>;

const DecisionNode: VoidFunctionComponent<Props> = memo(({ id, data }) => {
  const { task, status } = data;

  return (
    <Box
      background={getBackgroundColor(status)}
      paddingX={10}
      borderWidth={2}
      borderStyle="solid"
      borderRadius="md"
      position="relative"
      minWidth="300px"
    >
      <Flex background="gray.100" alignItems="stretch" width="100%" position="absolute" top={0} left={0}>
        <Handle type="target" position={Position.Top} />
      </Flex>

      <Box paddingX={2} paddingTop={4} minHeight={14} textAlign="center">
        <Heading as="h6" size="xs">
          {task.taskReferenceName}
        </Heading>
        <Text>{task.name}</Text>
      </Box>
      <Flex
        flexBasis={12}
        flexDirection="row"
        alignItems="stretch"
        justifyContent="space-between"
        background="transparent"
      >
        {data.handles.map((h) => {
          return (
            <Handle
              key={`node-${id}-handle-${h}`}
              type="source"
              position={Position.Bottom}
              id={`${h}`}
              style={{
                position: 'static',
                height: 1,
                transform: 'none',
                width: '100%',
                display: 'flex',
                background: 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                border: 0,
              }}
            />
          );
        })}
      </Flex>
    </Box>
  );
});

export default DecisionNode;
