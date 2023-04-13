import { Reducer, useCallback, useRef, useState } from 'react';
import { ThunkAction } from './state.actions';

export type CustomDispatch<A extends Record<string, unknown>, S> = (action: A | ReturnType<ThunkAction<A, S>>) => void;

export function useThunkReducer<A extends Record<string, unknown>, S>(
  reducer: Reducer<S, A>,
  initialArg: S,
  init = (a: S) => a,
): [state: S, dispatch: CustomDispatch<A, S>] {
  const [hookState, setHookState] = useState(() => init(initialArg));

  const state = useRef(hookState);
  const getState = useCallback(() => state.current, [state]);
  const setState = useCallback(
    (newState) => {
      state.current = newState;
      setHookState(newState);
    },
    [state, setHookState],
  );

  const reduce = useCallback(
    (action) => {
      return reducer(getState(), action);
    },
    [reducer, getState],
  );

  const dispatch: CustomDispatch<A, S> = useCallback(
    (action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }
      return setState(reduce(action));
    },
    [getState, setState, reduce],
  );

  return [hookState, dispatch];
}

export default useThunkReducer;
