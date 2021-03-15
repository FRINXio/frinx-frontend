import { DiagramSchema, Link } from 'beautiful-react-diagrams/@types/DiagramSchema';
import { cloneDeep } from 'lodash';
import { v4 as uuid } from 'uuid';
import { getTaskLabel } from './task.helpers';
import { NodeData, Task, ExtendedTask, Workflow, CustomNodeType } from './types';
import unwrap from './unwrap';

export function deserializeId(id: string): { type: string; id: string } {
  return JSON.parse(id);
}

function dropNullAndUndefValues<T>(array: (T | null | undefined)[]): T[] {
  const result: T[] = [];
  array.forEach((value) => {
    if (value != null) {
      result.push(value);
    }
  });
  return result;
}

class WorkflowHelper {
  nodes: CustomNodeType[] | null = null;

  links: Link[] | null = null;

  workflow: Workflow<ExtendedTask>;

  constructor(workflow: Workflow<ExtendedTask>) {
    this.workflow = workflow;
  }

  private getNextNodes(node: CustomNodeType, type: string): CustomNodeType[] {
    if (this.nodes == null || this.links == null) {
      throw new Error('diagramSchema is not set!');
    }
    return dropNullAndUndefValues(
      this.links
        .filter((l) => {
          const { id: inputId, type: inputType } = deserializeId(l.input);
          const { id: outputId, type: outputType } = deserializeId(l.output);
          if (inputId === node.id && inputType === type) {
            return l;
          }
          if (outputId === node.id && outputType === type) {
            return l;
          }
          return false;
        })
        .map((l) => {
          const { id: inputId } = deserializeId(l.input);
          const { id: outputId } = deserializeId(l.output);
          if (inputId === node.id) {
            return unwrap(this.nodes).find((n) => n.id === outputId);
          }
          if (outputId === node.id) {
            return unwrap(this.nodes).find((n) => n.id === inputId);
          }
          return null;
        }),
    );
  }

  private setSchemaVaues = (schema: DiagramSchema<NodeData>) => {
    const { nodes, links } = schema;

    this.nodes = cloneDeep(nodes);
    this.links = cloneDeep(unwrap(links));
  };

  private stripId = (task: ExtendedTask): Task => {
    const { id, ...rest } = task;
    return rest;
  };

  private convertDiagramTasks = (): Task[] => {
    if (this.nodes == null || this.links == null) {
      throw new Error('diagramSchema is not set!');
    }

    const startNode = unwrap(this.nodes.find((n) => n.id === 'start'));
    const [firstNode] = this.getNextNodes(startNode, 'output');
    const stack: { node: CustomNodeType; parentTasks: Task[]; tasks: Task[] }[] = [];
    const rootTasks: ExtendedTask[] = [];
    const visitedNodes: Set<CustomNodeType> = new Set();

    stack.push({ node: firstNode, tasks: rootTasks, parentTasks: rootTasks });

    while (stack.length) {
      const { node, tasks, parentTasks } = unwrap(stack.shift());
      const t = node.data?.task ?? null;
      const task = t ? this.stripId(t) : null;
      if (task?.type === 'DECISION') {
        tasks.push(task);
        task.decisionCases[Object.keys(task.decisionCases)[0]] = [];
        task.defaultCase = [];
        const dTasks = task.decisionCases[Object.keys(task.decisionCases)[0]];
        const [firstOutputNode] = this.getNextNodes(node, '0');
        stack.unshift({ node: firstOutputNode, tasks: dTasks, parentTasks: tasks });
        const [secondOutputNode] = this.getNextNodes(node, 'else');
        const defaultTasks = task.defaultCase;
        stack.unshift({ node: secondOutputNode, tasks: defaultTasks, parentTasks: tasks });
      } else if (node.id !== 'end') {
        if (!visitedNodes.has(node)) {
          const [nextNode] = this.getNextNodes(node, 'output');
          if (this.getNextNodes(node, 'input').length === 2) {
            parentTasks.push(this.stripId(unwrap(node.data?.task)));
            stack.unshift({ node: nextNode, tasks: parentTasks, parentTasks });
          } else {
            tasks.push(this.stripId(unwrap(node.data?.task)));
            stack.unshift({ node: nextNode, tasks, parentTasks });
          }
          visitedNodes.add(node);
        }
      }
    }

    return rootTasks;
  };

  convertWorkflow = (schema: DiagramSchema<NodeData>): Workflow => {
    this.setSchemaVaues(schema);

    const { tasks, ...rest } = this.workflow;
    return {
      ...rest,
      tasks: this.convertDiagramTasks(),
    };
  };
}

export function createWorkflowHelper(workflow: Workflow<ExtendedTask>): WorkflowHelper {
  return new WorkflowHelper(workflow);
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
