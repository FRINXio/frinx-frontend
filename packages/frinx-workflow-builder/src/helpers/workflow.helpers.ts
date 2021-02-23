import { DiagramSchema } from 'beautiful-react-diagrams/@types/DiagramSchema';
import { v4 as uuid } from 'uuid';
import { getTaskLabel } from './task.helpers';
import { NodeData, Task, ExtendedTask, Workflow } from './types';

export function convertDiagramTasks(schema: DiagramSchema<NodeData>): Task[] {
  return [];
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
