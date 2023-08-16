import { Client, gql } from 'urql';
import { GraphEdgeWithDiff } from './helpers/topology-helpers';
import { BackupGraphNode, GraphEdge, GraphNetNode, GraphNode, Position } from './pages/topology/graph.helpers';
import { State, TopologyLayer } from './state.reducer';
import { CustomDispatch } from './use-thunk-reducer';
import {
  NetTopologyQuery,
  NetTopologyQueryVariables,
  TopologyQuery,
  TopologyQueryVariables,
  TopologyVersionDataQuery,
  TopologyVersionDataQueryVariables,
} from './__generated__/graphql';

export type NodesEdgesPayload = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type NetNodesEdgesPayload = {
  nodes: GraphNetNode[];
  edges: GraphEdge[];
};

export type BackupNodesEdgesPayload = {
  nodes: BackupGraphNode[];
  edges: GraphEdge[];
};

export type LabelItem = {
  label: string;
  value: string;
};

export type TopologyMode = 'NORMAL' | 'COMMON_NODES' | 'SHORTEST_PATH';

export type StateAction =
  | {
      type: 'SET_NODES_AND_EDGES';
      payload: NodesEdgesPayload;
    }
  | {
      type: 'UPDATE_NODE_POSITION';
      nodeId: string;
      position: Position;
    }
  | {
      type: 'SET_SELECTED_NODE';
      node: GraphNode | null;
    }
  | {
      type: 'SET_SELECTED_EDGE';
      edge: GraphEdge | null;
    }
  | {
      type: 'SET_SELECTED_LABELS';
      labels: LabelItem[];
    }
  | {
      type: 'SET_SELECTED_VERSION';
      version: string | null;
    }
  | {
      type: 'SET_BACKUP_NODES_AND_EDGES';
      payload: BackupNodesEdgesPayload;
    }
  | {
      type: 'SET_MODE';
      mode: TopologyMode;
    }
  | {
      type: 'SET_UNCONFIRMED_NODE_IDS_TO_FIND_COMMON';
      nodeIds: string[];
    }
  | {
      type: 'ADD_REMOVE_UNCONFIRMED_NODE_ID_FOR_SHORTEST_PATH';
      nodeId: string;
    }
  | {
      type: 'SET_NODE_IDS_TO_FIND_COMMON';
    }
  | {
      type: 'CLEAR_COMMON_SEARCH';
    }
  | {
      type: 'SET_COMMON_NODE_IDS';
      nodeIds: string[];
    }
  | {
      type: 'SET_NET_NODES_AND_EDGES';
      payload: NetNodesEdgesPayload;
    }
  | {
      type: 'SET_TOPOLOGY_LAYER';
      layer: TopologyLayer;
    }
  | {
      type: 'SET_SELECTED_NET_NODE';
      node: GraphNetNode | null;
    }
  | { type: 'CLEAR_SHORTEST_PATH_SEARCH' }
  | {
      type: 'FIND_SHORTEST_PATH';
    }
  // | {
  //     type: 'SET_SHORTEST_PATH_IDS';
  //     pathIds: string[];
  //   }
  | {
      type: 'SET_ALTERNATIVE_PATHS';
      alternativePaths: string[][];
    }
  | {
      type: 'SET_SELECTED_ALTERNATIVE_PATH';
      alternativePathIndex: number;
    }
  | {
      type: 'SET_WEIGHT_VISIBILITY';
      isVisible: boolean;
    };

export type ThunkAction<A extends Record<string, unknown>, S> = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => (dispatch: CustomDispatch<A, S>, getState: (state: S) => S) => void | Promise<void>;

