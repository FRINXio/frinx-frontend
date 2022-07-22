import { Box, Flex, Heading, Theme, useTheme } from '@chakra-ui/react';
import React, { memo, VoidFunctionComponent } from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';
import { NodeData } from '../../helpers/api-to-graph.helpers';
import { ExtendedTask, TaskType } from '../../helpers/types';
import { useTaskActions } from '../../task-actions-context';
import NodeButtons from '../nodes/node-buttons';

type Props = NodeProps<NodeData>;

function getBorderColor(taskType: TaskType) {
  switch (taskType) {
    case 'SIMPLE': {
      return 'yellow.500';
    }
    case 'LAMBDA': {
      return 'orange.600';
    }
    case 'SUB_WORKFLOW': {
      return 'cyan.400';
    }
    default: {
      return 'pink.400';
    }
  }
}

const BaseNode: VoidFunctionComponent<Props> = memo(({ id, data }) => {
  const theme = useTheme<Theme>();
  const { selectTask, selectedTask, setRemovedTaskId } = useTaskActions();
  const { task, isReadOnly } = data;

  const topColor = getBorderColor(task.type);

  return (
    <Box
      background="white"
      paddingX={10}
      width={64}
      borderWidth={2}
      borderStyle="solid"
      borderColor={task.id === selectedTask?.task.id ? topColor : 'gray.200'}
      borderTopColor={topColor}
      borderTopWidth={6}
      borderTopStyle="solid"
      boxShadow={task.id === selectedTask?.task.id ? undefined : 'base'}
      borderRadius="md"
      position="relative"
    >
      {!isReadOnly && (
        <Box
          position="absolute"
          left="0"
          top="-6px"
          transform="translate(0, -100%)"
          paddingX={2}
          paddingY={1}
          background="white"
          borderTopRadius="md"
        >
          <NodeButtons
            onEditButtonClick={() => {
              selectTask({ actionType: 'edit', task });
            }}
            onDeleteButtonClick={() => {
              setRemovedTaskId(task.id);
            }}
            onExpandButtonClick={
              task.type === 'SUB_WORKFLOW'
                ? () => {
                    selectTask({ actionType: 'expand', task });
                  }
                : undefined
            }
          />
        </Box>
      )}
      <Flex background="gray.100" alignItems="stretch" width={10} position="absolute" top={0} bottom={0} left={0}>
        <Handle
          type="target"
          position={Position.Left}
          style={{
            position: 'static',
            top: 0,
            left: 0,
            transform: 'none',
            background: theme.colors.gray[200],
            width: theme.space[12],
            height: '100%',
            borderRadius: 0,
            fontSize: theme.fontSizes.xs,
            color: theme.colors.gray[700],
            marginRight: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textTransform: 'uppercase',
          }}
        >
          in
        </Handle>
      </Flex>

      <Box paddingX={2} paddingY={4} minHeight={14}>
        <Heading as="h6" size="xs">
          {task.taskReferenceName}
        </Heading>
      </Box>
      <Flex
        position="absolute"
        top={0}
        bottom={0}
        right={0}
        width={10}
        flexBasis={12}
        marginLeft="auto"
        flexDirection="column"
        alignItems="stretch"
        justifyContent="space-between"
      >
        <Handle
          id={`node-${id}-source`}
          type="source"
          position={Position.Right}
          style={{
            position: 'static',
            top: 0,
            right: 0,
            transform: 'none',
            borderRadius: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            background: theme.colors.gray[200],
            color: theme.colors.gray[700],
            fontSize: theme.fontSizes.xs,
            alignItems: 'center',
            justifyContent: 'center',
            textTransform: 'uppercase',
          }}
        >
          out
        </Handle>
      </Flex>
    </Box>
  );
});

export default BaseNode;
