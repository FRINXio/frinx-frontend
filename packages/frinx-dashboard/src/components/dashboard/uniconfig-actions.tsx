import React, { FC } from 'react';
import { Box, Button, Flex, Heading, HStack, Image, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import UniconfigMount from './img/uniconfig-mount.svg';
import UniconfigList from './img/uniconfig-list.svg';

const UniconfigActions: FC = () => {
  return (
    <HStack spacing={4} mb={8}>
      <Flex flex={1}>
        <Box background="gray.200" marginRight={4} width={44}>
          <Image src={UniconfigMount} pointerEvents="none" userSelect="none" />
        </Box>
        <Box flex={1} paddingY={2}>
          <Heading as="h4" size="sm" marginBottom={2}>
            Mount device
          </Heading>
          <Text marginBottom={2}>Connect network device to UniConfig.</Text>
          <Button colorScheme="brand" size="sm" to="/uniconfig/mount" as={Link}>
            Mount
          </Button>
        </Box>
      </Flex>
      <Flex flex={1}>
        <Box background="gray.200" marginRight={4} width={44}>
          <Image src={UniconfigList} pointerEvents="none" userSelect="none" />
        </Box>
        <Box flex={1} paddingY={2}>
          <Heading as="h4" size="sm" marginBottom={2}>
            Browse devices
          </Heading>
          <Text marginBottom={2}>Browse and manage network devices.</Text>
          <Button colorScheme="brand" size="sm" to="/uniconfig/devices" as={Link}>
            Explore
          </Button>
        </Box>
      </Flex>
    </HStack>
  );
};

export default UniconfigActions;
