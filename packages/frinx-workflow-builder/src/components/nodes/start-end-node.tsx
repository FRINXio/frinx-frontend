import React, { FC } from 'react';
import { Box, Flex, Text, useTheme } from '@chakra-ui/react';
import { CustomNodeType } from '../../helpers/types';

const BaseNode: FC<Omit<CustomNodeType, 'coordinates'>> = (props) => {
  const { inputs, outputs, content } = props;
  const theme = useTheme();

  return (
    <Box
      background="white"
      width={20}
      height={20}
      borderRadius="50%"
      overflow="hidden"
      boxShadow="base"
      borderWidth={4}
      borderStyle="solid"
      borderColor={content === 'start' ? 'green.100' : 'red.100'}
    >
      <Box padding={2} fontSize="sm" fontWeight={600} textAlign="center">
        <Text textTransform="uppercase">{content}</Text>
      </Box>
      <Flex>
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
      </Flex>
      <Flex justifyContent="flex-end">
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
                color: theme.colors.gray[700],
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

export default BaseNode;
