import React, { FC } from 'react';
import { Box, Button, Flex, Heading, HStack, Image, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import UniflowActionSvg from './img/uniflow-action.svg';
import UniflowListSvg from './img/uniflow-list.svg';
import UniflowExecutedSvg from './img/uniflow-executed.svg';

const UniflowActions: FC = () => {
  return (
    <HStack spacing={4}>
      <Flex flex={1}>
        <Box background="blue.50" boxShadow="inner" marginRight={4} width={44}>
          <Image src={UniflowActionSvg} pointerEvents="none" userSelect="none" />
        </Box>
        <Box flex={1} paddingY={2}>
          <Heading as="h4" size="sm" marginBottom={2}>
            Create workflow
          </Heading>
          <Text marginBottom={2}>Create a workflow by using a workflow builder.</Text>
          <Button colorScheme="blue" size="sm" to="/workflow-manager/builder" as={Link}>
            Create
          </Button>
        </Box>
      </Flex>
      <Flex flex={1}>
        <Box background="blue.50" boxShadow="inner" marginRight={4} width={44}>
          <Image src={UniflowListSvg} pointerEvents="none" userSelect="none" />
        </Box>
        <Box flex={1} paddingY={2}>
          <Heading as="h4" size="sm" marginBottom={2}>
            Explore workflows
          </Heading>
          <Text marginBottom={2}>Explore and execute workflows.</Text>
          <Button colorScheme="blue" size="sm" to="/workflow-manager/definitions" as={Link}>
            Explore
          </Button>
        </Box>
      </Flex>
      <Flex flex={1}>
        <Box background="blue.50" boxShadow="inner" marginRight={4} width={44}>
          <Image src={UniflowExecutedSvg} pointerEvents="none" userSelect="none" />
        </Box>
        <Box flex={1} paddingY={2}>
          <Heading as="h4" size="sm" marginBottom={2}>
            Executed workflows
          </Heading>
          <Text marginBottom={2}>Browse executed workflows.</Text>
          <Button colorScheme="blue" size="sm" to="/workflow-manager/executed" as={Link}>
            Browse
          </Button>
        </Box>
      </Flex>
    </HStack>
  );
};

export default UniflowActions;
