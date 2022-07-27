import { partition } from 'lodash';
import { Edge, getConnectedEdges, getIncomers, getOutgoers, Node } from 'react-flow-renderer';
import { ExtendedDecisionTask, ExtendedForkTask, ExtendedTask, Task } from './types';
import unwrap from './unwrap';

function convertNodeToTask(node: Node): ExtendedTask {
  const { data } = node;
  const { task } = data;
  const { id, label, ...rest } = task;
  return rest;
}

function isConnectionNode(node: Node, elements: { nodes: Node[]; edges: Edge[] }): boolean {
  const { nodes, edges } = elements;
  return getIncomers(node, nodes, edges).length > 1;
}

function findForkOrDecisionEndNode(elements: { nodes: Node[]; edges: Edge[] }, node: Node, depth: number): Node {
  const { nodes, edges } = elements;
  let newDepth = depth;
  const children = getOutgoers(node, nodes, edges);
  // eslint-disable-next-line no-restricted-syntax, no-unreachable-loop
  for (const ch of children) {
    newDepth = isConnectionNode(ch, elements) ? newDepth - 1 : newDepth;
    newDepth = ch.data.task?.type === 'DECISION' || ch.data.task?.type === 'FORK_JOIN' ? newDepth + 1 : newDepth;

    if (getIncomers(ch, nodes, edges).length > 1 && depth === 0) {
      return ch;
    }
    return findForkOrDecisionEndNode(elements, ch, newDepth);
  }

  const endNode = unwrap(nodes.find((n) => n.id === 'end'));
  return endNode;
}

function getDecisionTask(
  tasks: ExtendedTask[],
  elements: { nodes: Node[]; edges: Edge[] },
  currentNode: Node,
): ExtendedTask[] {
  const { nodes, edges } = elements;
  const currentTask = convertNodeToTask(currentNode) as ExtendedDecisionTask;
  const children = getOutgoers(currentNode, nodes, edges);
  const decisionEndNode = findForkOrDecisionEndNode(elements, currentNode, 0);

  // get every decision branch tasks
  const decisionTasks: [string, ExtendedTask[]][] = children.map((decision) => {
    const connectionEdges = getConnectedEdges([decision], edges as Edge<unknown>[]);
    const startBranchEdge = unwrap(connectionEdges.find((e) => e.source === currentTask.taskReferenceName));
    const decisionStartNode = unwrap(nodes.find((n) => n.id === startBranchEdge?.target));
    const currentDecisionTasks = traverseElements([], elements, decisionStartNode.id, decisionEndNode.id); // eslint-disable-line @typescript-eslint/no-use-before-define
    return [unwrap(startBranchEdge.sourceHandle), currentDecisionTasks];
  });

  // we split tasks for decision cases and for `default` case
  const [decisionCases, defaultCase] = partition(decisionTasks, (d) => d[0] !== 'default');

  // we convert [string, ExtendedTask[]][] -> Record<string, ExtendedTask[]>
  const newDecisionCases = decisionCases.reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {});
  const defaultCaseTasks = defaultCase[0][1];
  const editedTask = {
    ...currentTask,
    decisionCases: newDecisionCases,
    defaultCase: defaultCaseTasks,
  };

  // it is possible that current decision task is nested
  // we need to find all elements after decision end node till the diagram end or when there is another join
  // to upper nest level
  try {
    const nextJoinNode = findForkOrDecisionEndNode(elements, decisionEndNode, 0);
    const nextTasks: ExtendedTask[] = traverseElements([], elements, decisionEndNode.id, nextJoinNode.id); // eslint-disable-line @typescript-eslint/no-use-before-define
    return [...tasks, editedTask, ...nextTasks];
  } catch {
    const nextTasks: ExtendedTask[] = traverseElements([], elements, decisionEndNode.id, 'end'); // eslint-disable-line @typescript-eslint/no-use-before-define
    return [...tasks, editedTask, ...nextTasks];
  }
}

function getForkTask(
  tasks: ExtendedTask[],
  elements: { nodes: Node[]; edges: Edge[] },
  currentNode: Node,
): ExtendedTask[] {
  const { nodes, edges } = elements;
  const currentTask = convertNodeToTask(currentNode) as ExtendedForkTask;
  const children = getOutgoers(currentNode, nodes, edges);
  const joinNode = findForkOrDecisionEndNode(elements, currentNode, 0);

  const forkTasks = children.map((fork) => {
    return traverseElements([], elements, fork.id, joinNode.id); // eslint-disable-line @typescript-eslint/no-use-before-define
  });

  const editedTask = {
    ...currentTask,
    forkTasks,
  };

  // it is possible that current fork task is nested
  // we need to find all elements after fork end node till the diagram end or when there is another join
  // to upper nest level
  try {
    const nextJoinNode = findForkOrDecisionEndNode(elements, joinNode, 0);
    const nextTasks: ExtendedTask[] = traverseElements([], elements, joinNode.id, nextJoinNode.id); // eslint-disable-line @typescript-eslint/no-use-before-define
    return [...tasks, editedTask, ...nextTasks];
  } catch {
    const nextTasks: ExtendedTask[] = traverseElements([], elements, joinNode.id, 'end'); // eslint-disable-line @typescript-eslint/no-use-before-define
    return [...tasks, editedTask, ...nextTasks];
  }
}

function traverseElements(
  tasks: ExtendedTask[],
  elements: { nodes: Node[]; edges: Edge[] },
  id: string,
  endId = 'end',
): ExtendedTask[] {
  if (id === endId) {
    return tasks;
  }

  const { nodes, edges } = elements;

  const currentNode = unwrap(nodes.find((n) => n.id === id));
  const currentTask = convertNodeToTask(currentNode);
  const children = getOutgoers(currentNode, nodes, edges);

  if (currentTask.type === 'DECISION') {
    return getDecisionTask([], elements, currentNode);
  }

  if (currentTask.type === 'FORK_JOIN') {
    return getForkTask([], elements, currentNode);
  }

  const nextTasks = children.map((n) => {
    return traverseElements([], elements, n.id, endId);
  });

  return [...tasks, currentTask, ...nextTasks[0]];
}

export function convertToTasks(elements: { nodes: Node[]; edges: Edge[] }): Task[] {
  const { nodes, edges } = elements;

  const startNode = unwrap(nodes.find((n) => n.id === 'start'));
  const children = getOutgoers(startNode, nodes, edges);

  const tasks = traverseElements([], elements, children[0].id);
  return tasks;
}
