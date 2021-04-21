import React, { FC } from 'react';
import { Box, Flex, Heading, useTheme } from '@chakra-ui/react';
import { CustomNodeType } from '../../helpers/types';
import { getNodeColor } from './nodes.helpers';
import unwrap from '../../helpers/unwrap';
// import { useTaskActions } from '../../task-actions-context';
// import NodeButtons from './node-buttons';

const ReadOnlyTaskNode: FC<Omit<CustomNodeType, 'coordinates'>> = (props) => {
  const { inputs, outputs, data } = props;
  const theme = useTheme();
  const { task } = unwrap(data);
  const borderColor = getNodeColor(task.label);

  return (
    <Box
      background="white"
      width={60}
      borderWidth={2}
      borderStyle="solid"
      borderColor={borderColor}
      borderTopColor={borderColor}
      borderTopWidth={6}
      borderTopStyle="solid"
      overflow="hidden"
      boxShadow={borderColor}
      borderRadius="md"
    >
      <Flex px={2} py={1} fontSize="sm" fontWeight="medium" alignItems="center">
        <Heading as="h6" size="xs" textTransform="uppercase" isTruncated marginRight={2} title={task.name}>
          {task.name}
        </Heading>
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

export default ReadOnlyTaskNode;
