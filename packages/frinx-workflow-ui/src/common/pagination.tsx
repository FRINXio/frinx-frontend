import React, { FC } from 'react';
import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  usePagination,
} from '@ajna/pagination';

type Props = {
  pagesAmount: number;
  onPaginationClick: (pageNumber: number) => void;
};

const Paginator: FC<Props> = ({ onPaginationClick, pagesAmount }) => {
  const { pages, pagesCount, currentPage } = usePagination({
    pagesCount: pagesAmount,
    initialState: { currentPage: 1 },
  });
  return (
    <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={onPaginationClick}>
      <PaginationContainer>
        <PaginationPrevious>Previous</PaginationPrevious>
        <PaginationPageGroup>
          {pages.map((page) => (
            <PaginationPage key={`pagination_page_${page}`} page={page} />
          ))}
        </PaginationPageGroup>
        <PaginationNext>Next</PaginationNext>
      </PaginationContainer>
    </Pagination>
  );
};

export default Paginator;
