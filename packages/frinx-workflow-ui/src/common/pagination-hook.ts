import * as React from 'react';

export type UsePaginationReturn<T> = {
  setItemList: (newItems: Array<T>) => void;
  isPaginating: boolean;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageItems: T[];
  totalPages: number;
  totalItemsAmount: number;
  itemCount: number;
  maxItemsPerPage: number;
  setTotalItemsAmount: React.Dispatch<React.SetStateAction<number>>;
};

const displayItem = (currentPage: number, maxPerPage: number, index: number) => {
  const currentPageStart = (currentPage - 1) * maxPerPage + 1;
  const currentPageEnd = currentPage * maxPerPage;

  if (index + 1 >= currentPageStart && index + 1 <= currentPageEnd) {
    return true;
  }

  return false;
};

export function usePagination<T>(itemList: Array<T>, maxItemsPerPage: number): UsePaginationReturn<T> {
  const [items, setItems] = React.useState(itemList);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalItemsAmount, setTotalItemsAmount] = React.useState(itemList.length);

  const isPaginating = items.length > maxItemsPerPage;
  const totalPages = Math.ceil(totalItemsAmount / maxItemsPerPage);
  const itemCount = items.length;

  const pageItems = items.filter((_, index) => {
    if (!isPaginating) {
      return true;
    }

    if (!displayItem(currentPage, maxItemsPerPage, index)) {
      return false;
    }

    return true;
  });

  const setItemList = React.useCallback((newItems: Array<T>) => {
    setItems(newItems);
  }, []);

  return {
    setItemList,
    isPaginating,
    currentPage,
    setCurrentPage,
    pageItems,
    totalPages,
    itemCount,
    maxItemsPerPage,
    setTotalItemsAmount,
    totalItemsAmount,
  };
}
