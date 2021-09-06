import {  useState,  useRef, useCallback } from 'react';

type PaginationArgs = {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
};

type CallbackFunctions = {
    onResponse: (pageInfo: unknown) => void;
    nextPage: () => void;
    previousPage: () => void;
}

export function usePagination(devicesPerPage = 20): [PaginationArgs, CallbackFunctions] {
  const startCursor = useRef(undefined);
  const endCursor = useRef(undefined);
  const [state, setState] = useState<PaginationArgs>({
    first: devicesPerPage,
    after: undefined,
    last: undefined,
    before: undefined,
  });
  const onResponse = useCallback((pageInfo) => {
    startCursor.current = pageInfo.startCursor;
    endCursor.current = pageInfo.endCursor;
  }, []);
  const nextPage = useCallback(
    () =>
      setState({
        first: devicesPerPage,
        after: endCursor.current,
        last: undefined,
        before: undefined,
      }),
    [devicesPerPage],
  );
  const previousPage = useCallback(
    () =>
      setState({
        first: undefined,
        after: undefined,
        last: devicesPerPage,
        before: startCursor.current,
      }),
    [devicesPerPage],
  );
  return [state, { onResponse, nextPage, previousPage }];
};