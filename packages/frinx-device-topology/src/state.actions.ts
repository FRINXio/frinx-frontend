import { Client, gql } from 'urql';
import { GraphEdgeWithDiff } from './helpers/topology-helpers';
import {
  BackupGraphNode,
  BackupNetGraphNode,
  GraphEdge,
  GraphNetNode,
  GraphNode,
  Position,
} from './pages/topology/graph.helpers';
import { ShortestPath, State, TopologyLayer } from './state.reducer';
import { CustomDispatch } from './use-thunk-reducer';
import {
  NetTopologyQuery,
  NetTopologyQueryVariables,
  NetTopologyVersionDataQuery,
  NetTopologyVersionDataQueryVariables,
  PtpGraphNode,
  PtpTopologyQuery,
  PtpTopologyQueryVariables,
  PtpTopologyVersionDataQuery,
  PtpTopologyVersionDataQueryVariables,
  SynceGraphNode,
  SynceTopologyQuery,
  SynceTopologyQueryVariables,
  SynceTopologyVersionDataQuery,
  SynceTopologyVersionDataQueryVariables,
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

export type PtpNodesEdgesPayload = {
  nodes: PtpGraphNode[];
  edges: GraphEdge[];
};

export type SynceNodesEdgesPayload = {
  nodes: SynceGraphNode[];
  edges: GraphEdge[];
};

export type BackupNodesEdgesPayload = {
  nodes: BackupGraphNode[];
  edges: GraphEdge[];
};

export type BackupNetNodesEdgesPayload = {
  nodes: BackupNetGraphNode[];
  edges: GraphEdge[];
};

export type LabelItem = {
  label: string;
  value: string;
};

export type TopologyMode = 'NORMAL' | 'COMMON_NODES' | 'SHORTEST_PATH' | 'GM_PATH';

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
      type: 'UPDATE_PTP_NODE_POSITION';
      nodeId: string;
      position: Position;
    }
  | {
      type: 'UPDATE_SYNCE_NODE_POSITION';
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
      type: 'SET_PTP_BACKUP_NODES_AND_EDGES';
      payload: BackupNodesEdgesPayload;
    }
  | {
      type: 'SET_SYNCE_BACKUP_NODES_AND_EDGES';
      payload: BackupNodesEdgesPayload;
    }
  | {
      type: 'SET_NET_BACKUP_NODES_AND_EDGES';
      payload: BackupNetNodesEdgesPayload;
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
      type: 'SET_PTP_NODES_AND_EDGES';
      payload: PtpNodesEdgesPayload;
    }
  | {
      type: 'SET_TOPOLOGY_LAYER';
      layer: TopologyLayer;
    }
  | {
      type: 'SET_SELECTED_NET_NODE';
      node: GraphNetNode | null;
    }
  | {
      type: 'SET_SELECTED_PTP_NODE';
      node: PtpGraphNode | null;
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
      alternativePaths: ShortestPath;
    }
  | {
      type: 'SET_SELECTED_ALTERNATIVE_PATH';
      alternativePathIndex: number;
    }
  | {
      type: 'SET_WEIGHT_VISIBILITY';
      isVisible: boolean;
    }
  | {
      type: 'SET_UNCONFIRMED_GM_NODE_ID';
      nodeId: string | null;
    }
  | {
      type: 'FIND_GM_PATH';
    }
  | {
      type: 'CLEAR_GM_PATH';
    }
  | { type: 'SET_GM_PATH_IDS'; nodeIds: string[] }
  | {
      type: 'SET_SYNCE_NODES_AND_EDGES';
      payload: SynceNodesEdgesPayload;
    }
  | {
      type: 'SET_SELECTED_SYNCE_NODE';
      node: SynceGraphNode | null;
    }
  | {
      type: 'SET_SYNCE_NODES_AND_EDGES';
      payload: SynceNodesEdgesPayload;
    }
  | {
      type: 'SET_SYNCE_DIFF_VISIBILITY';
      isVisible: boolean;
    }
  | { type: 'PAN_TOPOLOGY'; panDelta: Position }
  | { type: 'ZOOM_TOPOLOGY'; zoomDelta: number };

export type ThunkAction<A extends Record<string, unknown>, S> = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => (dispatch: CustomDispatch<A, S>, getState: (state: S) => S) => void | Promise<void>;

const TOPOLOGY_QUERY = gql`
  query Topology($labels: [String!]) {
    deviceInventory {
      topology(filter: { labels: $labels }) {
        nodes {
          id
          name
          device {
            id
            name
            isInstalled
            createdAt
            serviceState
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
  }
`;
const NET_TOPOLOGY_QUERY = gql`
  query NetTopology {
    deviceInventory {
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
          weight
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
  }
`;

