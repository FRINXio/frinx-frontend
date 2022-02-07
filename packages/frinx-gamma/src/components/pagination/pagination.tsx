import React, { VoidFunctionComponent } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

type Props = {
  page: number;
  count: number;
  onPageChange: (page: number) => void;
};

const range = (start: number, end: number, length = end - start + 1) => [...Array(length).keys()].map((d) => d + start);

const Pagination: VoidFunctionComponent<Props> = ({ page, count, onPageChange }) => {
  return (
    <Flex alignItems="flexStart" flexWrap="wrap">
      <Text>Pages:</Text>
      <Box flex="1">
        {range(1, count).map((p) =>
          p === page ? (
            <Text key={`pagination-${p}`} paddingX="1" as="span">
              {p}
            </Text>
          ) : (
            <Button
              key={`pagination-${p}`}
              onClick={() => onPageChange(p)}
              variant="link"
              minWidth="revert"
              color="blue.600"
              mx="1"
            >
              {p}
            </Button>
          ),
        )}
      </Box>
    </Flex>
  );
};

export default Pagination;
