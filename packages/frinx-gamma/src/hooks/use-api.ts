import { useState, useEffect } from 'react';

export type UseApiState<T> =
  | {
      isLoading: true;
      data: null;
      error: null;
    }
  | {
      isLoading: false;
      data: T;
      error: null;
    }
  | {
      isLoading: false;
      data: null;
      error: string;
    };

const INITIAL_STATE = {
  isLoading: true as const,
  data: null,
  error: null,
};

export default function useApi<T>(callback: () => Promise<T>): UseApiState<T> {
  const [state, setState] = useState<UseApiState<T>>(INITIAL_STATE);

  useEffect(() => {
    callback()
      .then((data) => {
        setState({
          isLoading: false,
          data,
          error: null,
        });
      })
      .catch((err) => {
        setState({
          isLoading: false,
          data: null,
          error: String(err),
        });
      });
  }, [state, setState, callback]);

  return state;
}
