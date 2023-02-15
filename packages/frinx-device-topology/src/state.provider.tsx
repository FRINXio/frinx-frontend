import { unwrap } from '@frinx/shared/src';
import React, { createContext, Dispatch, FC, Reducer, useContext, useEffect, useMemo, useReducer } from 'react';
import { gql, useClient } from 'urql';
import { setNodesAndEdges, StateAction } from './state.actions';
import { initialState, State, stateReducer } from './state.reducer';
import { TopologyQuery, TopologyQueryVariables } from './__generated__/graphql';

const TOPOLOGY_QUERY = gql`
  query Topology($labels: [String!]) {
    topology(filter: { labels: $labels }) {
      nodes {
        id
        device {
          id
          name
          deviceSize
          position {
            x
            y
          }
        }
        deviceType
        softwareVersion
        interfaces {
          id
          status
        }
      }
      edges {
        id
        source {
          nodeId
          interface
        }
        target {
          nodeId
          interface
        }
      }
    }
  }
`;

export type StateContextType = {
  dispatch: Dispatch<StateAction>;
  state: State;
};

const StateContext = createContext<StateContextType | null>(null);

export function useStateContext(): StateContextType {
  return unwrap(useContext(StateContext));
}

const StateProvider: FC = ({ children }) => {
  const client = useClient();
  const [state, dispatch] = useReducer<Reducer<State, StateAction>, State>(
    stateReducer,
    initialState,
    () => initialState,
  );

  const { selectedLabels, selectedVersion } = state;

  useEffect(() => {
    client
      .query<TopologyQuery, TopologyQueryVariables>(TOPOLOGY_QUERY, {
        labels: selectedVersion ? [] : selectedLabels.map((l) => l.label),
      })
      .toPromise()
      .then((data) => {
        const { nodes, edges } = data.data?.topology ?? { nodes: [], edges: [] };
        dispatch(setNodesAndEdges({ nodes, edges }));
      });
  }, [client, selectedLabels, selectedVersion]);

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
