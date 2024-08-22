import { omitNullValue } from '@frinx/shared';
import { produce } from 'immer';
import {
  getEdgesWithDiff,
  getNodesWithDiff,
  GraphEdgeWithDiff,
  GraphNodeWithDiff,
  getSynceNodesWithDiff,
  getPtpNodesWithDiff,
  PtpGraphNodeWithDiff,
  SynceGraphNodeWithDiff,
  getNetNodesWithDiff,
  NetGraphNodeWithDiff,
  MplsGraphNodeWithDiff,
  getMplsNodesWithDiff,
} from './helpers/topology-helpers';
import {
  getDefaultPositionsMap,
  getInterfacesPositions,
  GrahpNetNodeInterface,
  GraphEdge,
  GraphNetNode,
  GraphNode,
  GraphNodeInterface,
  GraphPtpNodeInterface,
  GraphSynceNodeInterface,
  Position,
  PositionGroupsMap,
  PtpGraphNode,
  SynceGraphNode,
  width as topologyWidth,
  height as topologyHeight,
  GraphMplsNodeInterface,
  MplsGraphNode,
  DeviceMetadata,
  LspCount,
} from './pages/topology/graph.helpers';
import {
  identity,
  Matrix,
  translate,
  multiplyMatrices,
  getMidPoint,
  scale,
  getZoomLevel,
} from './pages/topology/transform.helpers';
import { LabelItem, StateAction, TopologyMode, MapTopologyType } from './state.actions';
import { NetInterface, NetNode } from './__generated__/graphql';

export type TopologyLayer = 'LLDP' | 'BGP-LS' | 'PTP' | 'MPLS' | 'Synchronous Ethernet' | 'Map';

export type NodeInfo = {
  weight: number | null;
  name: string | null;
};
export type ShortestPathInfo = {
  weight: number | null;
  nodes: NodeInfo[];
};
export type ShortestPath = ShortestPathInfo[];

// We need to limit zoomLevel to reasonable numbers,
// these were picked as a good start.
// (Safari on Mac should have lower MAX, but we will stick with it for now)
const MIN_ZOOM_LEVEL = 0.01;
const MAX_ZOOM_LEVEL = 20;

export type State = {
  mapTopologyDeviceSearch: string | null;
  topologyLayer: TopologyLayer;
  mapTopologyType: MapTopologyType;
  selectedMapDeviceName: string | null;
  devicesMetadata: DeviceMetadata[] | null;
  mode: TopologyMode;
  nodes: GraphNodeWithDiff[];
  edges: GraphEdgeWithDiff[];
  nodePositions: Record<string, Position>;
  interfaceGroupPositions: PositionGroupsMap<GraphNodeInterface>;
  selectedNode: (GraphNode | GraphNetNode | PtpGraphNode | SynceGraphNode | MplsGraphNode) | null;
  selectedEdge: GraphEdge | null;
  connectedNodeIds: string[];
  selectedLabels: LabelItem[];
  selectedVersion: string | null;
  unconfirmedSelectedNodeIds: string[];
  selectedNodeIds: string[];
  commonNodeIds: string[];
  unconfirmedShortestPathNodeIds: [string | null, string | null];
  selectedShortestPathNodeIds: [string | null, string | null];
  alternativeShortestPaths: ShortestPath;
  selectedAlternativeShortestPathIndex: number;
  netNodes: NetGraphNodeWithDiff[];
  netEdges: GraphEdgeWithDiff[];
  netNodePositions: Record<string, Position>;
  netInterfaceGroupPositions: PositionGroupsMap<GrahpNetNodeInterface>;
  ptpNodes: PtpGraphNodeWithDiff[];
  ptpEdges: GraphEdgeWithDiff[];
  ptpNodePositions: Record<string, Position>;
  ptpInterfaceGroupPositions: PositionGroupsMap<GraphPtpNodeInterface>;
  isWeightVisible: boolean;
  isSynceDiffVisible: boolean;
  unconfirmedSelectedGmPathNodeId: string | null;
  selectedGmPathNodeId: string | null;
  gmPathIds: string[];
  synceNodes: SynceGraphNodeWithDiff[];
  synceEdges: GraphEdgeWithDiff[];
  synceNodePositions: Record<string, Position>;
  synceInterfaceGroupPositions: PositionGroupsMap<GraphSynceNodeInterface>;
  mplsNodes: MplsGraphNodeWithDiff[];
  mplsEdges: GraphEdgeWithDiff[];
  mplsNodePositions: Record<string, Position>;
  mplsInterfaceGroupPositions: PositionGroupsMap<GraphMplsNodeInterface>;
  transform: Matrix;
  selectedNodeLoad: {
    deviceName: string;
    deviceUsage?: {
      cpuLoad: number | null;
      memoryLoad: number | null;
    } | null;
  };
  lspCounts: LspCount[];
  // isMouseDown: boolean;
};

