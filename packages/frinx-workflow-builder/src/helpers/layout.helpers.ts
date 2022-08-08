import dagre from 'dagre';
import { Edge, Node, Position } from 'react-flow-renderer';
import { NodeData } from './types';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 380;
const nodeHeight = 55;

function getNodeWidth(n: Node<NodeData>): number {
  if (n.id === 'start' || n.id === 'end') {
    return 250;
  }
  return nodeWidth;
}

export const getLayoutedElements = (
  elements: { nodes: Node<NodeData>[]; edges: Edge[] },
  direction = 'LR',
): { nodes: Node[]; edges: Edge[] } => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });
  const { nodes, edges } = elements;

  nodes.forEach((n) => {
    dagreGraph.setNode(n.id, { width: getNodeWidth(n), height: nodeHeight });
  });
  edges.forEach((e) => {
    dagreGraph.setEdge(e.source, e.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((n) => {
      const nodeCopy = { ...n };
      const nodeWithPosition = dagreGraph.node(nodeCopy.id);
      nodeCopy.targetPosition = isHorizontal ? Position.Left : Position.Top;
      nodeCopy.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      // unfortunately we need this little hack to pass a slightly different position
      // to notify react flow about the change. Moreover we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
      nodeCopy.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
      return nodeCopy;
    }),
    edges,
  };
};
