// @flow
import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Next, PageGroup, Paginator, Previous } from 'chakra-paginator';

function PaginationPages(props) {
  return (
    <>
      <Paginator
        currentPage={props.currentPage}
        onPageChange={(nextPage) => {
          props.changePageHandler(nextPage);
        }}
        pagesQuantity={props.totalPages || 1}
        activeStyles={{
          width: 45,
        }}
        normalStyles={{
          width: 45,
        }}
      >
        <Flex>
          <Previous>{'<'}</Previous>
          <PageGroup isInline align="center" />
          <Next>{'>'}</Next>
        </Flex>
      </Paginator>
    </>
  );
}

export default PaginationPages;
