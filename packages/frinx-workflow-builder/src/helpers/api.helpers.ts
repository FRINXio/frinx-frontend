import { partition } from 'lodash';
import { Children } from 'react';
import { Elements, isNode, isEdge, Edge, Node, getConnectedEdges, getOutgoers, getIncomers } from 'react-flow-renderer';
import { Task, Workflow } from './types';
import unwrap from './unwrap';

function convertNodeToTask(node: Node): Task {
  const { data } = node;
  return data.task;
}

function findJoinNode(elements: Elements, forkNode: Node, depth: number): Node {
  const children = getOutgoers(forkNode, elements);
  for (const ch of children) {
    if (getIncomers(ch, elements).length > 1) {
      return ch;
    }
    return findJoinNode(elements, ch, depth + 1);
  }

  throw Error('no valid join was found');
}

function traverseElements(
  tasks: Task[],
  elements: Elements,
  id: string,
  endId: string = 'end',
  depth: number = 0,
): Task[] {
  if (id === endId) {
    return tasks;
  }

  const [nodes] = partition(elements, isNode);

  const currentNode = unwrap(nodes.find((n) => n.id === id));
  const currentTask = convertNodeToTask(currentNode);
  const children = getOutgoers(currentNode, elements);

  // FORK JOIN
  if (currentTask.type === 'FORK_JOIN') {
    const joinNode = findJoinNode(elements, currentNode, depth);
    console.log('joinNode: ', joinNode);

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
