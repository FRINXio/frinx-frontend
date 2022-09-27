import React, { useState } from 'react';
import ReactFlow, { Edge, Node } from 'react-flow-renderer';
import { Center } from '@chakra-ui/react';
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
  subworkflows?: WorkflowInstanceDetail[];
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

const WorkflowDiagram = ({ meta, result, subworkflows }: Props) => {
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
    <Center height="600">
      <ReactFlow
        nodes={nodesWithExecutionState}
        edges={elements.edges}
        panOnDrag={false}
        zoomOnScroll={false}
        draggable={false}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={(e, node) => {
          console.log('click', e, node);
        }}
      />
    </Center>
  );
};

export default WorkflowDiagram;
