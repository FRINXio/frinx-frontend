import { Button, Container, Flex, Heading, Skeleton, SkeletonText } from '@chakra-ui/react';
import React, { FC } from 'react';

const SkeletonScreen: FC = () => {
  return (
    <Container maxWidth="container.xl">
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Skeleton>
          <Heading as="h1" size="xl">
            Heading about something
          </Heading>
        </Skeleton>
        <Skeleton>
          <Button>Button</Button>
        </Skeleton>
      </Flex>
      <SkeletonText noOfLines={8} spacing="4" skeletonHeight="2" />
    </Container>
  );
};

export default SkeletonScreen;
