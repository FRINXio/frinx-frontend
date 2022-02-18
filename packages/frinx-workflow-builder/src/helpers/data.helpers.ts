import { Edge, Elements, Node } from 'react-flow-renderer';
import { v4 as uuid } from 'uuid';
import { getTaskLabel } from './task.helpers';
import { ExtendedTask, Task, TaskType } from './types';

type NodeType = 'decision' | 'fork_join' | 'join' | 'default';

type Position = { x: number; y: number };

function notNullPredicate<T>(value?: T | null): value is T {
  if (value == null) {
    return false;
  }
  return true;
}

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
      return 'default';
  }
}
function createStartNode(): Node {
  return {
    id: 'start',
    type: 'input',
    position: getNodePosition(),
    data: { label: 'start', type: 'START' },
  };
}

function createEndNode(): Node {
  return {
    id: 'end',
    type: 'output',
    position: getNodePosition(),
    data: { label: 'end', type: 'END' },
  };
}

function convertTaskToNode(task: ExtendedTask): Node[] {
  const { taskReferenceName, type } = task;

  const node = {
    id: taskReferenceName,
    type: getNodeType(type as TaskType), // RAW type is node in TaskType???
    position: getNodePosition(),
    data: {
      label: taskReferenceName,
      task,
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
      },
    };

    const decisionChildren = Object.keys(task.decisionCases)
      .map((d) => {
        const tasks = task.decisionCases[d];
        const decisionExtendedTasks = tasks.map(convertTaskToExtendedTask);
        const decisionNodes = createNodes(decisionExtendedTasks); // eslint-disable-line @typescript-eslint/no-use-before-define

        return decisionNodes;
      }, [])
      .flat();

    const defaultExtendedTasks = task.defaultCase.map(convertTaskToExtendedTask);
    const defaultDecisionNodes = createNodes(defaultExtendedTasks); // eslint-disable-line @typescript-eslint/no-use-before-define
    return [decisionNode, ...decisionChildren, ...defaultDecisionNodes];
  }

  if (task.type === 'FORK_JOIN') {
    const forkNode = {
      ...node,
    };

    const forkNodeChildren = task.forkTasks
      .map((tasks) => {
        const forkExtendedTasks = tasks.map(convertTaskToExtendedTask);
        return createNodes(forkExtendedTasks); // eslint-disable-line @typescript-eslint/no-use-before-define
      })
      .flat();

    return [forkNode, ...forkNodeChildren];
  }

  return [node];
}

function createNodes(tasks: ExtendedTask[]): Node[] {
  const nodes = tasks.reduce((prev: Node[], curr: ExtendedTask) => {
    const node = convertTaskToNode(curr);
    return [...prev, ...node];
  }, []);
  return nodes;
}

function createAllNodes(tasks: ExtendedTask[]): Node[] {
  const startNode = createStartNode();
  const nodes = createNodes(tasks);
  const endNode = createEndNode();
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
      const decisionCaseEdges = Object.keys(previousTask.decisionCases)
        .map((d) => {
          const decisionCaseTasks = [...previousTask.decisionCases[d]];
          const lastDecisionTask = decisionCaseTasks.pop();
          return lastDecisionTask;
        })
        .filter(notNullPredicate)
        .map((task) => ({
          id: `e${task.taskReferenceName}-${curr.taskReferenceName}`,
          source: task.taskReferenceName,
          target: curr.taskReferenceName,
        }));

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
        : decisionCaseEdges;
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
  const edges = createEdges(tasks);
  if (tasks.length) {
    const startEdge = {
      id: `estart-${tasks[0].taskReferenceName}`,
      source: 'start',
      target: tasks[0].taskReferenceName,
    };
    const endEdge = {
      id: `e${tasks[0].taskReferenceName}-end`,
      source: tasks[tasks.length - 1].taskReferenceName,
      target: 'end',
    };
    return [startEdge, ...edges, endEdge];
  }
  return edges;
}

export function getElementsFromWorkflow(tasks: ExtendedTask[]): Elements {
  const nodes = createAllNodes(tasks);
  const edges = createAllEdges(tasks);
  console.log('nodes: ', nodes); // eslint-disable-line no-console
  console.log('edges: ', edges); // eslint-disable-line no-console
  return [...nodes, ...edges];
}
