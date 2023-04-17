import { unwrap } from '@frinx/shared/src';
import React, { createContext, FC, useContext, useMemo } from 'react';
import useThunkReducer, { CustomDispatch } from './use-thunk-reducer';
import { StateAction } from './state.actions';
import { initialState, State, stateReducer } from './state.reducer';

export type StateContextType = {
  dispatch: CustomDispatch<StateAction, State>;
  state: State;
};

const StateContext = createContext<StateContextType | null>(null);

export function useStateContext(): StateContextType {
  return unwrap(useContext(StateContext));
}

const StateProvider: FC = ({ children }) => {
  const [state, dispatch] = useThunkReducer<StateAction, State>(stateReducer, initialState, () => initialState);

  return (
    <StateContext.Provider
      value={useMemo(
        () => ({
          dispatch,
          state,
        }),
        [state, dispatch],
      )}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
