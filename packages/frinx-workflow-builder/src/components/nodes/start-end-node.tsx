import React, { FC } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { CustomNodeType } from '../../helpers/types';

const BaseNode: FC<Omit<CustomNodeType, 'coordinates'>> = (props) => {
  const { inputs, outputs, content } = props;

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
          return (
            <Flex
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              key={port.key}
              width={12}
              height={6}
              background="gray.200"
              color="gray.700"
              marginRight="auto"
              textAlign="center"
              alignItems="center"
              justifyContent="center"
              textTransform="uppercase"
              fontSize="xs"
              position="relative"
              _hover={{
                background: 'gray.300',
              }}
            >
              {React.cloneElement(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                port,
                {
                  style: {
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                },
                'in',
              )}
            </Flex>
          );
        })}
        {outputs?.map((port) => {
          return (
            <Flex
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              key={port.key}
              width={12}
              height={6}
              background="gray.200"
              color="gray.700"
              marginLeft="auto"
              textAlign="center"
              alignItems="center"
              justifyContent="center"
              textTransform="uppercase"
              fontSize="xs"
              position="relative"
              _hover={{
                background: 'gray.300',
              }}
            >
              {React.cloneElement(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                port,
                {
                  style: {
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                },
                'out',
              )}
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};

export default BaseNode;
