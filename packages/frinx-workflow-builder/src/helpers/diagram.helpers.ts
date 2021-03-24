import { createSchema } from 'beautiful-react-diagrams';
import { flatten } from 'lodash';
import { DiagramSchema, Link } from 'beautiful-react-diagrams/@types/DiagramSchema';
import { v4 as uuid } from 'uuid';
import TaskNode from '../components/nodes/task-node';
import BaseNode from '../components/nodes/start-end-node';
import DecisionNode from '../components/nodes/decision-node';
import { CustomNodeType, ExtendedTask, Workflow, NodeData, DecisionTask, Task } from './types';
import { getTaskLabel } from './task.helpers';
import unwrap from './unwrap';

const NODE_WIDTH = 275;
const MAIN_Y_AXIS_POSITON = 150;
const DECISION_Y_AXIS_POSITON = 100;
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

  onDeleteBtnClick: ((id: string) => void) | undefined = undefined;

  private taskIndex = 0;

  private dTasksIndex = 0;

  private defaultTasksIndex = 0;

  private depth = 0;

  constructor(workflow: Workflow<ExtendedTask>) {
    this.workflow = workflow;
  }

  createGenericTaskNode = (task: ExtendedTask, position: Position): CustomNodeType => {
    if (task.type === 'DECISION') {
      return {
        content: task.name,
        id: task.id,
        coordinates: [position.x, position.y],
        render: DecisionNode,
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
            };
          }),
          {
            id: serializeDecisionId(task.id, 'else'),
          },
        ],
        data: {
          task,
          decisionCases: Object.keys(task.decisionCases).reduce(
            (acc, curr, index) => ({
              [index.toString()]: curr,
              ...acc,
            }),
            { [PREPARED_DECISION_CASES.toString()]: 'else' },
          ),
        },
      };
    }
    return {
      content: task.name,
      id: task.id,
      render: TaskNode,
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
    if (task.type === 'START_TASK') {
      return this.createStartNode();
    }

    if (task.type === 'END_TASK') {
      return this.createEndNode({ x: 100, y: 100 });
    }

    return this.createGenericTaskNode(task, { x: 100, y: 100 });
  };

  createDecisionNodes(decisionTask: DecisionTask, position: Position): CustomNodeType[] {
    console.log(this.dTasksIndex);
    this.dTasksIndex = Math.max(this.taskIndex, this.dTasksIndex);
    this.depth += 1;
    const dTasks = flatten(Object.keys(decisionTask.decisionCases).map((key) => decisionTask.decisionCases[key]))
      .map((tsk) => {
        this.dTasksIndex += 1;
        console.log('this.dTasksIndex: ', this.dTasksIndex);
        // this.taskIndex -= 1;
        if (tsk.type === 'DECISION') {
          return this.createDecisionNodes(tsk, {
            x: NODE_WIDTH * this.dTasksIndex,
            y: DECISION_Y_AXIS_POSITON * -(this.depth / 2),
          });
        }
        return this.createGenericTaskNode(
          { ...tsk, id: uuid(), label: getTaskLabel(tsk) },
          { x: NODE_WIDTH * this.dTasksIndex, y: DECISION_Y_AXIS_POSITON * -(this.depth / 2) },
        );
      })
      .flat();
    this.defaultTasksIndex = Math.max(this.taskIndex, this.defaultTasksIndex);
    const defaultTasks = decisionTask.defaultCase
      .map((tsk) => {
        this.defaultTasksIndex += 1;
        if (tsk.type === 'DECISION') {
          this.createDecisionNodes(tsk, {
            x: NODE_WIDTH * this.defaultTasksIndex,
            y: DECISION_Y_AXIS_POSITON * (this.depth / 2),
          });
        }
        return this.createGenericTaskNode(
          { ...tsk, id: uuid(), label: getTaskLabel(tsk) },
          { x: NODE_WIDTH * this.defaultTasksIndex, y: DECISION_Y_AXIS_POSITON * (this.depth / 2) },
        );
      })
      .flat();
    this.taskIndex += Math.max(this.dTasksIndex, this.defaultTasksIndex);
    const extendedTask = {
      ...decisionTask,
      id: uuid(),
      label: getTaskLabel(decisionTask),
    };
    return [this.createGenericTaskNode(extendedTask, position), ...dTasks, ...defaultTasks];
  }

  createNodesFromWorkflow = (): CustomNodeType[] => {
    return this.workflow.tasks.reduce((acc, t) => {
      this.taskIndex += 1;
      console.log('this.taskIndex: ', this.taskIndex);
      if (t.type === 'DECISION') {
        return [
          ...acc,
          ...this.createDecisionNodes(t, {
            x: NODE_WIDTH * this.taskIndex,
            y: MAIN_Y_AXIS_POSITON * this.depth,
          }),
        ];
      }
      // this.taskIndex += this.dTasksIndex + this.defaultTasksIndex;
      return [
        ...acc,
        this.createGenericTaskNode(t, {
          x: NODE_WIDTH * this.taskIndex,
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

  createLinks = (nodes: CustomNodeType[]): Link[] => {
    const state: Record<number, { id: string; type: 'input' | 'output' }> = {};
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
            state[index + dTaskLength + 1] = {
              id: outputs[idx].id,
              type: 'input',
            };
          }
          dTaskLength += this.getTasksLength(task.decisionCases[key]);
          state[index + dTaskLength] = { id: nextNodeInputId, type: 'output' };
        });
        // else
        state[index + decisionCasesLength + 1] = {
          id: outputs[outputs.length - 1].id,
          type: 'input',
        };
      }
      let stateLink: Link | null = null;
      if (state[index]) {
        stateLink = {
          input: state[index].type === 'output' ? unwrap(curr.outputs)[0].id : state[index].id,
          output: state[index].type === 'output' ? state[index].id : unwrap(curr.inputs)[0].id,
        };
      }
      const nextNode = array[index + 1] ?? null;
      const hasLink = state[index] && state[index].type === 'output';
      const link: Link | null =
        nextNode != null && !hasLink
          ? {
              input: curr.outputs != null ? curr.outputs[0].id : '',
              output: nextNode?.inputs != null ? nextNode.inputs[0].id : '',
            }
          : null;
      return [...acc, link, stateLink];
    }, [] as (Link | null)[]);

    return dropNullValues(maybeLinks);
  };

  getCanvasWidth = (): number => {
    return (this.taskIndex + 2) * 2 * NODE_WIDTH;
  };

  createSchemaFromWorkflow = (): DiagramSchema<NodeData> => {
    const nodesFromWorkflow = this.createNodesFromWorkflow();
    const nodes = [
      this.createStartNode(),
      ...nodesFromWorkflow,
      this.createEndNode({ x: NODE_WIDTH * (this.taskIndex + 1), y: MAIN_Y_AXIS_POSITON }),
    ];
    const links = this.createLinks(nodes);
    // const links: Link[] = [];

    return createSchema({
      nodes,
      links,
    });
  };
}

export function createDiagramController(workflow: Workflow<ExtendedTask>): DiagramController {
  return new DiagramController(workflow);
}
