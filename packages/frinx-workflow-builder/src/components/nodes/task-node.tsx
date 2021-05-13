import React, { FC } from 'react';
import { Box, Flex, Heading, Tooltip, useTheme } from '@chakra-ui/react';
import { CustomNodeType } from '../../helpers/types';
import { getNodeColor } from './nodes.helpers';
import unwrap from '../../helpers/unwrap';
import { useTaskActions } from '../../task-actions-context';
import NodeButtons from './node-buttons';

const TaskNode: FC<Omit<CustomNodeType, 'coordinates'>> = (props) => {
  const { inputs, outputs, data } = props;
  const { selectTask, selectedTask, setRemovedTaskId } = useTaskActions();
  const theme = useTheme();
  const { task } = unwrap(data);
  const borderColor = getNodeColor(unwrap(task).label);

  return (
    <Box
      background="white"
      width={60}
      borderWidth={2}
      borderStyle="solid"
      borderColor={task.id === selectedTask?.task.id ? borderColor : 'gray.200'}
      borderTopColor={borderColor}
      borderTopWidth={6}
      borderTopStyle="solid"
      overflow="hidden"
      boxShadow={task.id === selectedTask?.task.id ? undefined : 'base'}
      borderRadius="md"
    >
      <Flex px={2} py={1} fontSize="sm" fontWeight="medium" alignItems="center">
        <Heading as="h6" size="xs" textTransform="uppercase" isTruncated marginRight={2} cursor="default">
          <Tooltip label={task.taskReferenceName}>{task.taskReferenceName}</Tooltip>
        </Heading>
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
      </Flex>
      <Flex background="gray.100">
        {inputs?.map((port) => {
          return React.cloneElement(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            port,
            {
              style: {
                background: theme.colors.gray[200],
                width: theme.space[12],
                height: theme.space[6],
                fontSize: theme.fontSizes.xs,
                color: theme.colors.gray[700],
                marginRight: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'uppercase',
              },
            },
            'in',
          );
        })}
        {outputs?.map((port) => {
          return React.cloneElement(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            port,
            {
              style: {
                background: theme.colors.gray[200],
                width: theme.space[12],
                height: theme.space[6],
                fontSize: theme.fontSizes.xs,
                color: theme.colors.gray[600],
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'uppercase',
              },
            },
            'out',
          );
        })}
      </Flex>
    </Box>
  );
};

export default TaskNode;
