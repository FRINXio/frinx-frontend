import { Container, Flex, Heading } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import UniconfigShell from './uniconfig-shell';

const UniconfigShellPage: VoidFunctionComponent = () => {
  return (
    <Container maxWidth={1280}>
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h1" size="xl">
          UniConfig Shell
        </Heading>
      </Flex>
      <UniconfigShell />
    </Container>
  );
};

export default UniconfigShellPage;
