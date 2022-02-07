import { Link } from 'beautiful-react-diagrams/@types/DiagramSchema';
import { Elements, Position, Node, Edge } from 'react-flow-renderer';
import { CustomNodeType } from './types';

type HandlePosition = {
  sourcePosition?: Position;
  targetPosition?: Position;
};

type NodeStyle = {
  padding: number;
  border: string;
};

type NodeLink = {
  id: string;
  type: 'input' | 'output';
};

function getFlowNodeType(node: CustomNodeType): string | null {
  if (node.id === 'start') {
    return 'input';
  }
  if (node.id === 'end') {
    return 'output';
  }
  if (node.data?.task.type === 'DECISION') {
    return 'decision';
  }

  return null;
}

function getHandlePosition(node: CustomNodeType): HandlePosition {
  if (node.id === 'start') {
    return {
      sourcePosition: Position.Right,
    };
  }
  if (node.id === 'end') {
    return {
      targetPosition: Position.Left,
    };
  }
  return {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  };
}

function getNodeStyle(): NodeStyle {
  return {
    padding: 15,
    border: '1px solid black',
  };
}

function convertNodeToFlowNode(node: CustomNodeType): Node {
  return {
    id: node.id,
    position: {
      x: node.coordinates[0],
      y: node.coordinates[1],
    },
    type: getFlowNodeType(node) || undefined,
    data: {
      label: node.data?.task.label || 'default',
      type: node.data?.task.type || 'SIMPLE',
    },
    style: getNodeStyle(),
    ...getHandlePosition(node),
  };
}

function convertLinkToFlowEdge(link: Link): Edge {
  const input: NodeLink = JSON.parse(link.input);
  const output: NodeLink = JSON.parse(link.output);
  return {
    id: `e${input.id}-${output.id}`,
    source: input.id,
    target: output.id,
  };
}

export function getElements(nodes: CustomNodeType[], links: Link[]): Elements<{ type: string }> {
  const flowNodes = nodes.map(convertNodeToFlowNode);
  const flowEdges = links.map(convertLinkToFlowEdge);
  return [...flowNodes, ...flowEdges];
}
