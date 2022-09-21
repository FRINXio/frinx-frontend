import * as React from 'react';

const displayItem = (currentPage: number, maxPerPage: number, index: number) => {
  const currentPageStart = (currentPage - 1) * maxPerPage + 1;
  const currentPageEnd = currentPage * maxPerPage;

  if (index + 1 >= currentPageStart && index + 1 <= currentPageEnd) {
    return true;
  }

  return false;
};

export function usePagination<T>(itemList: Array<T>, maxItemsPerPage: number) {
  const [items, setItems] = React.useState(itemList);
  const [currentPage, setCurrentPage] = React.useState(1);

  const isPaginating = items.length > maxItemsPerPage;
  const totalPages = Math.ceil(items.length / maxItemsPerPage);
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

  const setItemList = (newItems: Array<T>) => {
    setCurrentPage(1);
    setItems(newItems);
  };

  return {
    setItemList,
    isPaginating,
    currentPage,
    setCurrentPage,
    pageItems,
    totalPages,
    itemCount,
    maxItemsPerPage,
  };
}
