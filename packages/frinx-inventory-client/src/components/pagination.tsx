import React, { VoidFunctionComponent } from 'react';
import { Box, Button, Text, HStack, StackDivider } from '@chakra-ui/react';

type Props = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

const Pagination: VoidFunctionComponent<Props> = (props) => {
  const { hasNextPage, hasPreviousPage, onPrevious, onNext } = props;
  return (
    <Box padding={1}>
      <HStack spacing="2" divider={<StackDivider borderColor="gray" />}>
        {hasPreviousPage ? (
          <Button data-cy="device-list-prev" color="blue.600" onClick={onPrevious} variant="link" outline="none">
            Previous
          </Button>
        ) : (
          <Text>Previous</Text>
        )}
        {hasNextPage ? (
          <Button data-cy="device-list-next" color="blue.600" onClick={onNext} variant="link">
            Next
          </Button>
        ) : (
          <Text>Next</Text>
        )}
      </HStack>
    </Box>
  );
};

export default Pagination;
