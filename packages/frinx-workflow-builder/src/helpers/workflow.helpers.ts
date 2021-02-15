import { parse } from '@babel/core';
import { DiagramSchema } from 'beautiful-react-diagrams/@types/DiagramSchema';
import { flatten } from 'lodash';
import { DecisionTask, NodeData, Task, Workflow } from './types';
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

function prepareLinks<T extends { input: string }>(array: T[]): T[] {
  const arrCopy = [...array];
  const index = array.findIndex(v => v.input === 'start');
  arrCopy.splice(index, 1);
  arrCopy.splice(0, 0, array[index]);
  return arrCopy;
}

export function convertDiagramTasks(schema: DiagramSchema<NodeData>): Task[] | null {
  const { nodes, links } = schema;

  console.log(links);

  if (links == null) {
    return null;
  }

  const result = prepareLinks(links).reduce((acc, link) => {
    const node = unwrap(
      nodes.find(n => {
        return n.id === parseId(link.input).id;
      }),
    );
    const parsedOutput = parseId(link.output);
    const parsedInput = parseId(link.input);
    const task = node.data?.task ?? null;
    const taskCopy = task ? { ...task } : null;

    if (parsedInput.type != null || parsedOutput.type != null) {
      return acc;
    }

    if (taskCopy && taskCopy.type === 'DECISION') {
      taskCopy.decisionCases = links
        .filter(l => {
          const parsedOutputId = parseId(l.output);
          const parsedInputId = parseId(l.input);
          if (parsedOutputId.type != null) {
            return parsedOutputId.id === taskCopy.id;
          }
          return parsedInputId.type != null && parsedInputId.id === taskCopy.id;
        })
        .reduce((accu, curr) => {
          const parsedOutputId = parseId(curr.output);
          const parsedInputId = parseId(curr.input);

          if (parsedOutputId.type != null) {
            const targetNode = unwrap(nodes.find(n => n.id === curr.input));
            return {
              ...accu,
              [parsedOutputId.type]: unwrap(targetNode.data?.task),
            };
          }
          const targetNode = unwrap(nodes.find(n => n.id === curr.output));

          return {
            ...accu,
            [unwrap(parsedInputId.type)]: unwrap(targetNode.data?.task),
          };
        }, {});
      return [...acc, taskCopy];
    }

    if (taskCopy == null || node.id === 'start' || node.id === 'end') {
      return acc;
    }

    return [...acc, taskCopy];
  }, [] as Task[]);

  const outputLinks = links.filter(l => parseId(l.input).type != null).map(l => l.output);
  const inputLinks = links.filter(l => parseId(l.output).type != null).map(l => l.input);

  return result.filter(task => outputLinks.includes(task.id) || inputLinks.includes(task.id));
}

export function convertDiagramWorkflow(schema: DiagramSchema<NodeData>, workflow: Workflow): Workflow<Task> {
  const { tasks, ...rest } = workflow;
  return {
    ...rest,
    tasks:
      convertDiagramTasks(schema)?.map(t => {
        const { id, ...task } = t;
        return task;
      }) ?? [],
  };
}
