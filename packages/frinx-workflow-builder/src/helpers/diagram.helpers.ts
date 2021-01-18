import { createSchema } from 'beautiful-react-diagrams';
import { DiagramSchema, Link } from 'beautiful-react-diagrams/@types/DiagramSchema';
import WorkflowNode from '../components/nodes/workflow-node';
import BaseNode from '../components/nodes/start-end-node';
import { CustomNodeType, NodeData, Task, TaskWithId, Workflow } from './types';

export function createNodesFromWorkflow(
  wf: Workflow<TaskWithId>,
  clickHandler: (data?: NodeData) => void,
): CustomNodeType[] {
  return wf.tasks.map((t, i) => ({
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
  }));
}

export function createStartNode(clickHandler: (data?: NodeData) => void): CustomNodeType {
  return {
    content: 'START',
    id: 'start',
    coordinates: [100, 100],
    outputs: [{ id: 'out-port-start', alignment: 'right' }],
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
    inputs: [{ id: 'in-port-end', alignment: 'left' }],
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

export function createWorkflowNode(clickHandler: (data?: NodeData) => void, task: Task): CustomNodeType {
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
