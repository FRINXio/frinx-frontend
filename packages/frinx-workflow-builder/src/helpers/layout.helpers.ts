import dagre from 'dagre';
import { Elements, isNode, Node, Position } from 'react-flow-renderer';
import { ExtendedTask } from './types';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// In order to keep this example simple the node width and height are hardcoded.
// In a real world app you would use the correct width and height values of
// const nodes = useStoreState(state => state.nodes) and then node.__rf.width, node.__rf.height

const nodeWidth = 565;
const nodeHeight = 55;

function getNodeWidth(node: Node<{ task?: ExtendedTask }>): number {
  if (node.data?.task?.type === 'START_TASK' || node.data?.task?.type === 'END_TASK') {
    return 85;
  }
  return nodeWidth;
}

export const getLayoutedElements = (elements: Elements<{ task?: ExtendedTask }>, direction = 'LR'): Elements => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: getNodeWidth(el), height: nodeHeight });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map((el) => {
    const newEl = { ...el };
    if (isNode(newEl)) {
      const nodeWithPosition = dagreGraph.node(newEl.id);
      newEl.targetPosition = isHorizontal ? Position.Left : Position.Top;
      newEl.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      // unfortunately we need this little hack to pass a slightly different position
      // to notify react flow about the change. Moreover we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
      newEl.position = {
        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return newEl;
  });
};
