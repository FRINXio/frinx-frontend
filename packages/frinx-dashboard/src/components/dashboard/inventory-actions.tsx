import React, { FC } from 'react';
import { Box, Button, Flex, Heading, HStack, Image, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import UniconfigMount from './img/uniconfig-mount.svg';
import UniconfigList from './img/uniconfig-list.svg';

const InventoryActions: FC = () => {
  return (
    <HStack spacing={4} mb={8}>
      <Flex flex={1}>
        <Box background="blue.50" boxShadow="inner" marginRight={4} width={44}>
          <Image src={UniconfigMount} pointerEvents="none" userSelect="none" />
        </Box>
        <Box flex={1} paddingY={2}>
          <Heading as="h4" size="sm" marginBottom={2}>
            Add new device
          </Heading>
          <Text marginBottom={2}>Connect network device to Device Inventory.</Text>
          <Button colorScheme="blue" size="sm" to="/inventory/new" as={Link}>
            Add device
          </Button>
        </Box>
      </Flex>
      <Flex flex={1}>
        <Box background="blue.50" boxShadow="inner" marginRight={4} width={44}>
          <Image src={UniconfigList} pointerEvents="none" userSelect="none" />
        </Box>
        <Box flex={1} paddingY={2}>
          <Heading as="h4" size="sm" marginBottom={2}>
            Explore & configure devices
          </Heading>
          <Text marginBottom={2}>Browse and manage network devices.</Text>
          <Button colorScheme="blue" size="sm" to="/inventory" as={Link}>
            Explore
          </Button>
        </Box>
      </Flex>
    </HStack>
  );
};

export default InventoryActions;
