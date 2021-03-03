import { createSchema } from 'beautiful-react-diagrams';
import { flatten } from 'lodash';
import { DiagramSchema, Link } from 'beautiful-react-diagrams/@types/DiagramSchema';
import { v4 as uuid } from 'uuid';
import TaskNode from '../components/nodes/task-node';
import BaseNode from '../components/nodes/start-end-node';
import DecisionNode from '../components/nodes/decision-node';
import { CustomNodeType, NodeData, ExtendedTask, Workflow, ExtendedDecisionTask } from './types';
import { getTaskLabel } from './task.helpers';
import unwrap from './unwrap';

const NODE_WIDTH = 275;

function dropNullValues<T>(array: (T | null)[]): T[] {
  const result: T[] = [];
  array.forEach((value) => {
    if (value != null) {
      result.push(value);
    }
  });
  return result;
}

type ClickHandlers = {
  onEditBtnClick: (data?: NodeData) => void;
  onDeleteBtnClick?: (id: string) => void;
};
type Position = {
  x: number;
  y: number;
};
class DiagramController {
  workflow: Workflow<ExtendedTask>;

  onEditBtnClick: (data?: NodeData) => void;

  onDeleteBtnClick: ((id: string) => void) | undefined = undefined;

  private taskIndex = 0;

  private dTasksIndex = 0;

  private defaultTasksIndex = 0;

  constructor(workflow: Workflow<ExtendedTask>, clickHandlers: ClickHandlers) {
    this.workflow = workflow;
    this.onEditBtnClick = clickHandlers.onEditBtnClick;

    if (clickHandlers.onDeleteBtnClick) {
      this.onDeleteBtnClick = clickHandlers.onDeleteBtnClick;
    }
  }

  setDeleteBtnClickHandler = (deleteBtnClickHandler: (id: string) => void) => {
    this.onDeleteBtnClick = deleteBtnClickHandler;
  };

