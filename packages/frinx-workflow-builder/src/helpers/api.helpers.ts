import { partition } from 'lodash';
import { Elements, isNode, Node, getConnectedEdges, getOutgoers, getIncomers } from 'react-flow-renderer';
import { Task } from './types';
import unwrap from './unwrap';

function convertNodeToTask(node: Node): Task {
  const { data } = node;
  return data.task;
}

function findJoinNode(elements: Elements, forkNode: Node, depth: number): Node {
  const children = getOutgoers(forkNode, elements);
  // eslint-disable-next-line no-restricted-syntax
  for (const ch of children) {
    if (getIncomers(ch, elements).length > 1) {
      return ch;
    }
    return findJoinNode(elements, ch, depth + 1);
  }

  throw Error('no valid join was found');
}

function isConnectionNode(node: Node, elements: Elements): boolean {
  return getIncomers(node, elements).length > 1;
}

function findDecisionEndNode(elements: Elements, node: Node, depth: number): Node {
  let newDepth = depth;
  const children = getOutgoers(node, elements);
  // eslint-disable-next-line no-restricted-syntax
  for (const ch of children) {
    newDepth = isConnectionNode(ch, elements) ? newDepth - 1 : newDepth;
    newDepth = ch.data.task.type === 'DECISION' ? newDepth + 1 : newDepth;

    if (getIncomers(ch, elements).length > 1 && depth === 0) {
      return ch;
    }
    return findDecisionEndNode(elements, ch, newDepth);
  }

  throw Error('no valid decision end was found');
}

function traverseElements(tasks: Task[], elements: Elements, id: string, endId = 'end', depth = 0): Task[] {
  if (id === endId) {
    return tasks;
  }

  const [nodes, edges] = partition(elements, isNode);

  const currentNode = unwrap(nodes.find((n) => n.id === id));
  const currentTask = convertNodeToTask(currentNode);
  const children = getOutgoers(currentNode, elements);

  // DECISION
  if (currentTask.type === 'DECISION') {
    const decisionEndNode = findDecisionEndNode(elements, currentNode, 0);

    const decisionTasks: [string, Task[]][] = children.map((decision) => {
      const connectionEdges = getConnectedEdges([decision], edges);
      const startBranchEdge = unwrap(connectionEdges.find((e) => e.source === currentTask.taskReferenceName));
      const decisionStartNode = unwrap(nodes.find((n) => n.id === startBranchEdge?.target));
      const currentDecisionTasks = traverseElements([], elements, decisionStartNode.id, decisionEndNode.id);
      return [unwrap(startBranchEdge.sourceHandle), currentDecisionTasks];
    });

    const [decisionCases, defaultCase] = partition(decisionTasks, (d) => d[0] !== 'default');

    currentTask.decisionCases = decisionCases.reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {});
    const defaultCaseTasks = defaultCase[0][1];
    currentTask.defaultCase = defaultCaseTasks;

    const nextTasks: Task[] = traverseElements([], elements, decisionEndNode.id, 'end');
    return [...tasks, currentTask, ...nextTasks];
  }

  // FORK JOIN
  if (currentTask.type === 'FORK_JOIN') {
    const joinNode = findJoinNode(elements, currentNode, depth);

    currentTask.forkTasks = children.map((fork) => {
      return traverseElements([], elements, fork.id, joinNode.id, depth + 1);
    });

    const nextTasks = traverseElements([], elements, joinNode.id, 'end', depth);

    return [...tasks, currentTask, ...nextTasks];
  }

  // SIMPLE
  const nextTasks = children.map((n) => {
    return traverseElements([], elements, n.id, endId, depth);
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
