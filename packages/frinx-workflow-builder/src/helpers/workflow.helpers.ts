import { DiagramSchema, Link, Node } from 'beautiful-react-diagrams/@types/DiagramSchema';
import { dropWhile } from 'lodash';
import { v4 as uuid } from 'uuid';
import { getTaskLabel } from './task.helpers';
import { NodeData, Task, ExtendedTask, Workflow } from './types';
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

function dropNullValues<T>(array: (T | null)[]): T[] {
  const result: T[] = [];
  array.forEach((value) => {
    if (value != null) {
      result.push(value);
    }
  });
  return result;
}

function getDecisionCaseKey(value: Record<string, Task[]>): string {
  return Object.keys(value).filter((k) => k !== 'else')[0];
}

function getNextNode(schema: DiagramSchema<NodeData>, id = 'start'): Node<NodeData> | null {
  const { links, nodes } = schema;
  const link = links?.find((l) => parseId(l.input).id === id);
  const node = nodes.find((n) => n.id === link?.output);
  if (node == null) {
    return null;
  }
  return node;
}

function prepareLinks<T extends { input: string }>(array: T[], id = 'start'): T[] {
  const arrCopy = [...array];
  const index = array.findIndex((v) => v.input === id);
  arrCopy.splice(index, 1);
  arrCopy.splice(0, 0, array[index]);
  return arrCopy;
}

export function convertDiagramTasks(schema: DiagramSchema<NodeData>, id = 'start'): ExtendedTask[] | null {
  // const { links } = schema;
  // const result = [];
  // for (let i = 0; i <= (links || []).length; i += 1) {
  //   const nextNode = getNextNode(schema, id);
  //   result.push(nextNode);
  //   id = nextNode?.id;
  // }
  // const tasks = dropNullValues(result)
  //   .filter((n) => n.id !== 'end')
  //   .map((n) => unwrap(n.data?.task));
  // return tasks.reduce((acc, curr) => {
  //   if (curr.type === 'DECISION') {
  //     const link = unwrap(links).find((l) => parseId(l.input).id === curr.id);
  //     curr.decisionCases = {
  //       [unwrap(parseId(unwrap(link).input).type)]: getNextNode(schema, parseId(unwrap(link).input).id),
  //     };
  //   }
  //   return [...acc, curr];
  // }, [] as ExtendedTask[]);
  // return tasks;
  // const { nodes, links } = schema;
  // if (links == null) {
  //   return null;
  // }
  // const preparedLinks = prepareLinks(links, id);
  // const idsToFilter: string[] = [];
  // const result = preparedLinks.reduce((acc, link) => {
  //   const node = unwrap(
  //     nodes.find((n) => {
  //       return n.id === parseId(link.input).id;
  //     }),
  //   );
  //   const parsedOutput = parseId(link.output);
  //   const parsedInput = parseId(link.input);
  //   const task = node.data?.task ?? null;
  //   const taskCopy = task ? { ...task } : null;
  //   if (node == null) {
  //     return acc;
  //   }
  //   // if (parsedOutput.type != null) {
  //   //   return acc;
  //   // }
  //   if (parsedInput.type != null) {
  //     idsToFilter.push(parsedOutput.id);
  //   }
  //   if (taskCopy && taskCopy.type === 'DECISION') {
  //     taskCopy.decisionCases = links
  //       .filter((l) => {
  //         const parsedOutputId = parseId(l.output);
  //         const parsedInputId = parseId(l.input);
  //         if (parsedOutputId.type != null) {
  //           return parsedOutputId.id === taskCopy.id;
  //         }
  //         return parsedInputId.type != null && parsedInputId.id === taskCopy.id;
  //       })
  //       .reduce((accu, curr) => {
  //         const parsedOutputId = parseId(curr.output);
  //         const parsedInputId = parseId(curr.input);
  //         if (parsedOutputId.type != null) {
  //           const targetNode = unwrap(nodes.find((n) => n.id === curr.input));
  //           return {
  //             ...accu,
  //             [parsedOutputId.type === 'else' ? 'else' : getDecisionCaseKey(taskCopy.decisionCases)]: [
  //               unwrap(targetNode.data?.task),
  //             ],
  //           };
  //         }
  //         const targetNode = unwrap(nodes.find((n) => n.id === curr.output));
  //         return {
  //           ...accu,
  //           [unwrap(parsedInputId.type) === 'else' ? 'else' : getDecisionCaseKey(taskCopy.decisionCases)]: [
  //             unwrap(targetNode.data?.task),
  //           ],
  //         };
  //       }, {});
  //     return [...acc, taskCopy];
  //   }
  //   if (taskCopy == null || node.id === 'start' || node.id === 'end') {
  //     return acc;
  //   }
  //   return [...acc, taskCopy];
  // }, [] as ExtendedTask[]);
  // return result.filter((t) => !idsToFilter.includes(t.id));
}

export function convertDiagramWorkflow(
  schema: DiagramSchema<NodeData>,
  workflow: Workflow<ExtendedTask>,
): Workflow<Task> {
  const { tasks, ...rest } = workflow;
  return {
    ...rest,
    tasks:
      convertDiagramTasks(schema)?.map((t) => {
        const { id, ...task } = t;
        return task;
      }) ?? [],
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
