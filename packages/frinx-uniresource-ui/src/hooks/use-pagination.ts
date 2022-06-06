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

export function usePagination(devicesPerPage = 20): [PaginationArgs, CallbackFunctions] {
  const [state, setState] = useState<PaginationArgs>({
    first: devicesPerPage,
    after: undefined,
    last: undefined,
    before: undefined,
  });
  const firstPage = useCallback(
    () =>
      setState({
        first: devicesPerPage,
        after: undefined,
        last: undefined,
        before: undefined,
      }),
    [devicesPerPage],
  );
  const nextPage = useCallback(
    (cursor: string | null) => () =>
      setState({
        first: devicesPerPage,
        after: cursor,
        last: undefined,
        before: undefined,
      }),
    [devicesPerPage],
  );
  const previousPage = useCallback(
    (cursor: string | null) => () =>
      setState({
        first: undefined,
        after: undefined,
        last: devicesPerPage,
        before: cursor,
      }),
    [devicesPerPage],
  );
  return [state, { nextPage, previousPage, firstPage }];
}
