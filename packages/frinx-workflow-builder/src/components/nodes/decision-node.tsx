import React, { FC } from 'react';
import { Box, Flex, Heading, Text, Theme, useTheme } from '@chakra-ui/react';
import { CustomNodeType, ExtendedDecisionTask, ExtendedTask } from '../../helpers/types';
import unwrap from '../../helpers/unwrap';
import { getNodeColor } from './nodes.helpers';
import { useTaskActions } from '../../task-actions-context';
import NodeButtons from './node-buttons';

const isDecisionTask = (task: ExtendedTask): task is ExtendedDecisionTask => {
  return task != null && task.type === 'DECISION';
};

const DecisionNode: FC<Omit<CustomNodeType, 'coordinates'>> = (props) => {
  const theme = useTheme<Theme>();
  const { inputs, outputs, data } = props;
  const { selectTask, selectedTask, setRemovedTaskId } = useTaskActions();
  const { task } = unwrap(data);

  return (
    <Flex
      alignItems="stretch"
      background="white"
      width={64}
      borderWidth={2}
      borderStyle="solid"
      borderColor={task.id === selectedTask?.task.id ? 'blue.600' : 'gray.200'}
      borderTopColor={getNodeColor(task.label)}
      borderTopWidth={6}
      borderTopStyle="solid"
      overflow="hidden"
      boxShadow={task.id === selectedTask?.task.id ? undefined : 'base'}
      borderRadius="md"
    >
      <Flex background="gray.100" alignItems="stretch" width={10}>
        {inputs?.map((port) => {
          return React.cloneElement(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            port,
            {
              style: {
                background: theme.colors.gray[200],
                width: theme.space[12],
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
      </Flex>

      <Box flex={1}>
        <Flex alignItems="center" flex={1} paddingX={2} paddingY={1} height={8}>
          <Heading as="h6" size="xs" textTransform="uppercase" isTruncated title={task.name}>
            {task.name}
          </Heading>
          <NodeButtons
            onEditButtonClick={() => {
              selectTask({ actionType: 'edit', task });
            }}
            onDeleteButtonClick={() => {
              setRemovedTaskId(task.id);
            }}
          />
        </Flex>
        <Flex height={8} alignItems="center" justifyContent="center">
          <Text size="sm" color="gray.700" fontFamily="monospace">
            {isDecisionTask(task) && <>if {task.caseValueParam} ==</>}
          </Text>
        </Flex>
      </Box>
      <Flex
        width={12}
        flexBasis={12}
        // background="gray.200"
        marginLeft="auto"
        flexDirection="column"
        alignItems="stretch"
        justifyContent="space-between"
      >
        {outputs?.map((port, i) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // const [label] = port.props.id.split(':');
          const label = Object.keys(data?.task.decisionCases)[i] ?? 'else';
          return React.cloneElement(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            port,
            {
              style: {
                background: theme.colors.gray[200],
                color: theme.colors.gray[700],
                fontSize: theme.fontSizes.xs,
                height: theme.sizes[6],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
            },
            label,
          );
        })}
      </Flex>
    </Flex>
  );
};

export default DecisionNode;
