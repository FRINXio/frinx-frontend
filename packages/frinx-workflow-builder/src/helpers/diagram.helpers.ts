import { createSchema } from 'beautiful-react-diagrams';
import { flatten } from 'lodash';
import { DiagramSchema, Link } from 'beautiful-react-diagrams/@types/DiagramSchema';
import { v4 as uuid } from 'uuid';
import WorkflowNode from '../components/nodes/workflow-node';
import BaseNode from '../components/nodes/start-end-node';
import DecisionNode from '../components/nodes/decision-node';
import { CustomNodeType, DecisionTask, NodeData, ExtendedTask, Workflow, TaskLabel } from './types';
import { getTaskLabel } from './task.helpers';

function craeteDecisionNode(
  task: DecisionTask & { id: string; label: TaskLabel },
  i: number,
  clickHandler: (data?: NodeData) => void,
): CustomNodeType {
  return {
    content: task.name,
    id: task.id,
    coordinates: [275 * (i + 1), 100],
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

function convertTaskToNode(t: ExtendedTask, i: number, clickHandler: (data?: NodeData) => void): CustomNodeType {
  return {
    content: t.name,
    id: t.id,
    render: WorkflowNode,
    coordinates: [275 * (i + 1), 100],
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
  wf: Workflow<ExtendedTask>,
  clickHandler: (data?: NodeData) => void,
): CustomNodeType[] {
  return wf.tasks.reduce((acc, t, i) => {
    if (t.type === 'DECISION') {
      const dTasks = flatten(Object.keys(t.decisionCases).map((key) => t.decisionCases[key])).map((tsk, idx) => {
        return convertTaskToNode({ ...tsk, id: uuid(), label: getTaskLabel(tsk) }, idx + 1 + i, clickHandler);
      });
      return [...acc, craeteDecisionNode(t, i, clickHandler), ...dTasks];
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
      task: { id: 'start', label: 'start' },
    },
  };
}

export function createEndNode(index: number, clickHandler: (data?: NodeData) => void): CustomNodeType {
  return {
    content: 'END',
    id: 'end',
    coordinates: [275 * index, 100],
    inputs: [{ id: 'end', alignment: 'left' }],
    render: BaseNode,
    data: {
      isSelected: false,
      onClick: clickHandler,
      task: { id: 'end', label: 'end' },
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
            className: 'node__link',
          }
        : null;
    return [...acc, link];
  }, [] as (Link | null)[]);

  return dropNullValues(maybeLinks);
}

export function createSchemaFromWorkflow(
  wf: Workflow<ExtendedTask>,
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

export function createWorkflowNode(clickHandler: (data?: NodeData) => void, task: ExtendedTask): CustomNodeType {
  if (task.type === 'DECISION') {
    return craeteDecisionNode(task, 0, clickHandler);
  }

  if (task.type === 'START_TASK') {
    return createStartNode(clickHandler);
  }

  if (task.type === 'END_TASK') {
    return createEndNode(0, clickHandler);
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