  createDecisionTaskNode = (task: ExtendedDecisionTask, position: Position): CustomNodeType => {
    return {
      content: task.name,
      id: task.id,
      // TODO
      coordinates: [position.x, position.y],
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
        onEditBtnClick: this.onEditBtnClick,
        onDeleteBtnClick: this.onDeleteBtnClick,
        isSelected: false,
        task,
      },
    };
  };

  createGenericTaskNode = (task: ExtendedTask, position: Position): CustomNodeType => {
    return {
      content: task.name,
      id: task.id,
      render: TaskNode,
      coordinates: [position.x, position.y],
      outputs: [
        {
          id: task.id,
          alignment: 'right',
        },
      ],
      inputs: [
        {
          id: task.id,
          alignment: 'left',
        },
      ],
      data: {
        task,
        isSelected: false,
        onEditBtnClick: this.onEditBtnClick,
        onDeleteBtnClick: this.onDeleteBtnClick,
      },
    };
  };

  createStartNode = (): CustomNodeType => {
    return {
      content: 'start',
      id: 'start',
      coordinates: [100, 300],
      outputs: [{ id: 'start', alignment: 'right' }],
      render: BaseNode,
      data: undefined,
    };
  };

  createEndNode = (position: Position): CustomNodeType => {
    return {
      content: 'end',
      id: 'end',
      // TODO
      coordinates: [position.x, position.y],
      inputs: [{ id: 'end', alignment: 'left' }],
      render: BaseNode,
      data: undefined,
    };
  };

  createTaskNode = (task: ExtendedTask): CustomNodeType => {
    if (task.type === 'DECISION') {
      return this.createDecisionTaskNode(task, { x: 100, y: 100 });
    }

    if (task.type === 'START_TASK') {
      return this.createStartNode();
    }

    if (task.type === 'END_TASK') {
      return this.createEndNode({ x: 100, y: 100 });
    }

    return {
      content: task.name,
      id: task.id,
      coordinates: [100, 100],
      render: TaskNode,
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
        onDeleteBtnClick: this.onDeleteBtnClick,
        onEditBtnClick: this.onEditBtnClick,
        isSelected: false,
        task,
      },
    };
  };

  createNodesFromWorkflow = (): CustomNodeType[] => {
    return this.workflow.tasks.reduce((acc, t) => {
      this.taskIndex += 1;
      if (t.type === 'DECISION') {
        this.dTasksIndex = this.taskIndex;
        const dTasks = flatten(Object.keys(t.decisionCases).map((key) => t.decisionCases[key])).map((tsk) => {
          this.dTasksIndex += 1;
          this.taskIndex -= 1;
          return this.createGenericTaskNode(
            { ...tsk, id: uuid(), label: getTaskLabel(tsk) },
            { x: NODE_WIDTH * this.dTasksIndex, y: 100 },
          );
        });
        this.defaultTasksIndex = this.taskIndex + dTasks.length;
        const defaultTasks = t.defaultCase.map((tsk) => {
          this.defaultTasksIndex += 1;
          this.taskIndex -= 1;
          return this.createGenericTaskNode(
            { ...tsk, id: uuid(), label: getTaskLabel(tsk) },
            { x: NODE_WIDTH * this.defaultTasksIndex, y: 200 },
          );
        });
        return [
          ...acc,
          this.createDecisionTaskNode(t, {
            x: NODE_WIDTH * (this.taskIndex + dTasks.length + defaultTasks.length),
            y: 300,
          }),
          ...dTasks,
          ...defaultTasks,
        ];
      }
      this.taskIndex += this.dTasksIndex + this.defaultTasksIndex;

      return [
        ...acc,
        this.createGenericTaskNode(t, {
          x: NODE_WIDTH * this.taskIndex,
          y: 300,
        }),
      ];
    }, [] as CustomNodeType[]);
  };

  createLinks = (nodes: CustomNodeType[]): Link[] => {
    const state: Record<number, { id: string; type: 'input' | 'output' }> = {};
    const maybeLinks = nodes.reduce((acc, curr, index, array) => {
      if (curr.data?.task?.type === 'DECISION') {
        const decisionCasesLength = Object.values(curr.data.task.decisionCases)[0].length;
        const defaultTasksLenght = curr.data.task.defaultCase.length;
        const nextNodeInputId = unwrap(nodes[index + decisionCasesLength + defaultTasksLenght + 1].inputs)[0].id;
        state[index + decisionCasesLength] = { id: nextNodeInputId, type: 'output' };
        state[index + decisionCasesLength + 1] = { id: unwrap(curr.outputs)[1].id, type: 'input' };
        // state[index + decisionCasesLength + defaultTasksLenght + 1] = { id:  }
      }
      let stateLink: Link | null = null;
      if (state[index]) {
        stateLink = {
          input: state[index].type === 'output' ? unwrap(curr.outputs)[0].id : state[index].id,
          output: state[index].type === 'output' ? state[index].id : unwrap(curr.inputs)[0].id,
          className: 'nodeLink',
        };
      }
      const nextNode = array[index + 1] ?? null;
      const bla = state[index] && state[index].type === 'output';
      const link: Link | null =
        nextNode != null && !bla
          ? {
              input: curr.outputs != null ? curr.outputs[0].id : '',
              output: nextNode?.inputs != null ? nextNode.inputs[0].id : '',
              className: 'nodeLink',
            }
          : null;
      return [...acc, link, stateLink];
    }, [] as (Link | null)[]);

    return dropNullValues(maybeLinks);
  };

  createSchemaFromWorkflow = () => {
    const nodesFromWorkflow = this.createNodesFromWorkflow();
    const nodes = [
      this.createStartNode(),
      ...nodesFromWorkflow,
      this.createEndNode({ x: NODE_WIDTH * (this.taskIndex + 1), y: 300 }),
    ];
    const links = this.createLinks(nodes);

    return createSchema({
      nodes,
      links,
    });
  };

  updateSchema = (
    schema: DiagramSchema<NodeData>,
    deleteBtnClickHandler: (id: string) => void,
    taskId?: string,
  ): DiagramSchema<NodeData> => {
    const { nodes, links } = schema;
    return {
      links,
      nodes: nodes.map((n) => {
        const data = n.data
          ? {
              ...n.data,
              isSelected: n.id === taskId,
              onDeleteBtnClick: deleteBtnClickHandler,
            }
          : undefined;

        return {
          ...n,
          data,
        };
      }),
    };
  };
}

export function createDiagramController(
  workflow: Workflow<ExtendedTask>,
  clickHandlers: ClickHandlers,
): DiagramController {
  return new DiagramController(workflow, clickHandlers);
}
