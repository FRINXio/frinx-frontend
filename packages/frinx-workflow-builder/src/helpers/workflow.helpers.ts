import { DiagramSchema, Link } from 'beautiful-react-diagrams/@types/DiagramSchema';
import { v4 as uuid } from 'uuid';
import { getTaskLabel } from './task.helpers';
import { NodeData, Task, ExtendedTask, Workflow, CustomNodeType } from './types';
import unwrap from './unwrap';

function parseId(id: string) {
  const arr = id.split(':');

  if (arr.length === 1) {
    return {
      type: null,
      id,
    };
  }

  return {
    type: arr[0],
    id: arr[1],
  };
}

function hasTwoInputLinks(node: CustomNodeType, links: Link[]): boolean {
  if (node.inputs == null) {
    return false;
  }
  const { id } = node.inputs[0];

  return links.filter((l) => l.output === id).length === 2;
}

function getNextNodeId(links: Link[], nodeId: string): string {
  const { type, id } = parseId(nodeId);
  if (type == null) {
    const nextOutputId = unwrap(links).find((l) => l.input === id)?.output ?? null;
    if (nextOutputId == null || nextOutputId === 'start') {
      return parseId(unwrap(unwrap(links).find((l) => l.output === id)?.input)).id;
    }
    return parseId(nextOutputId).id;
  }
  console.log({ nodeId });
  const nextOutputId = links.find((l) => parseId(l.output).id === id)?.input;

  if (nextOutputId == null || nextOutputId === 'start') {
    return parseId(unwrap(links.find((l) => parseId(l.input).id === id)).output).id;
  }
  return parseId(nextOutputId).id;
}

export function convertDiagramTasks(schema: DiagramSchema<NodeData>): Task[] {
  const { links, nodes } = schema;
  console.log(links);
  const firstNodeId =
    unwrap(links).find((l) => l.input === 'start')?.output || unwrap(links).find((l) => l.output === 'start')?.input;
  const firstNode = unwrap(nodes.find((n) => n.id === parseId(unwrap(firstNodeId)).id));
  const stack: { node: CustomNodeType; parentTasks: Task[]; tasks: Task[] }[] = [];
  const rootTasks: Task[] = [];
  const visitedNodes: Set<CustomNodeType> = new Set();

  // console.log({ firstNode });

  stack.push({ node: firstNode, tasks: rootTasks, parentTasks: rootTasks });

  while (stack.length) {
    const { node, tasks, parentTasks } = unwrap(stack.shift());

    if (node.data?.task.type === 'DECISION') {
      tasks.push(node.data.task);
      node.data.task.decisionCases[Object.keys(node.data?.task.decisionCases)[0]] = [];
      node.data.task.defaultCase = [];
      const dTasks = node.data.task.decisionCases[Object.keys(node.data?.task.decisionCases)[0]];
      // const firstOutputNodeId = unwrap(unwrap(links).find((l) => l.input === unwrap(node.outputs)[0].id)).output;
      const firstOutputNodeId = getNextNodeId(unwrap(links), unwrap(node.outputs)[0].id);
      const firstOutputNode = unwrap(nodes.find((n) => n.id === firstOutputNodeId));
      console.log({ firstOutputNode });
      stack.unshift({ node: firstOutputNode, tasks: dTasks, parentTasks: tasks });
      // const secondOutputNodeId = unwrap(unwrap(links).find((l) => l.input === unwrap(node.outputs)[1].id)).output;
      const secondOutputNodeId = getNextNodeId(unwrap(links), unwrap(node.outputs)[1].id);
      const secondOutputNode = unwrap(nodes.find((n) => n.id === secondOutputNodeId));
      const defaultTasks = node.data.task.defaultCase;
      stack.unshift({ node: secondOutputNode, tasks: defaultTasks, parentTasks: tasks });
    } else if (node.id !== 'end') {
      // console.log({ node });
      if (!visitedNodes.has(node)) {
        const nextNodeId = getNextNodeId(unwrap(links), unwrap(node.outputs)[0].id);
        // console.log(unwrap(links).find((l) => l.output === unwrap(node.outputs)[0].id)?.output);
        const nextNode = unwrap(nodes.find((n) => n.id === nextNodeId));
        if (hasTwoInputLinks(node, unwrap(links))) {
          parentTasks.push(node.data?.task);
          stack.unshift({ node: nextNode, tasks: parentTasks, parentTasks });
        } else {
          tasks.push(node.data?.task);
          stack.unshift({ node: nextNode, tasks, parentTasks });
        }
        visitedNodes.add(node);
      }
    }
  }

  visitedNodes.clear();

  return rootTasks;
}

export function convertDiagramWorkflow(schema: DiagramSchema<NodeData>, workflow: Workflow<Task>): Workflow<Task> {
  const { tasks, ...rest } = workflow;
  return {
    ...rest,
    tasks: convertDiagramTasks(schema),
  };
}

export function convertWorkflow(wf: Workflow): Workflow<ExtendedTask> {
  const { tasks, ...rest } = wf;
  return {
    ...rest,
    tasks: tasks.map((t) => ({
      ...t,
      id: uuid(),
      label: getTaskLabel(t),
    })),
  };
}
