import React, { FC } from 'react';
import { Box, Flex, Heading, IconButton, Tooltip, useTheme } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { CustomNodeType } from '../../helpers/types';

const WorkflowNode: FC<Omit<CustomNodeType, 'coordinates'>> = (props) => {
  const { inputs, outputs, data } = props;
  const theme = useTheme();

  return (
    <Box
      background="white"
      width={60}
      borderWidth={2}
      borderStyle="solid"
      borderColor={data?.isSelected ? 'blue.600' : 'gray.200'}
      overflow="hidden"
      boxShadow={data?.isSelected ? undefined : 'base'}
      borderRadius="md"
    >
      <Flex px={2} py={3} fontSize="sm" fontWeight="medium" alignItems="center">
        <Heading as="h4" size="xs" isTruncated>
          {data?.task.name}
        </Heading>
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
      <Flex background="gray.100">
        {inputs?.map((port) => {
          return React.cloneElement(
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

export default WorkflowNode;