export const initialState: State = {
  mapTopologyDeviceSearch: null,
  topologyLayer: 'LLDP',
  mapTopologyType: null,
  selectedMapDeviceName: null,
  devicesMetadata: null,
  mode: 'NORMAL',
  nodes: [],
  edges: [],
  nodePositions: {},
  interfaceGroupPositions: {},
  selectedNode: null,
  selectedEdge: null,
  connectedNodeIds: [],
  selectedLabels: [],
  selectedVersion: null,
  unconfirmedSelectedNodeIds: [],
  selectedNodeIds: [],
  commonNodeIds: [],
  unconfirmedShortestPathNodeIds: [null, null],
  selectedShortestPathNodeIds: [null, null],
  alternativeShortestPaths: [],
  selectedAlternativeShortestPathIndex: 0,
  netNodes: [],
  netEdges: [],
  netNodePositions: {},
  netInterfaceGroupPositions: {},
  ptpNodes: [],
  ptpEdges: [],
  ptpNodePositions: {},
  ptpInterfaceGroupPositions: {},
  isWeightVisible: false,
  isSynceDiffVisible: false,
  unconfirmedSelectedGmPathNodeId: null,
  selectedGmPathNodeId: null,
  gmPathIds: [],
  synceNodes: [],
  synceEdges: [],
  synceNodePositions: {},
  synceInterfaceGroupPositions: {},
  mplsNodes: [],
  mplsEdges: [],
  mplsNodePositions: {},
  mplsInterfaceGroupPositions: {},
  transform: identity(),
  selectedNodeLoad: {
    deviceName: '',
    deviceUsage: null,
  },
  lspCounts: [],
  // isMouseDown: false,
};

