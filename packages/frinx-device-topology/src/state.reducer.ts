import produce from 'immer';
import { getNodesWithDiff } from './helpers/topology-helpers';
import {
  BackupGraphNode,
  getDefaultPositionsMap,
  getInterfacesPositions,
  GraphEdge,
  GraphNode,
  Position,
  PositionGroupsMap,
} from './pages/topology/graph.helpers';
import { LabelItem, StateAction } from './state.actions';

export type State = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodePositions: Record<string, Position>;
  interfaceGroupPositions: PositionGroupsMap;
  selectedNode: GraphNode | null;
  selectedEdge: GraphEdge | null;
  connectedNodeIds: string[];
  selectedLabels: LabelItem[];
  selectedVersion: string | null;
  backupNodes: BackupGraphNode[];
  backupEdges: GraphEdge[];
};

export const initialState: State = {
  nodes: [],
  edges: [],
  nodePositions: {},
  interfaceGroupPositions: {},
  selectedNode: null,
  selectedEdge: null,
  connectedNodeIds: [],
  selectedLabels: [],
  selectedVersion: null,
  backupNodes: [],
  backupEdges: [],
};

export function stateReducer(state: State, action: StateAction): State {
  return produce(state, (acc) => {
    switch (action.type) {
      case 'SET_NODES_AND_EDGES': {
        const allNodes = getNodesWithDiff(action.payload.nodes, state.backupNodes);
        const positionsMap = getDefaultPositionsMap(allNodes, action.payload.edges);
        acc.nodes = action.payload.nodes;
        acc.edges = action.payload.edges;
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
        }
        return acc;
      }
      case 'SET_BACKUP_NODES_AND_EDGES': {
        const allNodes = getNodesWithDiff(state.nodes, action.payload.nodes);
        const positionsMap = getDefaultPositionsMap(allNodes, action.payload.edges);
        acc.backupNodes = action.payload.nodes;
        acc.backupEdges = action.payload.edges;
        acc.nodePositions = positionsMap.nodes;
        acc.interfaceGroupPositions = positionsMap.interfaceGroups;
        return acc;
      }
      default:
        throw new Error();
    }
  });
}
