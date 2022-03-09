import { partition } from 'lodash';
import { Elements, isNode, Node, getConnectedEdges, getOutgoers, getIncomers, Edge } from 'react-flow-renderer';
import { DecisionTask, ForkTask, Task } from './types';
import unwrap from './unwrap';

function convertNodeToTask(node: Node): Task {
  const { data } = node;
  return data.task;
}

function isConnectionNode(node: Node, elements: Elements): boolean {
  return getIncomers(node, elements).length > 1;
}

function findForkOrDecisionEndNode(elements: Elements, node: Node, depth: number): Node {
  let newDepth = depth;
  const children = getOutgoers(node, elements);
  // eslint-disable-next-line no-restricted-syntax
  for (const ch of children) {
    newDepth = isConnectionNode(ch, elements) ? newDepth - 1 : newDepth;
    newDepth = ch.data.task?.type === 'DECISION' || ch.data.task?.type === 'FORK_JOIN' ? newDepth + 1 : newDepth;

    if (getIncomers(ch, elements).length > 1 && depth === 0) {
      return ch;
    }
    return findForkOrDecisionEndNode(elements, ch, newDepth);
  }

  throw Error('no valid decision end was found');
}

function getDecisionTask(tasks: Task[], elements: Elements, currentNode: Node): Task[] {
  const [nodes, edges] = partition(elements, isNode);
  const currentTask = convertNodeToTask(currentNode) as DecisionTask;
  const children = getOutgoers(currentNode, elements);
  const decisionEndNode = findForkOrDecisionEndNode(elements, currentNode, 0);

  // get every decision branch tasks
  const decisionTasks: [string, Task[]][] = children.map((decision) => {
    const connectionEdges = getConnectedEdges([decision], edges as Edge<unknown>[]);
    const startBranchEdge = unwrap(connectionEdges.find((e) => e.source === currentTask.taskReferenceName));
    const decisionStartNode = unwrap(nodes.find((n) => n.id === startBranchEdge?.target));
    const currentDecisionTasks = traverseElements([], elements, decisionStartNode.id, decisionEndNode.id); // eslint-disable-line @typescript-eslint/no-use-before-define
    return [unwrap(startBranchEdge.sourceHandle), currentDecisionTasks];
  });

  // we split tasks for decision cases and for `default` case
  const [decisionCases, defaultCase] = partition(decisionTasks, (d) => d[0] !== 'default');

  // we convert [string, Task[]][] -> Record<string, Task[]>
  currentTask.decisionCases = decisionCases.reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {});
  const defaultCaseTasks = defaultCase[0][1];
  currentTask.defaultCase = defaultCaseTasks;

  // it is possible that current decision task is nested
  // we need to find all elements after decision end node till the diagram end or when there is another join
  // to upper nest level
  try {
    const nextJoinNode = findForkOrDecisionEndNode(elements, decisionEndNode, 0);
    const nextTasks: Task[] = traverseElements([], elements, decisionEndNode.id, nextJoinNode.id); // eslint-disable-line @typescript-eslint/no-use-before-define
    return [...tasks, currentTask, ...nextTasks];
  } catch {
    const nextTasks: Task[] = traverseElements([], elements, decisionEndNode.id, 'end'); // eslint-disable-line @typescript-eslint/no-use-before-define
    return [...tasks, currentTask, ...nextTasks];
  }
}

function getForkTask(tasks: Task[], elements: Elements, currentNode: Node): Task[] {
  const currentTask = convertNodeToTask(currentNode) as ForkTask;
  const children = getOutgoers(currentNode, elements);
  const joinNode = findForkOrDecisionEndNode(elements, currentNode, 0);

  currentTask.forkTasks = children.map((fork) => {
    return traverseElements([], elements, fork.id, joinNode.id); // eslint-disable-line @typescript-eslint/no-use-before-define
  });

  // it is possible that current fork task is nested
  // we need to find all elements after fork end node till the diagram end or when there is another join
  // to upper nest level
  try {
    const nextJoinNode = findForkOrDecisionEndNode(elements, joinNode, 0);
    const nextTasks: Task[] = traverseElements([], elements, joinNode.id, nextJoinNode.id); // eslint-disable-line @typescript-eslint/no-use-before-define
    return [...tasks, currentTask, ...nextTasks];
  } catch {
    const nextTasks: Task[] = traverseElements([], elements, joinNode.id, 'end'); // eslint-disable-line @typescript-eslint/no-use-before-define
    return [...tasks, currentTask, ...nextTasks];
  }
}

function traverseElements(tasks: Task[], elements: Elements, id: string, endId = 'end'): Task[] {
  if (id === endId) {
    return tasks;
  }

  const [nodes] = partition(elements, isNode);

  const currentNode = unwrap(nodes.find((n) => n.id === id));
  const currentTask = convertNodeToTask(currentNode);
  const children = getOutgoers(currentNode, elements);

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

export function convertToTasks(elements: Elements): Task[] {
  const [nodes] = partition(elements, isNode);

  const startNode = unwrap(nodes.find((n) => n.id === 'start'));
  const children = getOutgoers(startNode, elements);

  const tasks = traverseElements([], elements, children[0].id);
  return tasks;
}
