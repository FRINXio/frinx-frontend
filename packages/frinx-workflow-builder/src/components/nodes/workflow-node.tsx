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
      _hover={{
        boxShadow: 'md',
      }}
    >
      <Flex px={2} py={3} fontSize="sm" fontWeight="medium" alignItems="center">
        <Heading as="h4" size="xs" isTruncated>
          {data?.task?.name}
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
                marginRight: 'auto',
              },
            },
            React.createElement(
              Flex,
              {
                background: 'gray.200',
                fontSize: 'xs',
                color: 'gray.700',
                width: 12,
                height: 6,
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'uppercase',
                _hover: {
                  background: 'gray.300',
                },
              },
              'in',
            ),
          );
        })}
        {outputs?.map((port) => {
          return React.cloneElement(
            port,
            {
              style: {
                marginLeft: 'auto',
              },
            },
            React.createElement(
              Flex,
              {
                background: 'gray.200',
                fontSize: 'xs',
                color: 'gray.700',
                width: 12,
                height: 6,
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'uppercase',
                _hover: {
                  background: 'gray.300',
                },
              },
              'out',
            ),
          );
        })}
      </Flex>
    </Box>
  );
};

export default WorkflowNode;