const TOPOLOGY_VERSION_DATA_QUERY = gql`
  query TopologyVersionData($version: String!) {
    deviceInventory {
      phyTopologyVersionData(version: $version) {
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
  }
`;

const PTP_TOPOLOGY_VERSION_DATA_QUERY = gql`
  query PtpTopologyVersionData($version: String!) {
    deviceInventory {
      ptpTopologyVersionData(version: $version) {
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
  }
`;

const SYNCE_TOPOLOGY_VERSION_DATA_QUERY = gql`
  query SynceTopologyVersionData($version: String!) {
    deviceInventory {
      synceTopologyVersionData(version: $version) {
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
  }
`;

const NET_TOPOLOGY_VERSION_DATA_QUERY = gql`
  query NetTopologyVersionData($version: String!) {
    deviceInventory {
      netTopologyVersionData(version: $version) {
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
  }
`;

const PTP_TOPOLOGY_QUERY = gql`
  query PtpTopology {
    deviceInventory {
      ptpTopology {
        nodes {
          id
          nodeId
          name
          interfaces {
            id
            status
            name
            details {
              ptpStatus
              adminOperStatus
              ptsfUnusable
            }
          }
          coordinates {
            x
            y
          }
          ptpDeviceDetails {
            clockType
            domain
            ptpProfile
            clockId
            parentClockId
            gmClockId
            clockClass
            clockAccuracy
            clockVariance
            timeRecoveryStatus
            globalPriority
            userPriority
          }
          status
          labels
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
          weight
        }
      }
    }
  }
`;

