import dagre from 'dagre';
import { Edge, Node, Position } from 'react-flow-renderer';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// In order to keep this example simple the node width and height are hardcoded.
// In a real world app you would use the correct width and height values of
// const nodes = useStoreState(state => state.nodes) and then node.__rf.width, node.__rf.height

const nodeWidth = 300;
const nodeHeight = 55;

export const getLayoutedElements = (
  elements: { nodes: Node[]; edges: Edge[] },
  direction = 'LR',
): { nodes: Node[]; edges: Edge[] } => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });
  const { nodes, edges } = elements;

  nodes.forEach((n) => {
    dagreGraph.setNode(n.id, { width: nodeWidth, height: nodeHeight });
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
        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
      return nodeCopy;
    }),
    edges,
  };
};
