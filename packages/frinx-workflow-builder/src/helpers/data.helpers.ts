import { Edge, Elements, Node } from 'react-flow-renderer';
import { v4 as uuid } from 'uuid';
import { getTaskLabel } from './task.helpers';
import { ExtendedTask, Task, TaskType } from './types';

type NodeType = 'decision' | 'fork_join' | 'join' | 'base';

type Position = { x: number; y: number };

function getNodeStyle() {
  return {};
}

function convertTaskToExtendedTask(task: Task): ExtendedTask {
  return { ...task, id: uuid(), label: getTaskLabel(task) };
}

function getNodePosition(): Position {
  return {
    x: 0,
    y: 0,
  };
}

function getNodeType(taskType: TaskType): NodeType {
  switch (taskType) {
    case 'DECISION':
      return 'decision';
    case 'FORK_JOIN':
    case 'JOIN':
    default:
      return 'base';
  }
}
function createStartNode(isReadOnly: boolean): Node {
  return {
    id: 'start',
    type: 'start',
    position: getNodePosition(),
    data: { label: 'start', type: 'START', isReadOnly },
  };
}

function createEndNode(isReadOnly: boolean): Node {
  return {
    id: 'end',
    type: 'end',
    position: getNodePosition(),
    data: { label: 'end', type: 'END', isReadOnly },
  };
}

function convertTaskToNode(task: Task, isReadOnly: boolean): Node[] {
  const { taskReferenceName, type } = task;

  const node = {
    id: taskReferenceName,
    type: getNodeType(type as TaskType), // RAW type is node in TaskType???
    position: getNodePosition(),
    data: {
      label: taskReferenceName,
      task,
      isReadOnly,
    },
  };

  if (task.type === 'DECISION') {
    const decisionHandles = Object.keys(task.decisionCases);
    const handles = [...decisionHandles, 'default'];
    const decisionNode = {
      ...node,
      style: getNodeStyle(),
      data: {
        ...node.data,
        handles,
        isReadOnly,
      },
    };

    const decisionChildren = Object.keys(task.decisionCases)
      .map((d) => {
        const tasks = task.decisionCases[d];
        const decisionExtendedTasks = tasks.map(convertTaskToExtendedTask);
        const decisionNodes = createNodes(decisionExtendedTasks, isReadOnly); // eslint-disable-line @typescript-eslint/no-use-before-define

        return decisionNodes;
      }, [])
      .flat();

    const defaultExtendedTasks = task.defaultCase.map(convertTaskToExtendedTask);
    const defaultDecisionNodes = createNodes(defaultExtendedTasks, isReadOnly); // eslint-disable-line @typescript-eslint/no-use-before-define
    return [decisionNode, ...decisionChildren, ...defaultDecisionNodes];
  }

  if (task.type === 'FORK_JOIN') {
    const forkNode = {
      ...node,
      isReadOnly,
    };

    const forkNodeChildren = task.forkTasks
      .map((tasks) => {
        const forkExtendedTasks = tasks.map(convertTaskToExtendedTask);
        return createNodes(forkExtendedTasks, isReadOnly); // eslint-disable-line @typescript-eslint/no-use-before-define
      })
      .flat();

    return [forkNode, ...forkNodeChildren];
  }

  return [node];
}

function createNodes(tasks: Task[], isReadOnly: boolean): Node[] {
  const nodes = tasks.reduce((prev: Node[], curr: Task) => {
    const node = convertTaskToNode(curr, isReadOnly);
    return [...prev, ...node];
  }, []);
  return nodes;
}

function createAllNodes(tasks: Task[], isReadOnly: boolean): Node[] {
  const startNode = createStartNode(isReadOnly);
  const nodes = createNodes(tasks, isReadOnly);
  const endNode = createEndNode(isReadOnly);
  return [startNode, ...nodes, endNode];
}

