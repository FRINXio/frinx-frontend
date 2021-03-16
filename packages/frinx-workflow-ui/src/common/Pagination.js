// @flow
import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Next, PageGroup, Paginator, Previous } from 'chakra-paginator';

function PaginationPages(props) {
  return (
    <>
      <Paginator
        outerLimit={1}
        innerLimit={1}
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
          <Previous marginRight={1}>{'<'}</Previous>
          <PageGroup isInline align="center" />
          <Next marginLeft={1}>{'>'}</Next>
        </Flex>
      </Paginator>
    </>
  );
}

export default PaginationPages;
