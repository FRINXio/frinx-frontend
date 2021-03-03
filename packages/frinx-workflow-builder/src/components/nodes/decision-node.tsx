import React, { FC } from 'react';
import { Box, Flex, Heading, IconButton, Text, Theme, Tooltip, useTheme } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { CustomNodeType, ExtendedDecisionTask, ExtendedTask } from '../../helpers/types';
import unwrap from '../../helpers/unwrap';
import { getNodeColor } from './nodes.helpers';

const isDecisionTask = (task: ExtendedTask): task is ExtendedDecisionTask => {
  return task != null && task.type === 'DECISION';
};

const DecisionNode: FC<Omit<CustomNodeType, 'coordinates'>> = (props) => {
  const theme = useTheme<Theme>();
  const { inputs, outputs, data } = props;
  const { task, onEditBtnClick } = unwrap(data);

  return (
    <Flex
      alignItems="stretch"
      background="white"
      width={60}
      borderWidth={2}
      borderStyle="solid"
      borderColor={data?.isSelected ? 'blue.600' : 'gray.200'}
      borderTopColor={getNodeColor(task.label)}
      borderTopWidth={6}
      borderTopStyle="solid"
      overflow="hidden"
      boxShadow={data?.isSelected ? undefined : 'base'}
      borderRadius="md"
    >
      <Flex
        width={10}
        background="gray.200"
        color="gray.700"
        textAlign="center"
        alignItems="center"
        justifyContent="center"
        textTransform="uppercase"
        fontSize="xs"
      >
        {inputs?.map((port) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return React.cloneElement(port, null, 'in');
        })}
      </Flex>

      <Box flex={1}>
        <Flex alignItems="center" flex={1} paddingX={2} paddingY={1} height={8}>
          <Heading as="h6" size="xs" textTransform="uppercase">
            {task.label}
          </Heading>
          <Box marginLeft="auto">
            <Tooltip label="Edit workflow">
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  onEditBtnClick(data);
                }}
                aria-label="Edit workflow"
                icon={<EditIcon />}
                size="xs"
                colorScheme="blue"
              />
            </Tooltip>
          </Box>
        </Flex>
        <Flex height={8} alignItems="center" justifyContent="center">
          <Text size="sm" color="gray.700" fontFamily="monospace">
            {isDecisionTask(task) && <>if {task.caseValueParam} ==</>}
          </Text>
        </Flex>
      </Box>
      <Flex
        width={10}
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
