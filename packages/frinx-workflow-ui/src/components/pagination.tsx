import React, { FC } from 'react';
import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
} from '@ajna/pagination';

type Props = {
  currentPage: number;
  pagesCount: number;
  showPageNumbers?: boolean;
  onPaginationClick: (pageNumber: number) => void;
};

const Paginator: FC<Props> = ({ onPaginationClick, pagesCount, currentPage, showPageNumbers = true }) => {
  const pages = Array.from(new Array(pagesCount)).map((_, i) => i + 1);

  return (
    <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={onPaginationClick}>
      <PaginationContainer>
        <PaginationPrevious>Previous</PaginationPrevious>
        {showPageNumbers ? (
          <PaginationPageGroup marginX={5}>
            {pages.map((page) => {
              if (page === currentPage || (page <= currentPage + 2 && page >= currentPage - 2)) {
                return (
                  <PaginationPage
                    key={`pagination_page_${page}`}
                    page={page}
                    paddingX={5}
                    isActive={page === currentPage}
                  />
                );
              }

              return null;
            })}
          </PaginationPageGroup>
        ) : null}
        <PaginationNext>Next</PaginationNext>
      </PaginationContainer>
    </Pagination>
  );
};

export default Paginator;
