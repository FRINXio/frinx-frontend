import React, { FC } from 'react';
import { Box, Flex, Heading, IconButton, Text, Tooltip, useTheme } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { CustomNodeType, Task, DecisionTask } from '../../helpers/types';

const isDecisionTask = (task: Task | undefined | null): task is DecisionTask => {
  return task != null && task.type === 'DECISION';
};

const DecisionNode: FC<Omit<CustomNodeType, 'coordinates'>> = (props) => {
  const theme = useTheme();
  const { inputs, outputs, data } = props;

  return (
    <Flex
      alignItems="stretch"
      background="gray.200"
      width={60}
      height={16}
      borderRadius="base"
      overflow="hidden"
      boxShadow="base"
      borderWidth={2}
      borderStyle="solid"
      borderColor="gray.300"
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

      <Flex textAlign="center" flex={1} paddingY={2}>
        <Box flex={1}>
          <Heading as="h4" size="xs" fontSize="sm" fontWeight={600} marginBottom={2}>
            {data?.task?.name}
          </Heading>
          <Text size="sm" color="gray.700" fontFamily="monospace">
            {isDecisionTask(data?.task) && <>if {data?.task?.caseValueParam} =</>}
          </Text>
        </Box>
        <Box marginLeft="auto">
          <Tooltip label="Edit workflow">
            <IconButton
              onClick={(event) => {
                event.stopPropagation();
                data?.onClick(data);
              }}
              aria-label="Edit workflow"
              icon={<EditIcon />}
              size="xs"
              colorScheme="blue"
            />
          </Tooltip>
        </Box>
      </Flex>
      <Flex
        width={10}
        // background="gray.200"
        color="gray.700"
        marginLeft="auto"
        flexDirection="column"
        textAlign="center"
        alignItems="center"
        justifyContent="center"
        textTransform="uppercase"
        fontSize="xs"
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
                marginTop: theme.space[2],
                marginBottom: theme.space[2],
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
