import React, { useState } from 'react';
import ReactFlow, { Edge, Node } from 'react-flow-renderer';
import { getElementsFromWorkflow } from '../../helpers/api-to-graph.helpers';
import { getLayoutedElements } from '../../helpers/layout.helpers';
import {
  WorkflowInstanceDetail,
  Workflow,
  WorkflowTask,
  WorkflowDefinition,
  ExtendedTask,
  ExecutedWorkflowTask,
  Task,
  TaskType,
} from '../../helpers/types';
import { Box } from '@chakra-ui/react';
import BaseNode from '../../components/workflow-nodes/base-node';
import DecisionNode from '../../components/workflow-nodes/decision-node';
import StartEndNode from '../../components/workflow-nodes/start-end-node';
import { v4 as uuid } from 'uuid';
import { getTaskLabel } from '../../helpers/task.helpers';

const nodeTypes = {
  base: BaseNode,
  decision: DecisionNode,
  start: StartEndNode,
  end: StartEndNode,
};

type Props = {
  meta: Workflow<WorkflowTask>;
  result: WorkflowInstanceDetail;
};

type ExtedendedTaskWithExecutionData = ExtendedTask & {
  execution?: ExecutedWorkflowTask;
};

type ExtendedTaskType = Exclude<TaskType, 'CUSTOM' | 'JSON_JQ'> | 'JSON_JQ_TRANSFORM';
// function getTaskType(type: TaskType): ExtendedTaskType {
//   switch (type) {
//     case 'CUSTOM': {
//       throw Error('should never happen');
//     }
//     case 'JSON_JQ': {
//       return 'JSON_JQ_TRANSFORM';
//     }
//     default: {
//       return type;
//     }
//   }
// }

function convertWorkflowTaskToExtendedTask(workflowTask: WorkflowTask): ExtendedTask {
  const { name, taskReferenceName, optional, startDelay, inputParameters, type } = workflowTask;
  switch (type) {
    case 'DECISION': {
      return {
        id: uuid(),
        label: getTaskLabel(workflowTask as Task),
        name,
        taskReferenceName,
        optional,
        startDelay,
        inputParameters,
        decisionCases: workflowTask.decisionCases,
        defaultCase: workflowTask.defaultCase,
        caseValueParam: workflowTask.caseValueParam,
        type: 'DECISION',
      };
    }
    default: {
      return {
        id: uuid(),
        label: getTaskLabel(workflowTask as Task),
        name,
        taskReferenceName,
        optional,
        startDelay,
        inputParameters,
        type: 'SIMPLE',
      };
    }
  }
}

type ExecutionState = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'NONE';
type NodeData = {
  label: string;
  isReadOnly: boolean;
} & {
  task?: ExtendedTask;
  handles?: string[];
};

const ExecutedWorkflowGraph = ({ meta, result }: Props) => {
  useState<WorkflowDefinition<ExtedendedTaskWithExecutionData> | null>(null);

  const taskMap = new Map(result.tasks.map((t) => [t.referenceTaskName, t]));
  const elements: { nodes: Node<NodeData>[]; edges: Edge[] } = getLayoutedElements(
    getElementsFromWorkflow(meta.tasks.map(convertWorkflowTaskToExtendedTask), true),
    'TB',
  );
  const nodesWithExecutionState = elements.nodes.map((n) => {
    const taskReferenceName = n.data?.task?.taskReferenceName || '';
    const status = taskMap.get(taskReferenceName)?.status || 'NONE';
    return {
      ...n,
      draggable: false,
      data: {
        ...n.data,
        status,
      },
    };
  });

  return (
    <Box width="800" height="600">
      <ReactFlow
        nodes={nodesWithExecutionState}
        edges={elements.edges}
        panOnDrag={false}
        zoomOnScroll={false}
        draggable={false}
        nodeTypes={nodeTypes}
      />
    </Box>
  );
};

export default ExecutedWorkflowGraph;
