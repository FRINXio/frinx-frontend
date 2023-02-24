import produce from 'immer';
import { getEdgesWithDiff, getNodesWithDiff, GraphEdgeWithDiff, GraphNodeWithDiff } from './helpers/topology-helpers';
import {
  getDefaultPositionsMap,
  getInterfacesPositions,
  GraphEdge,
  GraphNode,
  Position,
  PositionGroupsMap,
} from './pages/topology/graph.helpers';
import { LabelItem, StateAction, TopologyMode } from './state.actions';

export type State = {
  mode: TopologyMode;
  nodes: GraphNodeWithDiff[];
  edges: GraphEdgeWithDiff[];
  nodePositions: Record<string, Position>;
  interfaceGroupPositions: PositionGroupsMap;
  selectedNode: GraphNode | null;
  selectedEdge: GraphEdge | null;
  connectedNodeIds: string[];
  selectedLabels: LabelItem[];
  selectedVersion: string | null;
  unconfirmedSelectedNodeIds: string[];
  selectedNodeIds: string[];
  commonNodeIds: string[];
};

export const initialState: State = {
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
};

export function stateReducer(state: State, action: StateAction): State {
  return produce(state, (acc) => {
    switch (action.type) {
      case 'SET_NODES_AND_EDGES': {
        const positionsMap = getDefaultPositionsMap(action.payload.nodes, action.payload.edges);
        acc.nodes = action.payload.nodes.map((n) => ({ ...n, change: 'NONE' }));
        acc.edges = action.payload.edges.map((e) => ({ ...e, change: 'NONE' }));
        acc.nodePositions = positionsMap.nodes;
        acc.interfaceGroupPositions = positionsMap.interfaceGroups;
        return acc;
      }
      case 'UPDATE_NODE_POSITION': {
        acc.nodePositions[action.nodeId] = action.position;
        acc.interfaceGroupPositions = getInterfacesPositions({
          nodes: acc.nodes,
          edges: acc.edges,
          positionMap: acc.nodePositions,
        });
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
        const positionsMap = getDefaultPositionsMap(allNodes, allEdges);
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
      case 'SET_NODE_IDS_TO_FIND_COMMON': {
        acc.selectedNodeIds = [...state.unconfirmedSelectedNodeIds];
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
      default:
        throw new Error();
    }
  });
}
