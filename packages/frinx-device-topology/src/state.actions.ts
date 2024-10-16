import { omitNullValue } from '@frinx/shared';
import { Client, gql } from 'urql';
import { GraphEdgeWithDiff } from './helpers/topology-helpers';
import {
  BackupGraphNode,
  BackupNetGraphNode,
  GraphEdge,
  GraphNetNode,
  GraphNode,
  PtpGraphNode,
  Position,
  SynceGraphNode,
  MplsGraphNode,
  MplsGraphNodeDetails,
  DeviceMetadata,
  LspCount,
  MapDeviceNeighbors,
} from './pages/topology/graph.helpers';
import { LspPathMetadata, ShortestPath, State, TopologyLayer } from './state.reducer';
import { CustomDispatch } from './use-thunk-reducer';
import {
  DevicesTopologyQuery,
  DevicesTopologyQueryVariables,
  FilterDevicesMetadatasInput,
  FilterNeighborInput,
  GeoMapDataQueryQuery,
  GeoMapDataQueryQueryVariables,
  InventoryMplsDeviceDetails,
  MplsTopologyQuery,
  MplsTopologyQueryVariables,
  MplsTopologyVersionDataQuery,
  MplsTopologyVersionDataQueryVariables,
  NeighboursQuery,
  NeighboursQueryVariables,
  NetTopologyQuery,
  NetTopologyQueryVariables,
  NetTopologyVersionDataQuery,
  NetTopologyVersionDataQueryVariables,
  PtpTopologyQuery,
  PtpTopologyQueryVariables,
  PtpTopologyVersionDataQuery,
  PtpTopologyVersionDataQueryVariables,
  RefreshCoordinatesMutation,
  RefreshCoordinatesMutationVariables,
  SynceTopologyQuery,
  SynceTopologyQueryVariables,
  SynceTopologyVersionDataQuery,
  SynceTopologyVersionDataQueryVariables,
  TopologyQuery,
  TopologyQueryVariables,
  TopologyType,
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

export type MplsNodesEdgesPayload = {
  nodes: MplsGraphNode[];
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

export type SetDeviceUsagePayload = {
  cpuLoad: number | null;
  memoryLoad: number | null;
};

export type TopologiesOfDevice = {
  deviceId: string;
  topologyId: string;
}[];

export type NodesPositionsPayload = {
  nodes: NodePosition[];
  topologyLayer: TopologyLayer;
};

export type NodePosition = {
  nodeId: string;
  position: Position;
};

export type TopologyMode = 'NORMAL' | 'COMMON_NODES' | 'SHORTEST_PATH' | 'GM_PATH' | 'LSP_PATH';

export type MapTopologyType =
  | 'PHYSICAL_TOPOLOGY'
  | 'PTP_TOPOLOGY'
  | 'ETH_TOPOLOGY'
  | 'NETWORK_TOPOLOGY'
  | 'MPLS_TOPOLOGY'
  | null;

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
      type: 'UPDATE_MPLS_NODE_POSITION';
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
      type: 'SET_MPLS_BACKUP_NODES_AND_EDGES';
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
      type: 'SET_MAP_TOPOLOGY_TYPE';
      mapTopologyType: MapTopologyType;
    }
  | {
      type: 'SET_MAP_TOPOLOGY_DEVICE_SEARCH';
      mapTopologyDeviceSearch: string | null;
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
      type: 'SET_SELECTED_MAP_DEVICE_NAME';
      deviceName: string | null;
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
      type: 'SET_UNCONFIRMED_LSP_NODE_ID';
      nodeId: string | null;
      lspId: string | null;
    }
  | {
      type: 'FIND_LSP_PATH';
    }
  | {
      type: 'CLEAR_LSP_PATH';
    }
  | { type: 'SET_LSP_PATH'; nodeIds: string[]; metadata: LspPathMetadata | null }
  | {
      type: 'SET_SYNCE_NODES_AND_EDGES';
      payload: SynceNodesEdgesPayload;
    }
  | {
      type: 'SET_TOPOLOGIES_OF_DEVICE';
      topologies: TopologiesOfDevice;
    }
  | {
      type: 'SET_SELECTED_SYNCE_NODE';
      node: SynceGraphNode | null;
    }
  | {
      type: 'SET_MPLS_NODES_AND_EDGES';
      payload: MplsNodesEdgesPayload;
    }
  | {
      type: 'SET_SELECTED_MPLS_NODE';
      node: MplsGraphNode | null;
    }
  | {
      type: 'SET_SYNCE_NODES_AND_EDGES';
      payload: SynceNodesEdgesPayload;
    }
  | {
      type: 'SET_DEVICES_METADATA';
      payload: DeviceMetadata[];
    }
  | {
      type: 'SET_MAP_DEVICE_NEIGHBORS';
      payload: MapDeviceNeighbors[];
    }
  | {
      type: 'SET_SYNCE_DIFF_VISIBILITY';
      isVisible: boolean;
    }
  | { type: 'PAN_TOPOLOGY'; panDelta: Position }
  | { type: 'ZOOM_TOPOLOGY'; zoomDelta: number }
  | {
      type: 'SET_SELECTED_NODE_USAGE';
      payload: {
        deviceName: string;
        deviceUsage?: SetDeviceUsagePayload | null;
      };
    }
  | {
      type: 'SET_LSP_COUNTS';
      lspCounts: LspCount[];
    }
  | {
      type: 'REFRESH_COORDINATES';
      payload: NodesPositionsPayload;
    };

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

const MPLS_TOPOLOGY_VERSION_DATA_QUERY = gql`
  query MplsTopologyVersionData($version: String!) {
    deviceInventory {
      mplsTopologyVersionData(version: $version) {
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

const NET_TOPOLOGY_QUERY = gql`
  query NetTopology {
    deviceInventory {
      netTopology {
        nodes {
          id
          phyDeviceName
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

const NET_TOPOLOGY_VERSION_DATA_QUERY = gql`
  query NetTopologyVersionData($version: String!) {
    deviceInventory {
      netTopologyVersionData(version: $version) {
        nodes {
          id
          name
          phyDeviceName
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

const MPLS_TOPOLOGY_QUERY = gql`
  query MplsTopology {
    deviceInventory {
      mplsTopology {
        nodes {
          id
          nodeId
          name
          interfaces {
            id
            name
            status
          }
          coordinates {
            x
            y
          }
          status
          labels
          mplsDeviceDetails {
            lspTunnels {
              lspId
              fromDevice
              toDevice
              uptime
              signalization
            }
            mplsData {
              lspId
              inputLabel
              inputInterface
              outputLabel
              outputInterface
              operState
              ldpPrefix
              mplsOperation
            }
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

const GEOMAP_DATA_QUERY = gql`
  query GeoMapDataQuery($filter: FilterDevicesMetadatasInput) {
    deviceInventory {
      deviceMetadata(filter: $filter) {
        nodes {
          id
          deviceName
          locationName
          geolocation {
            latitude
            longitude
          }
        }
      }
    }
  }
`;

const MAP_NEIGHBORS_QUERY = gql`
  query Neighbours($filter: FilterNeighborInput) {
    deviceInventory {
      deviceNeighbor(filter: $filter) {
        neighbors {
          deviceName
          deviceId
        }
      }
    }
  }
`;

const TOPOLOGIES_OF_DEVICE_QUERY = gql`
  query DevicesTopology($deviceName: String!) {
    deviceInventory {
      devicesTopology(deviceName: $deviceName) {
        topologies {
          deviceId
          topologyId
        }
      }
    }
  }
`;

const REFRESH_COORDINATES = gql`
  mutation RefreshCoordinates($topologyType: TopologyType) {
    topologyDiscovery {
      refreshCoordinates(topologyType: $topologyType) {
        nodes {
          nodeId
          x
          y
        }
      }
    }
  }
`;

export function setCoordinates(payload: NodesPositionsPayload): StateAction {
  return {
    type: 'REFRESH_COORDINATES',
    payload,
  };
}

export function refreshCoordinates(
  client: Client,
  topologyLayer: TopologyLayer,
  topologyType: TopologyType,
): ReturnType<ThunkAction<StateAction, State>> {
  return (dispatch) => {
    client
      .mutation<RefreshCoordinatesMutation, RefreshCoordinatesMutationVariables>(
        REFRESH_COORDINATES,
        {
          topologyType,
        },
        {
          requestPolicy: 'network-only',
        },
      )
      .toPromise()
      .then((data) => {
        const nodes: NodesPositionsPayload = {
          nodes: (data.data?.topologyDiscovery.refreshCoordinates?.nodes ?? []).map((node) => ({
            nodeId: node.nodeId,
            position: { x: node.x, y: node.y },
          })),
          topologyLayer,
        };
        dispatch(setCoordinates(nodes));
      });
  };
}

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
        const ptpNodes = nodes.map((n) => ({
          ...n,
          details: n.ptpDeviceDetails,
        }));
        dispatch(setPtpNodesAndEdges({ nodes: ptpNodes, edges }));
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
        const synceNodes: SynceGraphNode[] = nodes.map((n) => {
          const nodeInterfaces = n.interfaces.map((i) => ({
            ...i,
            details: {
              qualifiedForUse: i.details?.qualifiedForUse ?? null,
              rxQualityLevel: i.details?.rxQualityLevel ?? null,
              isSynceEnabled: i.details?.synceEnabled ?? false,
              notQualifiedDueTo: i.details?.notQualifiedDueTo ?? null,
              notSelectedDueTo: i.details?.notSelectedDueTo ?? null,
            },
          }));
          return {
            ...n,
            interfaces: nodeInterfaces,
            details: {
              selectedForUse: n.synceDeviceDetails.selectedForUse,
            },
          };
        });
        dispatch(setSynceNodesAndEdges({ nodes: synceNodes, edges }));
      });
  };
}

export function setMplsNodesAndEdges(payload: MplsNodesEdgesPayload): StateAction {
  return {
    type: 'SET_MPLS_NODES_AND_EDGES',
    payload,
  };
}

function getMplsDetails(mplsDetails: InventoryMplsDeviceDetails): MplsGraphNodeDetails {
  const { mplsData, lspTunnels } = mplsDetails;

  return {
    mplsData: mplsData?.filter(omitNullValue) ?? [],
    lspTunnels: lspTunnels?.filter(omitNullValue) ?? [],
  };
}

export function getMplsNodesAndEdges(client: Client): ReturnType<ThunkAction<StateAction, State>> {
  return (dispatch) => {
    client
      .query<MplsTopologyQuery, MplsTopologyQueryVariables>(
        MPLS_TOPOLOGY_QUERY,
        {},
        {
          requestPolicy: 'network-only',
        },
      )
      .toPromise()
      .then((data) => {
        const { nodes, edges } = data.data?.deviceInventory.mplsTopology ?? { nodes: [], edges: [] };
        const mplsNodes: MplsGraphNode[] = nodes.map((n) => {
          const nodeInterfaces = n.interfaces.map((i) => ({
            ...i,
          }));
          return {
            ...n,
            details: getMplsDetails(n.mplsDeviceDetails),
            interfaces: nodeInterfaces,
          };
        });
        dispatch(setMplsNodesAndEdges({ nodes: mplsNodes, edges }));
      });
  };
}

export function setDeviceMetadata(payload: DeviceMetadata[]): StateAction {
  return {
    type: 'SET_DEVICES_METADATA',
    payload,
  };
}

export function getDeviceMetadata(
  client: Client,
  filter: FilterDevicesMetadatasInput,
): ReturnType<ThunkAction<StateAction, State>> {
  return (dispatch) => {
    client
      .query<GeoMapDataQueryQuery, GeoMapDataQueryQueryVariables>(
        GEOMAP_DATA_QUERY,
        { filter },
        {
          requestPolicy: 'network-only',
        },
      )
      .toPromise()
      .then((data) => {
        const { nodes } = data.data?.deviceInventory.deviceMetadata ?? { nodes: [] };
        const metaData: DeviceMetadata[] =
          nodes?.map((n) => ({
            id: n?.id,
            deviceName: n?.deviceName,
            locationName: n?.locationName,
            geolocation: {
              latitude: n?.geolocation?.latitude,
              longitude: n?.geolocation?.longitude,
            },
          })) || [];

        dispatch(setDeviceMetadata(metaData));
      });
  };
}

export function setMapDeviceNeighbors(payload: MapDeviceNeighbors[]): StateAction {
  return {
    type: 'SET_MAP_DEVICE_NEIGHBORS',
    payload,
  };
}

export function getMapDeviceNeighbors(
  client: Client,
  filter: FilterNeighborInput,
): ReturnType<ThunkAction<StateAction, State>> {
  return (dispatch) => {
    client
      .query<NeighboursQuery, NeighboursQueryVariables>(
        MAP_NEIGHBORS_QUERY,
        { filter },
        {
          requestPolicy: 'network-only',
        },
      )
      .toPromise()
      .then((data) => {
        const deviceNeighborsData = data.data?.deviceInventory.deviceNeighbor?.neighbors ?? [];
        const deviceNeighbors: MapDeviceNeighbors[] =
          deviceNeighborsData?.map((d) => ({
            deviceName: d?.deviceName || '',
            deviceId: d?.deviceId || '',
          })) || [];

        dispatch(setMapDeviceNeighbors(deviceNeighbors));
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

export function updateMplsNodePosition(nodeId: string, position: Position): StateAction {
  return {
    type: 'UPDATE_MPLS_NODE_POSITION',
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

export function setSelectedMapDeviceName(deviceName: string | null): StateAction {
  return {
    type: 'SET_SELECTED_MAP_DEVICE_NAME',
    deviceName,
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

export function setMplsBackupNodesAndEdges(payload: BackupNodesEdgesPayload): StateAction {
  return {
    type: 'SET_MPLS_BACKUP_NODES_AND_EDGES',
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

export function setTopologiesOfDevice(topologies: TopologiesOfDevice): StateAction {
  return {
    type: 'SET_TOPOLOGIES_OF_DEVICE',
    topologies,
  };
}

export function getTopologiesOfDevice(client: Client, deviceName: string): ReturnType<ThunkAction<StateAction, State>> {
  return (dispatch) => {
    client
      .query<DevicesTopologyQuery, DevicesTopologyQueryVariables>(
        TOPOLOGIES_OF_DEVICE_QUERY,
        {
          deviceName,
        },
        {
          requestPolicy: 'network-only',
        },
      )
      .toPromise()
      .then((data) => {
        const topologies =
          data.data?.deviceInventory.devicesTopology?.topologies?.map((t) => ({
            deviceId: t?.deviceId || '',
            topologyId: t?.topologyId || '',
          })) || [];

        dispatch(setTopologiesOfDevice(topologies));
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

export function getMplsBackupNodesAndEdges(
  client: Client,
  version: string,
): ReturnType<ThunkAction<StateAction, State>> {
  return (dispatch) => {
    client
      .query<MplsTopologyVersionDataQuery, MplsTopologyVersionDataQueryVariables>(
        MPLS_TOPOLOGY_VERSION_DATA_QUERY,
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
          setMplsBackupNodesAndEdges({
            nodes: data.data?.deviceInventory.mplsTopologyVersionData.nodes ?? [],
            edges:
              data.data?.deviceInventory.mplsTopologyVersionData.edges.map((e) => ({
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

export function setMapTopologyType(mapTopologyType: MapTopologyType): StateAction {
  return {
    type: 'SET_MAP_TOPOLOGY_TYPE',
    mapTopologyType,
  };
}

export function setMapTopologyDeviceSearch(mapTopologyDeviceSearch: string | null): StateAction {
  return {
    type: 'SET_MAP_TOPOLOGY_DEVICE_SEARCH',
    mapTopologyDeviceSearch,
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

export function setSelectedMplsNode(node: MplsGraphNode): StateAction {
  return {
    type: 'SET_SELECTED_MPLS_NODE',
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

export function setUnconfimedNodeIdForLspPathSearch(nodeId: string, lspId: string | null): StateAction {
  return {
    type: 'SET_UNCONFIRMED_LSP_NODE_ID',
    nodeId,
    lspId,
  };
}

export function findLspPath(): StateAction {
  return {
    type: 'FIND_LSP_PATH',
  };
}

export function clearLspPathSearch(): StateAction {
  return {
    type: 'CLEAR_LSP_PATH',
  };
}

export function setLspPath(nodeIds: string[], metadata: LspPathMetadata | null): StateAction {
  return {
    type: 'SET_LSP_PATH',
    nodeIds,
    metadata,
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

export function setLspCounts(lspCounts: LspCount[]): StateAction {
  return {
    type: 'SET_LSP_COUNTS',
    lspCounts,
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

export function setSelectedNodeLoad(deviceName: string, payload?: SetDeviceUsagePayload | null): StateAction {
  return {
    type: 'SET_SELECTED_NODE_USAGE',
    payload: {
      deviceName,
      deviceUsage: payload,
    },
  };
}