function createEdges(tasks: Task[]): Edge[] {
  const edges = tasks.reduce((prev: Edge[], curr: Task, index: number, array: Task[]) => {
    if (index === 0) {
      return prev;
    }

    const previousTask = array[index - 1];

    // edges for task after decision
    if (previousTask.type === 'DECISION') {
      const decisionCaseEdges = Object.keys(previousTask.decisionCases).map((d) => {
        const decisionCaseTasks = [...previousTask.decisionCases[d]];
        const lastDecisionTask = decisionCaseTasks.pop();
        return lastDecisionTask
          ? {
              id: `e${lastDecisionTask.taskReferenceName}-${curr.taskReferenceName}`,
              source: lastDecisionTask.taskReferenceName,
              target: curr.taskReferenceName,
            }
          : {
              id: `e${previousTask.taskReferenceName}-${curr.taskReferenceName}`,
              source: previousTask.taskReferenceName,
              target: curr.taskReferenceName,
              sourceHandle: d,
            };
      });

      const defaultCaseTasks = [...previousTask.defaultCase];
      const defaultCaseLastTask = defaultCaseTasks.pop();
      const newEdges = defaultCaseLastTask
        ? [
            ...decisionCaseEdges,
            {
              id: `e${defaultCaseLastTask.taskReferenceName}-${curr.taskReferenceName}`,
              source: defaultCaseLastTask.taskReferenceName,
              target: curr.taskReferenceName,
            },
          ]
        : [
            ...decisionCaseEdges,
            {
              id: `e${previousTask.taskReferenceName}-${curr.taskReferenceName}`,
              source: previousTask.taskReferenceName,
              target: curr.taskReferenceName,
              sourceHandle: `default`,
            },
          ];
      return [...prev, ...newEdges];
    }

    // edges for decision tasks
    if (curr.type === 'DECISION') {
      const newEdge = {
        id: `e${previousTask.taskReferenceName}-${curr.taskReferenceName}`,
        source: previousTask.taskReferenceName,
        target: curr.taskReferenceName,
        style: { background: '#fff' },
      };
      const decisionEdges = Object.keys(curr.decisionCases)
        .map((d) => {
          const decisionTasks = curr.decisionCases[d];
          const currentDecisionEdges = createEdges(decisionTasks);

          // edge connecting decision task with cases
          const startDecisionEdge = decisionTasks.length
            ? {
                id: `e${curr.taskReferenceName}-${decisionTasks[0].taskReferenceName}`,
                source: curr.taskReferenceName,
                target: decisionTasks[0].taskReferenceName,
                sourceHandle: `${d}`,
              }
            : null;
          return startDecisionEdge ? [...currentDecisionEdges, startDecisionEdge] : currentDecisionEdges;
        })
        .flat();

      const defaultCaseEdges = createEdges(curr.defaultCase);
      const startDefaultCaseEdge = curr.defaultCase.length
        ? {
            id: `e${curr.taskReferenceName}-${curr.defaultCase[0].taskReferenceName}`,
            source: curr.taskReferenceName,
            target: curr.defaultCase[0].taskReferenceName,
            sourceHandle: 'default',
          }
        : null;
      const allDefaultCaseEdges = startDefaultCaseEdge ? [...defaultCaseEdges, startDefaultCaseEdge] : defaultCaseEdges;
      return [...prev, newEdge, ...decisionEdges, ...allDefaultCaseEdges];
    }

    // edges for fork task
    if (curr.type === 'FORK_JOIN') {
      const newEdge = {
        id: `e${previousTask.taskReferenceName}-${curr.taskReferenceName}`,
        source: previousTask.taskReferenceName,
        target: curr.taskReferenceName,
        style: { background: '#fff' },
      };

      const forkEdges = curr.forkTasks
        .map((forkTasks) => {
          // edge connecting fork task with its branches
          const firstBranchEdge = forkTasks.length
            ? {
                id: `e${curr.taskReferenceName}-${forkTasks[0].taskReferenceName}`,
                source: curr.taskReferenceName,
                target: forkTasks[0].taskReferenceName,
              }
            : null;
          const forkBranchEdges = createEdges(forkTasks);
          const allBranchEdges = firstBranchEdge ? [firstBranchEdge, ...forkBranchEdges] : forkBranchEdges;
          return allBranchEdges;
        })
        .flat();

      return [...prev, newEdge, ...forkEdges];
    }

    // edges for jon task
    if (curr.type === 'JOIN') {
      const joinEdges = curr.joinOn.map((forkTaskId) => ({
        id: `e${forkTaskId}-${curr.taskReferenceName}`,
        source: forkTaskId,
        target: curr.taskReferenceName,
      }));
      return [...prev, ...joinEdges];
    }

    const newEdge = {
      id: `e${previousTask.taskReferenceName}-${curr.taskReferenceName}`,
      source: previousTask.taskReferenceName,
      target: curr.taskReferenceName,
    };

    return [...prev, newEdge];
  }, []);

  return edges;
}

function createAllEdges(tasks: Task[]): Edge[] {
  const startTask: Task = {
    type: 'START_TASK',
    name: 'start',
    taskReferenceName: 'start',
    optional: false,
    startDelay: 0,
  };
  const endTask: Task = {
    type: 'END_TASK',
    name: 'end',
    taskReferenceName: 'end',
    optional: false,
    startDelay: 0,
  };
  const tasksWithStartEndNodes = [startTask, ...tasks, endTask];
  const edges = createEdges(tasksWithStartEndNodes);
  return edges;
}

export function getElementsFromWorkflow(tasks: Task[], isReadOnly: boolean): Elements {
  const nodes = createAllNodes(tasks, isReadOnly);
  const edges = createAllEdges(tasks);
  return [...nodes, ...edges];
}
