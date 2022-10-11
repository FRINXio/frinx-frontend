import { GraphEdge, GraphNode, Position } from './pages/topology/graph.helpers';

export type NodesEdgesPayload = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type LabelItem = {
  label: string;
  value: string;
};

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
    };

export function setNodesAndEdges(payload: NodesEdgesPayload): StateAction {
  return {
    type: 'SET_NODES_AND_EDGES',
    payload,
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

export function setSelectedEdge(edge: GraphEdge | null): StateAction {
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

// export function
