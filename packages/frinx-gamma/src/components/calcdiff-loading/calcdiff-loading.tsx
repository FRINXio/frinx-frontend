import React from 'react';
import { Flex, Spinner, Text } from '@chakra-ui/react';

const CalcdiffLoading = () => {
  return (
    <Flex justifyContent="center" my={2}>
      <Flex flexDirection="column" alignItems="center">
        <Text py="1">Loading caldiff...</Text>
        <Spinner display="flex" alignSelf="center" />
      </Flex>
    </Flex>
  );
};

export default CalcdiffLoading;
