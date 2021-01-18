import React, { FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { CustomNodeType } from '../../helpers/types';

const BaseNode: FC<Omit<CustomNodeType, 'coordinates'>> = (props) => {
  const { inputs, outputs, content } = props;

  return (
    <Box
      background="gray.100"
      width={20}
      height={20}
      borderRadius="50%"
      overflow="hidden"
      boxShadow="base"
      borderWidth={2}
      borderStyle="solid"
      borderColor="gray.200"
    >
      <div
        style={{
          padding: '10px',
          fontSize: 13,
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {content}
      </div>
      <Flex>
        {inputs?.map((port) => {
          return (
            <Flex
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
              _hover={{
                background: 'gray.300',
              }}
            >
              {React.cloneElement(port, null, 'in')}
            </Flex>
          );
        })}
        {outputs?.map((port) => {
          return (
            <Flex
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
              _hover={{
                background: 'gray.300',
              }}
            >
              {React.cloneElement(port, null, 'out')}
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};

export default BaseNode;
