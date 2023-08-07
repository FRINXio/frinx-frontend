import { useState, useCallback } from 'react';

type PaginationArgs = {
  first?: number;
  after?: string | null;
  last?: number;
  before?: string | null;
};

type CallbackFunctions = {
  nextPage: (cursor: string | null) => () => void;
  previousPage: (cursor: string | null) => () => void;
  firstPage: () => void;
};

export function usePagination(itemsPerPage = 5): [PaginationArgs, CallbackFunctions] {
  const [state, setState] = useState<PaginationArgs>({
    first: itemsPerPage,
    after: undefined,
    last: undefined,
    before: undefined,
  });
  const firstPage = useCallback(
    () =>
      setState({
        first: itemsPerPage,
        after: undefined,
        last: undefined,
        before: undefined,
      }),
    [itemsPerPage],
  );
  const nextPage = useCallback(
    (cursor: string | null) => () =>
      setState({
        first: itemsPerPage,
        after: cursor,
        last: undefined,
        before: undefined,
      }),
    [itemsPerPage],
  );
  const previousPage = useCallback(
    (cursor: string | null) => () =>
      setState({
        first: undefined,
        after: undefined,
        last: itemsPerPage,
        before: cursor,
      }),
    [itemsPerPage],
  );
  return [state, { nextPage, previousPage, firstPage }];
}
