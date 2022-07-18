import React, { useState } from 'react';
import ReactFlow, { Elements, isNode } from 'react-flow-renderer';
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

function convertWorkflowTaskToTask(workflowTask: WorkflowTask): Task {
  const { name, taskReferenceName, optional, startDelay, inputParameters, type } = workflowTask;
  switch (type) {
    case 'DECISION': {
      return {
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
      return { name, taskReferenceName, optional, startDelay, inputParameters, type: 'SIMPLE' };
    }
  }
}

type ExecutionState = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'NONE';

const ExecutedWorkflowGraph = ({ meta, result }: Props) => {
  useState<WorkflowDefinition<ExtedendedTaskWithExecutionData> | null>(null);

  const taskMap = new Map(result.tasks.map((t) => [t.referenceTaskName, t]));
  // console.log(taskMap);
  const elements: Elements<{ task: Task }> = getLayoutedElements(
    getElementsFromWorkflow(meta.tasks.map(convertWorkflowTaskToTask), true),
    'TB',
  );
  const elementsWithExecutionState = elements.map((e) => {
    if (!isNode(e)) {
      return e;
    }
    const taskReferenceName = e.data?.task?.taskReferenceName || '';
    const status = taskMap.get(taskReferenceName)?.status || 'NONE';
    return {
      ...e,
      draggable: false,
      data: {
        ...e.data,
        status,
      },
    };
  });

  return (
    <Box width="800" height="600">
      <ReactFlow
        elements={elementsWithExecutionState}
        paneMoveable={false}
        zoomOnScroll={false}
        draggable={false}
        nodeTypes={nodeTypes}
      />
    </Box>
  );
};

export default ExecutedWorkflowGraph;