const TOPOLOGY_QUERY = gql`
  query Topology($labels: [String!]) {
    topology(filter: { labels: $labels }) {
      nodes {
        id
        device {
          id
          name
          deviceSize
        }
        deviceType
        softwareVersion
        interfaces {
          id
          status
          name
        }
        coordinates {
          x
          y
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
const NET_TOPOLOGY_QUERY = gql`
  query NetTopology {
    netTopology {
      nodes {
        id
        nodeId
        name
        interfaces {
          id
          name
        }
        networks {
          id
          subnet
          coordinates {
            x
            y
          }
        }
        coordinates {
          x
          y
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

const TOPOLOGY_VERSION_DATA_QUERY = gql`
  query TopologyVersionData($version: String!) {
    topologyVersionData(version: $version) {
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
      nodes {
        id
        name
        interfaces {
          id
          status
          name
        }
        coordinates {
          x
          y
        }
      }
    }
  }
`;

export function setNodesAndEdges(payload: NodesEdgesPayload): StateAction {
  return {
    type: 'SET_NODES_AND_EDGES',
    payload,
  };
}

export function getNodesAndEdges(client: Client, labels: LabelItem[]): ReturnType<ThunkAction<StateAction, State>> {
  return (dispatch) => {
    client
      .query<TopologyQuery, TopologyQueryVariables>(
        TOPOLOGY_QUERY,
        {
          labels: labels.map((l) => l.label),
        },
        {
          requestPolicy: 'network-only',
        },
      )
      .toPromise()
      .then((data) => {
        const { nodes, edges } = data.data?.topology ?? { nodes: [], edges: [] };
        dispatch(setNodesAndEdges({ nodes, edges }));
      });
  };
}

export function setNetNodesAndEdges(payload: NetNodesEdgesPayload): StateAction {
  return {
    type: 'SET_NET_NODES_AND_EDGES',
    payload,
  };
}

export function getNetNodesAndEdges(client: Client): ReturnType<ThunkAction<StateAction, State>> {
  return (dispatch) => {
    client
      .query<NetTopologyQuery, NetTopologyQueryVariables>(
        NET_TOPOLOGY_QUERY,
        {},
        {
          requestPolicy: 'network-only',
        },
      )
      .toPromise()
      .then((data) => {
        const { nodes, edges } = data.data?.netTopology ?? { nodes: [], edges: [] };
        dispatch(setNetNodesAndEdges({ nodes, edges }));
      });
  };
}

export function updateNodePosition(nodeId: string, position: Position): StateAction {
  return {
    type: 'UPDATE_NODE_POSITION',
    nodeId,
    position,
  };
}

export function setSelectedNode(node: GraphNode | null): StateAction {
  return {
    type: 'SET_SELECTED_NODE',
    node,
  };
}

export function setSelectedEdge(edge: GraphEdgeWithDiff | null): StateAction {
  return {
    type: 'SET_SELECTED_EDGE',
    edge,
  };
}

export function setSelectedLabels(labels: LabelItem[]): StateAction {
  return {
    type: 'SET_SELECTED_LABELS',
    labels,
  };
}

export function setSelectedVersion(version: string | null): StateAction {
  return {
    type: 'SET_SELECTED_VERSION',
    version,
  };
}

export function setBackupNodesAndEdges(payload: BackupNodesEdgesPayload): StateAction {
  return {
    type: 'SET_BACKUP_NODES_AND_EDGES',
    payload,
  };
}

export function getBackupNodesAndEdges(client: Client, version: string): ReturnType<ThunkAction<StateAction, State>> {
  return (dispatch) => {
    client
      .query<TopologyVersionDataQuery, TopologyVersionDataQueryVariables>(
        TOPOLOGY_VERSION_DATA_QUERY,
        {
          version,
        },
        {
          requestPolicy: 'network-only',
        },
      )
      .toPromise()
      .then((data) => {
        dispatch(
          setBackupNodesAndEdges({
            nodes: data.data?.topologyVersionData.nodes ?? [],
            edges: data.data?.topologyVersionData.edges ?? [],
          }),
        );
      });
  };
}

export function setUnconfirmedSelectedNodeIdsToFindCommonNode(nodeIds: string[]): StateAction {
  return {
    type: 'SET_UNCONFIRMED_NODE_IDS_TO_FIND_COMMON',
    nodeIds,
  };
}

export function addRemoveUnconfirmedNodeIdForShortestPath(nodeId: string): StateAction {
  return {
    type: 'ADD_REMOVE_UNCONFIRMED_NODE_ID_FOR_SHORTEST_PATH',
    nodeId,
  };
}

export function setSelectedNodeIdsToFindCommonNode(): StateAction {
  return {
    type: 'SET_NODE_IDS_TO_FIND_COMMON',
  };
}

export function setMode(mode: TopologyMode): StateAction {
  return {
    type: 'SET_MODE',
    mode,
  };
}

export function clearCommonSearch(): StateAction {
  return {
    type: 'CLEAR_COMMON_SEARCH',
  };
}

export function setCommonNodeIds(nodeIds: string[]): StateAction {
  return {
    type: 'SET_COMMON_NODE_IDS',
    nodeIds,
  };
}

export function setTopologyLayer(layer: TopologyLayer): StateAction {
  return {
    type: 'SET_TOPOLOGY_LAYER',
    layer,
  };
}

export function setSelectedNetNode(node: GraphNetNode): StateAction {
  return {
    type: 'SET_SELECTED_NET_NODE',
    node,
  };
}

export function clearShortestPathSearch(): StateAction {
  return {
    type: 'CLEAR_SHORTEST_PATH_SEARCH',
  };
}

export function findShortestPath(): StateAction {
  return { type: 'FIND_SHORTEST_PATH' };
}

// export function setShortestPathIds(pathIds: string[]): StateAction {
//   return { type: 'SET_SHORTEST_PATH_IDS', pathIds };
// }

export function setAlternativePaths(alternativePaths: string[][]): StateAction {
  return { type: 'SET_ALTERNATIVE_PATHS', alternativePaths };
}

export function setSelectedAlternativePath(alternativePathIndex: number): StateAction {
  return { type: 'SET_SELECTED_ALTERNATIVE_PATH', alternativePathIndex };
}

export function setWeightVisibility(isVisible: boolean): StateAction {
  return {
    type: 'SET_WEIGHT_VISIBILITY',
    isVisible,
  };
}
