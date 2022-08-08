import { Box, Flex, Heading, Text, Theme, Tooltip, useTheme } from '@chakra-ui/react';
import React, { memo, VoidFunctionComponent } from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';
import { ExtendedDecisionTask } from '../../helpers/types';
import { useTaskActions } from '../../task-actions-context';
import NodeButtons from '../nodes/node-buttons';
import { truncateFromMiddle } from './node.helpers';

type Props = NodeProps<{
  type: string;
  label: string;
  handles: string[];
  task: ExtendedDecisionTask;
  isReadOnly: boolean;
}>;

const DecisionNode: VoidFunctionComponent<Props> = memo(({ id, data }) => {
  const theme = useTheme<Theme>();
  const { selectTask, selectedTask, setRemovedTaskId } = useTaskActions();
  const { task, isReadOnly } = data;

  return (
    <Box
      background="white"
      paddingX={10}
      width={80}
      borderWidth={2}
      borderStyle="solid"
      borderColor={task.id === selectedTask?.task.id ? 'pink.400' : 'gray.200'}
      borderTopColor="pink.400"
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

      <Box paddingX={2} paddingTop={4} minHeight={14}>
        <Tooltip label={task.taskReferenceName}>
          <Heading as="h6" size="xs" fontFamily="monospace" cursor="default">
            {truncateFromMiddle(task.taskReferenceName, 24)}
          </Heading>
        </Tooltip>
        <Flex height={8} alignItems="center" justifyContent="center" isTruncated>
          <Text size="sm" color="gray.700" fontFamily="monospace">
            if {task.caseValueParam} ==
          </Text>
        </Flex>
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
        {data.handles.map((h) => {
          return (
            <Handle
              key={`node-${id}-handle-${h}`}
              type="source"
              position={Position.Right}
              id={`${h}`}
              style={{
                position: 'static',
                top: 0,
                right: 0,
                transform: 'none',
                borderRadius: 0,
                width: '100%',
                // display: isVisible ? 'flex' : 'none',
                display: 'flex',
                background: theme.colors.gray[200],
                color: theme.colors.gray[700],
                fontSize: theme.fontSizes.xs,
                height: theme.sizes[6],
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {h}
            </Handle>
          );
        })}
      </Flex>
    </Box>
  );
});

export default DecisionNode;
