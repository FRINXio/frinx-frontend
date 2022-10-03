import React, { useState } from 'react';
import ReactFlow, { Edge, Node } from 'react-flow-renderer';
import { Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getElementsFromWorkflow } from '../helpers/api-to-graph.helpers';
import { getLayoutedElements } from '../helpers/layout.helpers';
import {
  WorkflowInstanceDetail,
  Workflow,
  WorkflowTask,
  WorkflowDefinition,
  ExtendedTask,
  ExecutedWorkflowTask,
} from '../helpers/types';
import { BaseNode, DecisionNode, StartEndNode } from './components';
import { convertWorkflowTaskToExtendedTask } from '../helpers/task.helpers';

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

type NodeData = {
  label: string;
  isReadOnly: boolean;
} & {
  task?: ExtendedTask;
  handles?: string[];
};

const WorkflowDiagram = ({ meta, result }: Props) => {
  useState<WorkflowDefinition<ExtedendedTaskWithExecutionData> | null>(null);
  const navigate = useNavigate();

  const taskMap = new Map(result.tasks.map((t) => [t.referenceTaskName, t]));
  const elements: { nodes: Node<NodeData>[]; edges: Edge[] } = getLayoutedElements(
    getElementsFromWorkflow(meta.tasks.map(convertWorkflowTaskToExtendedTask), true),
    'TB',
  );
  const nodesWithExecutionState = elements.nodes.map((n) => {
    const taskReferenceName = n.data?.task?.taskReferenceName || '';
    const task = taskMap.get(taskReferenceName);
    const isSubWorkflow = task?.taskType === 'SUB_WORKFLOW';
    return {
      ...n,
      draggable: false,
      style: {
        ...n.style,
        cursor: isSubWorkflow ? 'pointer' : 'not-allowed',
        border: isSubWorkflow ? '2px dashed #000' : '',
      },
      data: {
        ...n.data,
        status: task?.status || 'NONE',
        subWorkflowId: task?.subWorkflowId || null,
        isSubWorkflow,
      },
    };
  });

  return (
    <Box height="600">
      <ReactFlow
        nodes={nodesWithExecutionState}
        edges={elements.edges}
        panOnDrag
        zoomOnScroll={false}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={(_e, node) => {
          if (node.data?.isSubWorkflow) {
            navigate(`../executed/${node.data?.subWorkflowId}`);
          }
        }}
      />
    </Box>
  );
};

export default WorkflowDiagram;
