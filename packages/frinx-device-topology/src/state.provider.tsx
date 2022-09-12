import { unwrap } from '@frinx/shared';
import React, { createContext, Dispatch, FC, Reducer, useContext, useEffect, useMemo, useReducer } from 'react';
import { GraphEdge, GraphNode } from './pages/topology/graph.helpers';
import { setNodesAndEdges, StateAction } from './state.actions';
import { initialState, State, stateReducer } from './state.reducer';

export type StateContextType = {
  dispatch: Dispatch<StateAction>;
  state: State;
};

const StateContext = createContext<StateContextType | null>(null);

export function useStateContext(): StateContextType {
  return unwrap(useContext(StateContext));
}

export type StateProviderProps = {
  data: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
};

const StateProvider: FC<StateProviderProps> = ({ children, data }) => {
  const [state, dispatch] = useReducer<Reducer<State, StateAction>, State>(
    stateReducer,
    initialState,
    () => initialState,
  );

  useEffect(() => {
    const { nodes, edges } = data;
    console.log('useEffect');
    console.log(nodes.filter((n) => n.device.name === 'R1').pop()?.device.position);
    dispatch(setNodesAndEdges({ nodes, edges }));
  }, [data]);

  return (
    <StateContext.Provider
      value={useMemo(
        () => ({
          dispatch,
          state,
        }),
        [state],
      )}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
