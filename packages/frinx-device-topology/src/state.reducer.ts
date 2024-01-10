import { omitNullValue } from '@frinx/shared';
import { produce } from 'immer';
import { getEdgesWithDiff, getNodesWithDiff, GraphEdgeWithDiff, GraphNodeWithDiff } from './helpers/topology-helpers';
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
} from './pages/topology/graph.helpers';
import { LabelItem, StateAction, TopologyMode } from './state.actions';
import { PtpGraphNode, SynceGraphNode } from './__generated__/graphql';

export type TopologyLayer = 'LLDP' | 'BGP-LS' | 'PTP' | 'Synchronous Ethernet';
export type NodeInfo = {
  weight: number | null;
  name: string | null;
};
export type ShortestPathInfo = {
  weight: number | null;
  nodes: NodeInfo[];
};
export type ShortestPath = ShortestPathInfo[];

export type State = {
  topologyLayer: TopologyLayer;
  mode: TopologyMode;
  nodes: GraphNodeWithDiff[];
  edges: GraphEdgeWithDiff[];
  nodePositions: Record<string, Position>;
  interfaceGroupPositions: PositionGroupsMap<GraphNodeInterface>;
  selectedNode: (GraphNode | GraphNetNode | PtpGraphNode | SynceGraphNode) | null;
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
  netNodes: GraphNetNode[];
  netEdges: GraphEdgeWithDiff[];
  netNodePositions: Record<string, Position>;
  netInterfaceGroupPositions: PositionGroupsMap<GrahpNetNodeInterface>;
  ptpNodes: PtpGraphNode[];
  ptpEdges: GraphEdgeWithDiff[];
  ptpNodePositions: Record<string, Position>;
  ptpInterfaceGroupPositions: PositionGroupsMap<GraphPtpNodeInterface>;
  isWeightVisible: boolean;
  unconfirmedSelectedGmPathNodeId: string | null;
  selectedGmPathNodeId: string | null;
  gmPathIds: string[];
  synceNodes: SynceGraphNode[];
  synceEdges: GraphEdgeWithDiff[];
  synceNodePositions: Record<string, Position>;
  synceInterfaceGroupPositions: PositionGroupsMap<GraphSynceNodeInterface>;
};

export const initialState: State = {
  topologyLayer: 'LLDP',
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
  unconfirmedSelectedGmPathNodeId: null,
  selectedGmPathNodeId: null,
  gmPathIds: [],
  synceNodes: [],
  synceEdges: [],
  synceNodePositions: {},
  synceInterfaceGroupPositions: {},
};

export function stateReducer(state: State, action: StateAction): State {
  return produce(state, (acc) => {
    switch (action.type) {
      case 'SET_NODES_AND_EDGES': {
        const positionsMap = getDefaultPositionsMap<GraphNodeInterface, GraphNode>(
          { nodes: action.payload.nodes, edges: action.payload.edges },
          (n) => n.device.name,
          (n) => n.device.deviceSize,
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
          (n) => n.device.name,
          (n) => n.device.deviceSize,
        );
        return acc;
      }
      case 'UPDATE_PTP_NODE_POSITION': {
        acc.ptpNodePositions[action.nodeId] = action.position;
        acc.ptpInterfaceGroupPositions = getInterfacesPositions<GraphNodeInterface, PtpGraphNode>(
          {
            nodes: acc.ptpNodes,
            edges: acc.ptpEdges,
            positionMap: acc.ptpNodePositions,
          },
          (n) => n.name,
          () => 'MEDIUM',
        );
        return acc;
      }
      case 'UPDATE_SYNCE_NODE_POSITION': {
        acc.synceNodePositions[action.nodeId] = action.position;
        acc.synceInterfaceGroupPositions = getInterfacesPositions<GraphNodeInterface, SynceGraphNode>(
          {
            nodes: acc.synceNodes,
            edges: acc.synceEdges,
            positionMap: acc.synceNodePositions,
          },
          (n) => n.name,
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
          (e) => action.node?.device.name === e.source.nodeId || action.node?.device.name === e.target.nodeId,
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
          (n) => n.device.name,
          (n) => n.device.deviceSize,
        );
        acc.nodes = allNodes;
        acc.edges = allEdges;
        acc.nodePositions = positionsMap.nodes;
        acc.interfaceGroupPositions = positionsMap.interfaceGroups;
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
        const positionMap = getDefaultPositionsMap<GrahpNetNodeInterface, GraphNetNode>(
          { nodes, edges },
          (n) => n.name,
          () => 'MEDIUM',
        );
        acc.netNodes = nodes;
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
        acc.ptpNodes = nodes;
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
        acc.synceNodes = nodes;
        acc.synceEdges = edges.map((e) => ({ ...e, change: 'NONE' }));
        acc.synceNodePositions = positionMap.nodes;
        acc.synceInterfaceGroupPositions = positionMap.interfaceGroups;
        return acc;
      }
      case 'SET_TOPOLOGY_LAYER': {
        acc.topologyLayer = action.layer;
        acc.selectedEdge = null;
        acc.selectedNode = null;
        acc.connectedNodeIds = [];
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
      case 'SET_WEIGHT_VISIBILITY': {
        acc.isWeightVisible = action.isVisible;
        return acc;
      }
      default:
        throw new Error();
    }
  });
}
