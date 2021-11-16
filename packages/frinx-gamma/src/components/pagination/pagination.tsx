import React, { VoidFunctionComponent } from 'react';
import { Box, Button, HStack, Text } from '@chakra-ui/react';

type Props = {
  page: number;
  count: number;
  onPageChange: (page: number) => void;
};

const range = (start: number, end: number, length = end - start + 1) => [...Array(length).keys()].map((d) => d + start);

const Pagination: VoidFunctionComponent<Props> = ({ page, count, onPageChange }) => {
  return (
    <Box>
      <HStack>
        <Text>Pages:</Text>
        {range(1, count).map((p) =>
          p === page ? (
            <Text key={`pagination-${p}`}>{p}</Text>
          ) : (
            <Button
              key={`pagination-${p}`}
              onClick={() => onPageChange(p)}
              variant="link"
              minWidth="revert"
              color="blue.600"
            >
              {p}
            </Button>
          ),
        )}
      </HStack>
    </Box>
  );
};

export default Pagination;
