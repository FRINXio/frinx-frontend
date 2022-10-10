import produce from 'immer';
import {
  getDefaultPositionsMap,
  getInterfacesPositions,
  GraphEdge,
  GraphNode,
  Position,
} from './pages/topology/graph.helpers';
import { LabelItem, StateAction } from './state.actions';

export type State = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodePositions: Record<string, Position>;
  interfacePositions: Record<string, Position>;
  selectedNode: GraphNode | null;
  selectedEdge: GraphEdge | null;
  connectedNodeIds: string[];
  selectedLabels: LabelItem[];
};

export const initialState: State = {
  nodes: [],
  edges: [],
  nodePositions: {},
  interfacePositions: {},
  selectedNode: null,
  selectedEdge: null,
  connectedNodeIds: [],
  selectedLabels: [],
};

export function stateReducer(state: State, action: StateAction): State {
  return produce(state, (acc) => {
    switch (action.type) {
      case 'SET_NODES_AND_EDGES': {
        const positionsMap = getDefaultPositionsMap(action.payload.nodes, action.payload.edges);
        acc.nodes = action.payload.nodes;
        acc.edges = action.payload.edges;
        acc.nodePositions = positionsMap.nodes;
        acc.interfacePositions = positionsMap.interfaces;
        return acc;
      }
      case 'UPDATE_NODE_POSITION': {
        acc.nodePositions[action.nodeId] = action.position;
        acc.interfacePositions = getInterfacesPositions({
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
      default:
        throw new Error();
    }
  });
}
