import { createElement } from 'react';
import { createSchema } from 'beautiful-react-diagrams';
import { DiagramSchema, Link } from 'beautiful-react-diagrams/@types/DiagramSchema';
import { v4 as uuid } from 'uuid';
import TaskNode from '../components/nodes/task-node';
import BaseNode from '../components/nodes/start-end-node';
import DecisionNode from '../components/nodes/decision-node';
import { CustomNodeType, ExtendedTask, Workflow, NodeData, DecisionTask, Task } from './types';
import { getTaskLabel } from './task.helpers';
import unwrap from './unwrap';
import ReadOnlyTaskNode from '../components/nodes/read-only-task-node';
import ReadOnlyDecisionNode from '../components/nodes/read-only-decision-node';
import LinkLabel from '../components/link-label/link-label';

const NODE_WIDTH = 275;
const MAIN_Y_AXIS_POSITON = 300;
const PREPARED_DECISION_CASES = 5;

function serializeGenericId(id: string, type: 'input' | 'output'): string {
  return JSON.stringify({ id, type });
}
function serializeDecisionId(id: string, type: string): string {
  return JSON.stringify({ id, type });
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

type Position = {
  x: number;
  y: number;
};
class DiagramController {
  workflow: Workflow<ExtendedTask>;

  isReadOnly: boolean;

  onDeleteBtnClick: ((id: string) => void) | undefined = undefined;

  private step = 0;

  private depth = 1;

  constructor(workflow: Workflow<ExtendedTask>, isReadOnly = false) {
    this.workflow = workflow;
    this.isReadOnly = isReadOnly;
  }

  createGenericTaskNode = (task: ExtendedTask, position: Position): CustomNodeType => {
    if (task.type === 'DECISION') {
      const keys = Object.keys(task.decisionCases);
      return {
        content: task.name,
        id: task.id,
        coordinates: [position.x, position.y],
        render: this.isReadOnly ? ReadOnlyDecisionNode : DecisionNode,
        disableDrag: this.isReadOnly,
        inputs: [
          {
            id: serializeGenericId(task.id, 'input'),
            alignment: 'left',
          },
        ],
        outputs: [
          ...Array.from(new Array(PREPARED_DECISION_CASES)).map((_, index) => {
            return {
              id: serializeDecisionId(task.id, index.toString()),
              alignment: 'right' as const,
            };
          }),
          {
            id: serializeDecisionId(task.id, 'else'),
            alignment: 'right',
          },
        ],
        data: {
          task,
          decisionCases: {
            ...keys.reduce(
              (acc, curr, index) => ({
                [index.toString()]: curr,
                ...acc,
              }),
              { [PREPARED_DECISION_CASES.toString()]: 'else' },
            ),
            ...Array.from(new Array(PREPARED_DECISION_CASES - keys.length)).reduce((acc, _, index) => {
              return { ...acc, [(index + keys.length).toString()]: null };
            }, {}),
          },
        },
      };
    }
    return {
      content: task.name,
      id: task.id,
      render: this.isReadOnly ? ReadOnlyTaskNode : TaskNode,
      disableDrag: this.isReadOnly,
      coordinates: [position.x, position.y],
      outputs: [
        {
          id: serializeGenericId(task.id, 'output'),
          alignment: 'right',
        },
      ],
      inputs: [
        {
          id: serializeGenericId(task.id, 'input'),
          alignment: 'left',
        },
      ],
      data: {
        task,
      },
    };
  };

  createStartNode = (): CustomNodeType => {
    return {
      content: 'start',
      id: 'start',
      coordinates: [100, MAIN_Y_AXIS_POSITON],
      outputs: [{ id: serializeGenericId('start', 'output'), alignment: 'right' }],
      render: BaseNode,
      data: undefined,
    };
  };

  createEndNode = (position: Position): CustomNodeType => {
    return {
      content: 'end',
      id: 'end',
      coordinates: [position.x, position.y],
      inputs: [{ id: serializeGenericId('end', 'input'), alignment: 'left' }],
      render: BaseNode,
      data: undefined,
    };
  };

  createTaskNode = (task: ExtendedTask): CustomNodeType => {
    const nodeCoordinates = this.getDropAreaNodeCoordinates();

    if (task.type === 'START_TASK') {
      return this.createStartNode();
    }

    if (task.type === 'END_TASK') {
      return this.createEndNode(nodeCoordinates);
    }

    return this.createGenericTaskNode(task, nodeCoordinates);
  };

  createDecisionNodes(decisionTask: DecisionTask, position: Position): CustomNodeType[] {
    const currentStep = this.step;
    const decisionCaseTasks = Object.keys(decisionTask.decisionCases).map((key) => {
      return decisionTask.decisionCases[key];
    });
    const decisionCaseNodes = decisionCaseTasks
      .map((tasks, index) => {
        this.step = currentStep;
        return tasks
          .map((tsk) => {
            this.step += 1;
            if (tsk.type === 'DECISION') {
              this.depth += 1;
              return this.createDecisionNodes(tsk, {
                x: NODE_WIDTH * this.step,
                y: this.depth * ((position.y / 4) * index),
              });
            }
            return this.createGenericTaskNode(
              { ...tsk, id: uuid(), label: getTaskLabel(tsk) },
              {
                x: NODE_WIDTH * this.step,
                y: this.depth * ((position.y / 4) * index),
              },
            );
          })
          .flat();
      })
      .flat();
    this.step = currentStep;
    const defaultTasks = decisionTask.defaultCase
      .map((tsk) => {
        this.step += 1;
        if (tsk.type === 'DECISION') {
          this.depth -= 1;
          return this.createDecisionNodes(tsk, {
            x: NODE_WIDTH * this.step,
            y: position.y + this.depth * (position.y / 4),
          });
        }
        return this.createGenericTaskNode(
          { ...tsk, id: uuid(), label: getTaskLabel(tsk) },
          { x: NODE_WIDTH * this.step, y: position.y + this.depth * (position.y / 4) },
        );
      })
      .flat();
    this.depth -= 1;
    this.step = currentStep + Math.max(...decisionCaseTasks.map((t) => t.length), defaultTasks.length);
    const extendedTask = {
      ...decisionTask,
      id: uuid(),
      label: getTaskLabel(decisionTask),
    };
    return [this.createGenericTaskNode(extendedTask, position), ...decisionCaseNodes, ...defaultTasks];
  }

  createNodesFromWorkflow = (): CustomNodeType[] => {
    return this.workflow.tasks.reduce((acc, t) => {
      this.step += 1;
      if (t.type === 'DECISION') {
        this.depth += 1;
        return [
          ...acc,
          ...this.createDecisionNodes(t, {
            x: NODE_WIDTH * this.step,
            y: MAIN_Y_AXIS_POSITON,
          }),
        ];
      }
      // this.step += this.dTasksIndex + this.defaultTasksIndex;
      return [
        ...acc,
        this.createGenericTaskNode(t, {
          x: NODE_WIDTH * this.step,
          y: MAIN_Y_AXIS_POSITON,
        }),
      ];
    }, [] as CustomNodeType[]);
  };

  getDecisionCasesLength = (decisionCases: Record<string, Task[]>): number => {
    let result = 0;
    Object.values(decisionCases).forEach((tasks) => {
      tasks.forEach((task) => {
        result += 1;
        if (task.type === 'DECISION') {
          result += this.getDecisionCasesLength(task.decisionCases);
          result += this.getTasksLength(task.defaultCase);
        }
      });
    });
    return result;
  };

  getTasksLength = (tasks: Task[]): number => {
    let result = 0;
    tasks.forEach((task) => {
      result += 1;
      if (task.type === 'DECISION') {
        result += this.getTasksLength(task.defaultCase);
        result += this.getDecisionCasesLength(task.decisionCases);
      }
    });
    return result;
  };

  getDropAreaNodeCoordinates = (): Position => ({
    x: Math.floor(Math.random() * 200) + 100,
    y: Math.floor(Math.random() * 100) + 100,
  });

  createLinks = (nodes: CustomNodeType[]): Link[] => {
    const state: Record<number, [{ id: string; type: 'input' | 'output' }]> = nodes.reduce(
      (acc, _, index) => ({ ...acc, [index]: [] }),
      {},
    );
    const maybeLinks = nodes.reduce((acc, curr, index, array) => {
      if (curr.data?.task?.type === 'DECISION') {
        const { task } = curr.data;
        const outputs = unwrap(curr.outputs);
        const decisionCasesLength = this.getDecisionCasesLength(curr.data.task.decisionCases);
        const defaultTasksLength = this.getTasksLength(curr.data.task.defaultCase);
        const nextNodeInputId = unwrap(nodes[index + decisionCasesLength + defaultTasksLength + 1].inputs)[0].id;
        let dTaskLength = 0;
        Object.keys(task.decisionCases).forEach((key, idx) => {
          if (dTaskLength !== 0) {
            state[index + dTaskLength + 1].push({
              id: outputs[idx].id,
              type: 'input',
            });
          }
          dTaskLength += this.getTasksLength(task.decisionCases[key]);
          state[index + dTaskLength].push({ id: nextNodeInputId, type: 'output' });
        });
        // else
        state[index + decisionCasesLength + 1].push({
          id: outputs[outputs.length - 1].id,
          type: 'input',
        });
      }
      const stateLinks: Link[] = state[index].length
        ? state[index].map((l) => ({
            input: l.type === 'output' ? unwrap(curr.outputs)[0].id : l.id,
            output: l.type === 'output' ? l.id : unwrap(curr.inputs)[0].id,
            label: createElement(LinkLabel),
            className: 'custom-link',
          }))
        : [];
      const nextNode = array[index + 1] ?? null;
      const hasLink = state[index] && state[index].find((l) => l.type === 'output');
      const link: Link | null =
        nextNode != null && !hasLink
          ? {
              input: curr.outputs != null ? curr.outputs[0].id : '',
              output: nextNode?.inputs != null ? nextNode.inputs[0].id : '',
              label: createElement(LinkLabel),
              className: 'custom-link',
            }
          : null;
      return [...acc, link, ...stateLinks];
    }, [] as (Link | null)[]);

    return dropNullValues(maybeLinks);
  };

  createSchemaFromWorkflow = (): DiagramSchema<NodeData> => {
    const nodesFromWorkflow = this.createNodesFromWorkflow();
    const nodes = [
      this.createStartNode(),
      ...nodesFromWorkflow,
      this.createEndNode({ x: NODE_WIDTH * (this.step + 1), y: MAIN_Y_AXIS_POSITON }),
    ];
    const links = this.createLinks(nodes);

    return createSchema({
      nodes,
      links,
    });
  };
}

export function createDiagramController(workflow: Workflow<ExtendedTask>, isReadOnly?: boolean): DiagramController {
  return new DiagramController(workflow, isReadOnly);
}
