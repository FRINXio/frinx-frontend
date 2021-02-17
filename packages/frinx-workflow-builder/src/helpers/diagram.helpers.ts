import { createSchema } from 'beautiful-react-diagrams';
import { flatten } from 'lodash';
import { DiagramSchema, Link } from 'beautiful-react-diagrams/@types/DiagramSchema';
import { v4 as uuid } from 'uuid';
import WorkflowNode from '../components/nodes/workflow-node';
import BaseNode from '../components/nodes/start-end-node';
import DecisionNode from '../components/nodes/decision-node';
import { CustomNodeType, DecisionTask, NodeData, Task, TaskWithId, Workflow } from './types';

function craeteDecisionNode(
  clickHandler: (data?: NodeData) => void,
  task: DecisionTask & { id: string },
): CustomNodeType {
  return {
    content: task.name,
    id: task.id,
    coordinates: [100, 200],
    render: DecisionNode,
    inputs: [
      {
        id: task.id,
        alignment: 'left',
      },
    ],
    outputs: [
      ...Object.keys(task.decisionCases).map((key) => {
        return {
          id: `${key}:${task.id}`,
        };
      }),
      {
        id: `else:${task.id}`,
      },
    ],
    data: {
      onClick: clickHandler,
      isSelected: false,
      task,
    },
  };
}

function convertTaskToNode(t: TaskWithId, i: number, clickHandler: (data?: NodeData) => void): CustomNodeType {
  return {
    content: t.name,
    id: t.id,
    render: WorkflowNode,
    coordinates: [300 * (i + 1), 100],
    outputs: [
      {
        id: t.id,
        alignment: 'right',
      },
    ],
    inputs: [
      {
        id: t.id,
        alignment: 'left',
      },
    ],
    data: {
      task: t,
      isSelected: false,
      onClick: clickHandler,
    },
  };
}

export function createNodesFromWorkflow(
  wf: Workflow<TaskWithId>,
  clickHandler: (data?: NodeData) => void,
): CustomNodeType[] {
  return wf.tasks.reduce((acc, t, i) => {
    if (t.type === 'DECISION') {
      const dTasks = flatten(Object.keys(t.decisionCases).map((key) => t.decisionCases[key])).map((tsk) => {
        return convertTaskToNode({ ...tsk, id: uuid() }, i, clickHandler);
      });
      return [...acc, craeteDecisionNode(clickHandler, t), ...dTasks];
    }

    return [...acc, convertTaskToNode(t, i, clickHandler)];
  }, [] as CustomNodeType[]);
}

export function createStartNode(clickHandler: (data?: NodeData) => void): CustomNodeType {
  return {
    content: 'START',
    id: 'start',
    coordinates: [100, 100],
    outputs: [{ id: 'start', alignment: 'right' }],
    render: BaseNode,
    data: {
      isSelected: false,
      onClick: clickHandler,
      task: null,
    },
  };
}

export function createEndNode(index: number, clickHandler: (data?: NodeData) => void): CustomNodeType {
  return {
    content: 'END',
    id: 'end',
    coordinates: [300 * index, 100],
    inputs: [{ id: 'end', alignment: 'left' }],
    render: BaseNode,
    data: {
      isSelected: false,
      onClick: clickHandler,
      task: null,
    },
  };
}

function dropNullValues<T>(array: (T | null)[]): T[] {
  const result: T[] = [];
  array.forEach((value) => {
    if (value != null) {
      result.push(value);
    }
  });
  return result;
}

export function createLinks(values: CustomNodeType[]): Link[] {
  const maybeLinks = values.reduce((acc, curr, index, array) => {
    const nextNode = array[index + 1] ?? null;
    const link: Link | null =
      nextNode != null
        ? {
            input: curr.outputs != null ? curr.outputs[0].id : '',
            output: nextNode?.inputs != null ? nextNode.inputs[0].id : '',
          }
        : null;
    return [...acc, link];
  }, [] as (Link | null)[]);

  return dropNullValues(maybeLinks);
}

export function createSchemaFromWorkflow(
  wf: Workflow<TaskWithId>,
  clickHandler: (data?: NodeData) => void,
): DiagramSchema<NodeData> {
  const nodesFromWorkflow = createNodesFromWorkflow(wf, clickHandler);
  const nodes = [
    createStartNode(clickHandler),
    ...nodesFromWorkflow,
    createEndNode(nodesFromWorkflow.length + 1, clickHandler),
  ];
  const links = createLinks(nodes);

  return createSchema({
    nodes,
    links,
  });
}

export function createWorkflowNode(clickHandler: (data?: NodeData) => void, task: TaskWithId): CustomNodeType {
  if (task.type === 'DECISION') {
    return craeteDecisionNode(clickHandler, task);
  }

  return {
    content: task.name,
    id: task.id,
    coordinates: [100, 100],
    render: WorkflowNode,
    inputs: [
      {
        id: task.id,
        alignment: 'left',
      },
    ],
    outputs: [
      {
        id: task.id,
        alignment: 'right',
      },
    ],
    data: {
      onClick: clickHandler,
      isSelected: false,
      task,
    },
  };
}
