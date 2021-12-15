import { SetStateAction, useState } from 'react';

type PaginationState = {
  pageSize: number;
  pageCount: number;
  page: number;
};

const PAGE_SIZE = 1;

const INITIAL_STATE = {
  page: 1,
  pageCount: 1,
  pageSize: PAGE_SIZE,
};

export default function usePagination(): [PaginationState, React.Dispatch<SetStateAction<PaginationState>>] {
  const [state, setState] = useState<PaginationState>(INITIAL_STATE);

  return [state, setState];
}