export function stateReducer(state: State, action: StateAction): State {
  return produce(state, (acc) => {
    switch (action.type) {
      case 'SET_NODES_AND_EDGES': {
        const positionsMap = getDefaultPositionsMap<GraphNodeInterface, GraphNode>(
          { nodes: action.payload.nodes, edges: action.payload.edges },
          (n) => n.name,
          (n) => n.device?.deviceSize ?? 'MEDIUM',
        );
        acc.nodes = action.payload.nodes.map((n) => ({ ...n, change: 'NONE' }));
        acc.edges = action.payload.edges.map((e) => ({ ...e, change: 'NONE' }));
        acc.nodePositions = positionsMap.nodes;
        acc.interfaceGroupPositions = positionsMap.interfaceGroups;
        return acc;
      }
      case 'UPDATE_NODE_POSITION': {
        acc.nodePositions[action.nodeId] = action.position;
        acc.interfaceGroupPositions = getInterfacesPositions<GraphNodeInterface, GraphNode>(
          {
            nodes: acc.nodes,
            edges: acc.edges,
            positionMap: acc.nodePositions,
          },
          (n) => n.device?.deviceSize ?? 'MEDIUM',
        );
        return acc;
      }
      case 'UPDATE_PTP_NODE_POSITION': {
        acc.ptpNodePositions[action.nodeId] = action.position;
        acc.ptpInterfaceGroupPositions = getInterfacesPositions<GraphPtpNodeInterface, PtpGraphNode>(
          {
            nodes: acc.ptpNodes,
            edges: acc.ptpEdges,
            positionMap: acc.ptpNodePositions,
          },
          () => 'MEDIUM',
        );
        return acc;
      }
      case 'UPDATE_SYNCE_NODE_POSITION': {
        acc.synceNodePositions[action.nodeId] = action.position;
        acc.synceInterfaceGroupPositions = getInterfacesPositions<GraphSynceNodeInterface, SynceGraphNode>(
          {
            nodes: acc.synceNodes,
            edges: acc.synceEdges,
            positionMap: acc.synceNodePositions,
          },
          () => 'MEDIUM',
        );
        return acc;
      }
      case 'UPDATE_MPLS_NODE_POSITION': {
        acc.mplsNodePositions[action.nodeId] = action.position;
        acc.mplsInterfaceGroupPositions = getInterfacesPositions<GraphMplsNodeInterface, MplsGraphNode>(
          {
            nodes: acc.mplsNodes,
            edges: acc.mplsEdges,
            positionMap: acc.mplsNodePositions,
          },
          () => 'MEDIUM',
        );
        return acc;
      }
      case 'SET_SELECTED_NODE': {
        if (acc.selectedNode?.id !== action.node?.id) {
          acc.selectedEdge = null;
        }
        acc.selectedNode = action.node;
        const connectedEdges = acc.edges.filter(
          (e) => action.node?.name === e.source.nodeId || action.node?.name === e.target.nodeId,
        );
        const connectedNodeIds = [
          ...new Set([...connectedEdges.map((e) => e.source.nodeId), ...connectedEdges.map((e) => e.target.nodeId)]),
        ];
        acc.connectedNodeIds = connectedNodeIds;
        return acc;
      }
      case 'SET_SELECTED_EDGE': {
        acc.selectedEdge = action.edge;
        return acc;
      }
      case 'SET_MAP_TOPOLOGY_TYPE': {
        acc.mapTopologyType = action.mapTopologyType;
        return acc;
      }
      case 'SET_MAP_TOPOLOGY_DEVICE_SEARCH': {
        acc.mapTopologyDeviceSearch = action.mapTopologyDeviceSearch;
        return acc;
      }
      case 'SET_SELECTED_LABELS': {
        acc.selectedLabels = action.labels;
        return acc;
      }
      case 'SET_SELECTED_VERSION': {
        acc.selectedVersion = action.version;
        if (action.version === null) {
          acc.selectedLabels = [];
          acc.selectedNode = null;
          acc.connectedNodeIds = [];
        }
        return acc;
      }
      case 'SET_BACKUP_NODES_AND_EDGES': {
        const allNodes = getNodesWithDiff(acc.nodes, action.payload.nodes);
        const allEdges = getEdgesWithDiff(acc.edges, action.payload.edges);
        const positionsMap = getDefaultPositionsMap<GraphNodeInterface, GraphNode>(
          { nodes: allNodes, edges: allEdges },
          (n) => n.name,
          (n) => n.device?.deviceSize ?? 'MEDIUM',
        );

        acc.nodes = allNodes;
        acc.edges = allEdges;
        acc.nodePositions = positionsMap.nodes;
        acc.interfaceGroupPositions = positionsMap.interfaceGroups;
        return acc;
      }
      case 'SET_PTP_BACKUP_NODES_AND_EDGES': {
        const allNodes = getPtpNodesWithDiff(acc.ptpNodes, action.payload.nodes);
        const allEdges = getEdgesWithDiff(acc.ptpEdges, action.payload.edges);
        const positionsMap = getDefaultPositionsMap<GraphPtpNodeInterface, PtpGraphNode>(
          { nodes: allNodes, edges: allEdges },
          (n) => n.name,
          () => 'MEDIUM',
        );
        acc.ptpNodes = allNodes;
        acc.ptpEdges = allEdges;
        acc.ptpNodePositions = positionsMap.nodes;
        acc.ptpInterfaceGroupPositions = positionsMap.interfaceGroups;
        return acc;
      }
      case 'SET_SYNCE_BACKUP_NODES_AND_EDGES': {
        const allNodes = getSynceNodesWithDiff(acc.synceNodes, action.payload.nodes);
        const allEdges = getEdgesWithDiff(acc.synceEdges, action.payload.edges);
        const positionsMap = getDefaultPositionsMap<GraphSynceNodeInterface, SynceGraphNode>(
          { nodes: allNodes, edges: allEdges },
          (n) => n.name,
          () => 'MEDIUM',
        );
        acc.synceNodes = allNodes;
        acc.synceEdges = allEdges;
        acc.synceNodePositions = positionsMap.nodes;
        acc.synceInterfaceGroupPositions = positionsMap.interfaceGroups;
        return acc;
      }
      case 'SET_MPLS_BACKUP_NODES_AND_EDGES': {
        const allNodes = getMplsNodesWithDiff(acc.mplsNodes, action.payload.nodes);
        const allEdges = getEdgesWithDiff(acc.mplsEdges, action.payload.edges);
        const positionsMap = getDefaultPositionsMap<GraphMplsNodeInterface, MplsGraphNode>(
          { nodes: allNodes, edges: allEdges },
          (n) => n.name,
          () => 'MEDIUM',
        );
        acc.mplsNodes = allNodes;
        acc.mplsEdges = allEdges;
        acc.mplsNodePositions = positionsMap.nodes;
        acc.mplsInterfaceGroupPositions = positionsMap.interfaceGroups;
        return acc;
      }
      case 'SET_NET_BACKUP_NODES_AND_EDGES': {
        const allNodes = getNetNodesWithDiff(acc.netNodes, action.payload.nodes);
        const allEdges = getEdgesWithDiff(acc.netEdges, action.payload.edges);

        const positionsMap = getDefaultPositionsMap<NetInterface, NetNode>(
          { nodes: allNodes, edges: allEdges },
          (n) => n.name,
          () => 'MEDIUM',
        );
        acc.netNodes = allNodes;
        acc.netEdges = allEdges;
        acc.netNodePositions = positionsMap.nodes;
        acc.netInterfaceGroupPositions = positionsMap.interfaceGroups;
        return acc;
      }
      case 'SET_UNCONFIRMED_NODE_IDS_TO_FIND_COMMON': {
        acc.unconfirmedSelectedNodeIds = [...action.nodeIds];
        return acc;
      }
      case 'ADD_REMOVE_UNCONFIRMED_NODE_ID_FOR_SHORTEST_PATH': {
        const currentNodeIds = acc.unconfirmedShortestPathNodeIds.filter(omitNullValue);
        const isAlreadySelected = currentNodeIds.includes(action.nodeId);
        const newNodeIds = isAlreadySelected
          ? currentNodeIds.filter((n) => n !== action.nodeId)
          : [...currentNodeIds, action.nodeId];

        acc.unconfirmedShortestPathNodeIds = [newNodeIds[0] ?? null, newNodeIds[1] ?? null];
        return acc;
      }
      case 'FIND_SHORTEST_PATH': {
        acc.selectedShortestPathNodeIds = acc.unconfirmedShortestPathNodeIds;
        return acc;
      }
      case 'SET_NODE_IDS_TO_FIND_COMMON': {
        acc.selectedNodeIds = [...state.unconfirmedSelectedNodeIds];
        return acc;
      }
      case 'CLEAR_SHORTEST_PATH_SEARCH': {
        acc.unconfirmedShortestPathNodeIds = [null, null];
        acc.alternativeShortestPaths = [];
        acc.selectedAlternativeShortestPathIndex = 0;
        return acc;
      }
      case 'SET_ALTERNATIVE_PATHS': {
        acc.alternativeShortestPaths = action.alternativePaths;
        acc.selectedAlternativeShortestPathIndex = 0;
        return acc;
      }
      case 'SET_SELECTED_ALTERNATIVE_PATH': {
        acc.selectedAlternativeShortestPathIndex = action.alternativePathIndex;
        return acc;
      }
      case 'SET_UNCONFIRMED_GM_NODE_ID': {
        acc.unconfirmedSelectedGmPathNodeId = action.nodeId;
        return acc;
      }
      case 'FIND_GM_PATH': {
        acc.selectedGmPathNodeId = state.unconfirmedSelectedGmPathNodeId;
        return acc;
      }
      case 'CLEAR_GM_PATH': {
        acc.unconfirmedSelectedGmPathNodeId = null;
        acc.selectedGmPathNodeId = null;
        acc.gmPathIds = [];
        return acc;
      }
      case 'SET_GM_PATH_IDS': {
        acc.gmPathIds = action.nodeIds;
        return acc;
      }
      case 'SET_MODE': {
        acc.mode = action.mode;
        return acc;
      }
      case 'CLEAR_COMMON_SEARCH': {
        acc.unconfirmedSelectedNodeIds = [];
        acc.selectedNodeIds = [];
        acc.commonNodeIds = [];
        return acc;
      }
      case 'SET_COMMON_NODE_IDS': {
        acc.commonNodeIds = action.nodeIds;
        return acc;
      }
      case 'SET_NET_NODES_AND_EDGES': {
        const { nodes, edges } = action.payload;
        const positionMap = getDefaultPositionsMap<GrahpNetNodeInterface, NetNode>(
          { nodes, edges },
          (n) => n.name,
          () => 'MEDIUM',
        );
        acc.netNodes = nodes.map((n) => ({ ...n, change: 'NONE' }));
        acc.netEdges = edges.map((e) => ({ ...e, change: 'NONE' }));
        acc.netNodePositions = positionMap.nodes;
        acc.netInterfaceGroupPositions = positionMap.interfaceGroups;
        return acc;
      }
      case 'SET_PTP_NODES_AND_EDGES': {
        const { nodes, edges } = action.payload;
        const positionMap = getDefaultPositionsMap<GraphPtpNodeInterface, PtpGraphNode>(
          { nodes, edges },
          (n) => n.name,
          () => 'MEDIUM',
        );
        acc.ptpNodes = nodes.map((n) => ({ ...n, change: 'NONE' }));
        acc.ptpEdges = edges.map((e) => ({ ...e, change: 'NONE' }));
        acc.ptpNodePositions = positionMap.nodes;
        acc.ptpInterfaceGroupPositions = positionMap.interfaceGroups;
        return acc;
      }
      case 'SET_SYNCE_NODES_AND_EDGES': {
        const { nodes, edges } = action.payload;
        const positionMap = getDefaultPositionsMap<GraphSynceNodeInterface, SynceGraphNode>(
          { nodes, edges },
          (n) => n.name,
          () => 'MEDIUM',
        );
        acc.synceNodes = nodes.map((n) => ({ ...n, change: 'NONE' }));
        acc.synceEdges = edges.map((e) => ({ ...e, change: 'NONE' }));
        acc.synceNodePositions = positionMap.nodes;
        acc.synceInterfaceGroupPositions = positionMap.interfaceGroups;
        return acc;
      }
      case 'SET_MPLS_NODES_AND_EDGES': {
        const { nodes, edges } = action.payload;
        const positionMap = getDefaultPositionsMap<GraphMplsNodeInterface, MplsGraphNode>(
          { nodes, edges },
          (n) => n.name,
          () => 'MEDIUM',
        );
        acc.mplsNodes = nodes.map((n) => ({ ...n, change: 'NONE' }));
        acc.mplsEdges = edges.map((e) => ({ ...e, change: 'NONE' }));
        acc.mplsNodePositions = positionMap.nodes;
        acc.mplsInterfaceGroupPositions = positionMap.interfaceGroups;
        return acc;
      }
      case 'SET_TOPOLOGY_LAYER': {
        acc.topologyLayer = action.layer;
        acc.selectedEdge = null;
        acc.selectedNode = null;
        acc.connectedNodeIds = [];
        acc.gmPathIds = [];
        acc.unconfirmedSelectedGmPathNodeId = null;
        acc.unconfirmedShortestPathNodeIds = [null, null];
        acc.selectedShortestPathNodeIds = [null, null];
        acc.selectedGmPathNodeId = null;
        acc.unconfirmedSelectedGmPathNodeId = null;
        acc.selectedVersion = null;
        return acc;
      }
      case 'SET_SELECTED_NET_NODE': {
        if (acc.selectedNode?.id !== action.node?.id) {
          acc.selectedEdge = null;
        }
        acc.selectedNode = action.node;
        const connectedEdges = acc.netEdges.filter(
          (e) => action.node?.name === e.source.nodeId || action.node?.name === e.target.nodeId,
        );
        const connectedNodeIds = [
          ...new Set([...connectedEdges.map((e) => e.source.nodeId), ...connectedEdges.map((e) => e.target.nodeId)]),
        ];
        acc.connectedNodeIds = connectedNodeIds;
        return acc;
      }
      case 'SET_SELECTED_MAP_DEVICE_NAME': {
        acc.selectedMapDeviceName = action.deviceName;
        return acc;
      }

      case 'SET_DEVICES_METADATA': {
        acc.devicesMetadata = action.payload;
        return acc;
      }
      case 'SET_SELECTED_PTP_NODE': {
        if (acc.selectedNode?.id !== action.node?.id) {
          acc.selectedEdge = null;
        }
        acc.selectedNode = action.node;
        const connectedEdges = acc.ptpEdges.filter(
          (e) => action.node?.name === e.source.nodeId || action.node?.name === e.target.nodeId,
        );
        const connectedNodeIds = [
          ...new Set([...connectedEdges.map((e) => e.source.nodeId), ...connectedEdges.map((e) => e.target.nodeId)]),
        ];
        acc.connectedNodeIds = connectedNodeIds;
        return acc;
      }
      case 'SET_SELECTED_SYNCE_NODE': {
        if (acc.selectedNode?.id !== action.node?.id) {
          acc.selectedEdge = null;
        }
        acc.selectedNode = action.node;
        const connectedEdges = acc.synceEdges.filter(
          (e) => action.node?.name === e.source.nodeId || action.node?.name === e.target.nodeId,
        );
        const connectedNodeIds = [
          ...new Set([...connectedEdges.map((e) => e.source.nodeId), ...connectedEdges.map((e) => e.target.nodeId)]),
        ];
        acc.connectedNodeIds = connectedNodeIds;
        return acc;
      }
      case 'SET_SELECTED_MPLS_NODE': {
        if (acc.selectedNode?.id !== action.node?.id) {
          acc.selectedEdge = null;
        }
        acc.selectedNode = action.node;
        const connectedEdges = acc.synceEdges.filter(
          (e) => action.node?.name === e.source.nodeId || action.node?.name === e.target.nodeId,
        );
        const connectedNodeIds = [
          ...new Set([...connectedEdges.map((e) => e.source.nodeId), ...connectedEdges.map((e) => e.target.nodeId)]),
        ];
        acc.connectedNodeIds = connectedNodeIds;
        return acc;
      }
      case 'SET_WEIGHT_VISIBILITY': {
        acc.isWeightVisible = action.isVisible;
        return acc;
      }
      case 'SET_SYNCE_DIFF_VISIBILITY': {
        acc.isSynceDiffVisible = action.isVisible;
        return acc;
      }
      case 'PAN_TOPOLOGY': {
        const currentTransform = state.transform;
        const xform = translate(action.panDelta.x, action.panDelta.y);
        acc.transform = multiplyMatrices(xform, currentTransform);
        return acc;
      }
      case 'ZOOM_TOPOLOGY': {
        const currentTransform = state.transform;
        const dimensions = {
          width: topologyWidth,
          height: topologyHeight,
        };
        const mid = getMidPoint(dimensions, state.transform);
        const xform = multiplyMatrices(translate(mid.x, mid.y), scale(action.zoomDelta), translate(-mid.x, -mid.y));
        const finalTransform = multiplyMatrices(xform, currentTransform);

        // We will limit zoomlevel to a reasonable number
        const zoomLevel = getZoomLevel(finalTransform);
        if (zoomLevel < MIN_ZOOM_LEVEL || zoomLevel > MAX_ZOOM_LEVEL) {
          return acc;
        }

        acc.transform = finalTransform;
        return acc;
      }
      case 'SET_SELECTED_NODE_USAGE': {
        const selectedDeviceName = action.payload.deviceName;
        const selectedDeviceUsage = action.payload.deviceUsage;

        acc.selectedNodeLoad = {
          deviceName: selectedDeviceName,
          deviceUsage: selectedDeviceUsage,
        };

        return acc;
      }
      case 'SET_LSP_COUNTS': {
        acc.lspCounts = action.lspCounts;
        return acc;
      }
      default:
        throw new Error();
    }
  });
}
