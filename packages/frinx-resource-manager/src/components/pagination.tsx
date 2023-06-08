import React, { VoidFunctionComponent } from 'react';
import { Box, Button, Text, HStack, StackDivider } from '@chakra-ui/react';

type Props = {
  after?: string | null;
  before?: string | null;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

const Pagination: VoidFunctionComponent<Props> = ({
  after,
  before,
  hasNextPage,
  hasPreviousPage,
  onPrevious,
  onNext,
}) => {
  console.log(hasNextPage, hasPreviousPage, before, after, onPrevious, onNext);

  return (
    <Box padding={1}>
      <HStack spacing="2" divider={<StackDivider borderColor="gray" />}>
        {!hasPreviousPage ? (
          <Text cursor="not-allowed">Previous</Text>
        ) : (
          <Button color="blue.600" onClick={onPrevious} variant="link" outline="none">
            Previous
          </Button>
        )}
        {!hasNextPage ? (
          <Text cursor="not-allowed">Next</Text>
        ) : (
          <Button color="blue.600" onClick={onNext} variant="link">
            Next
          </Button>
        )}
      </HStack>
    </Box>
  );
};

export default Pagination;