const SYNCE_TOPOLOGY_QUERY = gql`
  query SynceTopology {
    deviceInventory {
      synceTopology {
        nodes {
          id
          nodeId
          name
          interfaces {
            id
            name
            status
            details {
              synceEnabled
              rxQualityLevel
              qualifiedForUse
              notQualifiedDueTo
              notSelectedDueTo
            }
          }
          coordinates {
            x
            y
          }
          status
          labels
          synceDeviceDetails {
            selectedForUse
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
          weight
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
        const { nodes, edges } = data.data?.deviceInventory.topology ?? { nodes: [], edges: [] };
        // we need to supply edges with null weight
        const edgesWithWeight = edges.map((e) => ({
          ...e,
          weight: null,
        }));
        dispatch(setNodesAndEdges({ nodes, edges: edgesWithWeight }));
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
        const { nodes, edges } = data.data?.deviceInventory.netTopology ?? { nodes: [], edges: [] };
        dispatch(setNetNodesAndEdges({ nodes, edges }));
      });
  };
}

export function setPtpNodesAndEdges(payload: PtpNodesEdgesPayload): StateAction {
  return {
    type: 'SET_PTP_NODES_AND_EDGES',
    payload,
  };
}

export function getPtpNodesAndEdges(client: Client): ReturnType<ThunkAction<StateAction, State>> {
  return (dispatch) => {
    client
      .query<PtpTopologyQuery, PtpTopologyQueryVariables>(
        PTP_TOPOLOGY_QUERY,
        {},
        {
          requestPolicy: 'network-only',
        },
      )
      .toPromise()
      .then((data) => {
        const { nodes, edges } = data.data?.deviceInventory.ptpTopology ?? { nodes: [], edges: [] };
        dispatch(setPtpNodesAndEdges({ nodes, edges }));
      });
  };
}

export function setSynceNodesAndEdges(payload: SynceNodesEdgesPayload): StateAction {
  return {
    type: 'SET_SYNCE_NODES_AND_EDGES',
    payload,
  };
}

export function getSynceNodesAndEdges(client: Client): ReturnType<ThunkAction<StateAction, State>> {
  return (dispatch) => {
    client
      .query<SynceTopologyQuery, SynceTopologyQueryVariables>(
        SYNCE_TOPOLOGY_QUERY,
        {},
        {
          requestPolicy: 'network-only',
        },
      )
      .toPromise()
      .then((data) => {
        const { nodes, edges } = data.data?.deviceInventory.synceTopology ?? { nodes: [], edges: [] };
        dispatch(setSynceNodesAndEdges({ nodes, edges }));
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

export function updatePtpNodePosition(nodeId: string, position: Position): StateAction {
  return {
    type: 'UPDATE_PTP_NODE_POSITION',
    nodeId,
    position,
  };
}

export function updateSynceNodePosition(nodeId: string, position: Position): StateAction {
  return {
    type: 'UPDATE_SYNCE_NODE_POSITION',
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

export function setNetBackupNodesAndEdges(payload: BackupNetNodesEdgesPayload): StateAction {
  return {
    type: 'SET_NET_BACKUP_NODES_AND_EDGES',
    payload,
  };
}

export function setPtpBackupNodesAndEdges(payload: BackupNodesEdgesPayload): StateAction {
  return {
    type: 'SET_PTP_BACKUP_NODES_AND_EDGES',
    payload,
  };
}

export function setSynceBackupNodesAndEdges(payload: BackupNodesEdgesPayload): StateAction {
  return {
    type: 'SET_SYNCE_BACKUP_NODES_AND_EDGES',
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
            nodes: data.data?.deviceInventory.phyTopologyVersionData.nodes ?? [],
            edges:
              data.data?.deviceInventory.phyTopologyVersionData.edges.map((e) => ({
                ...e,
                weight: null,
              })) ?? [],
          }),
        );
      });
  };
}

export function getPtpBackupNodesAndEdges(
  client: Client,
  version: string,
): ReturnType<ThunkAction<StateAction, State>> {
  return (dispatch) => {
    client
      .query<PtpTopologyVersionDataQuery, PtpTopologyVersionDataQueryVariables>(
        PTP_TOPOLOGY_VERSION_DATA_QUERY,
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
          setPtpBackupNodesAndEdges({
            nodes: data.data?.deviceInventory.ptpTopologyVersionData.nodes ?? [],
            edges:
              data.data?.deviceInventory.ptpTopologyVersionData.edges.map((e) => ({
                ...e,
                weight: null,
              })) ?? [],
          }),
        );
      });
  };
}

export function getSynceBackupNodesAndEdges(
  client: Client,
  version: string,
): ReturnType<ThunkAction<StateAction, State>> {
  return (dispatch) => {
    client
      .query<SynceTopologyVersionDataQuery, SynceTopologyVersionDataQueryVariables>(
        SYNCE_TOPOLOGY_VERSION_DATA_QUERY,
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
          setSynceBackupNodesAndEdges({
            nodes: data.data?.deviceInventory.synceTopologyVersionData.nodes ?? [],
            edges:
              data.data?.deviceInventory.synceTopologyVersionData.edges.map((e) => ({
                ...e,
                weight: null,
              })) ?? [],
          }),
        );
      });
  };
}

export function getNetBackupNodesAndEdges(
  client: Client,
  version: string,
): ReturnType<ThunkAction<StateAction, State>> {
  return (dispatch) => {
    client
      .query<NetTopologyVersionDataQuery, NetTopologyVersionDataQueryVariables>(
        NET_TOPOLOGY_VERSION_DATA_QUERY,
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
          setNetBackupNodesAndEdges({
            nodes: data.data?.deviceInventory.netTopologyVersionData.nodes ?? [],
            edges:
              data.data?.deviceInventory.netTopologyVersionData.edges.map((e) => ({
                ...e,
                weight: null,
              })) ?? [],
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

export function setSelectedPtpNode(node: PtpGraphNode): StateAction {
  return {
    type: 'SET_SELECTED_PTP_NODE',
    node,
  };
}

export function setSelectedSynceNode(node: SynceGraphNode): StateAction {
  return {
    type: 'SET_SELECTED_SYNCE_NODE',
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

export function setAlternativePaths(alternativePaths: ShortestPath): StateAction {
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

export function setSynceDiffVisibility(isVisible: boolean): StateAction {
  return {
    type: 'SET_SYNCE_DIFF_VISIBILITY',
    isVisible,
  };
}

export function setUnconfimedNodeIdForGmPathSearch(nodeId: string): StateAction {
  return {
    type: 'SET_UNCONFIRMED_GM_NODE_ID',
    nodeId,
  };
}

export function findGmPath(): StateAction {
  return {
    type: 'FIND_GM_PATH',
  };
}

export function clearGmPathSearch(): StateAction {
  return {
    type: 'CLEAR_GM_PATH',
  };
}

export function setGmPathIds(nodeIds: string[]): StateAction {
  return {
    type: 'SET_GM_PATH_IDS',
    nodeIds,
  };
}

export function panTopology(panDelta: Position): StateAction {
  return {
    type: 'PAN_TOPOLOGY',
    panDelta,
  };
}

export function zoomTopology(zoomDelta: number): StateAction {
  return {
    type: 'ZOOM_TOPOLOGY',
    zoomDelta,
  };
}
