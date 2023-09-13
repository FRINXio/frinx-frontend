import React from 'react';
import ReactFlow, { Edge, Node } from 'react-flow-renderer';
import { Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  ExtendedTask,
  Task,
  convertWorkflowTaskToExtendedTask,
  getElementsFromWorkflow,
  jsonParse,
  unwrap,
} from '@frinx/shared';
import { getLayoutedElements } from '../helpers/layout.helpers';
import { BaseNode, DecisionNode, StartEndNode } from './index';
import { ControlExecutedWorkflowSubscription, Workflow } from '../__generated__/graphql';

const nodeTypes = {
  base: BaseNode,
  decision: DecisionNode,
  start: StartEndNode,
  end: StartEndNode,
};

type Props = {
  result?: ControlExecutedWorkflowSubscription['controlExecutedWorkflow'] | null;
  meta?: Workflow | null;
};

type NodeData = {
  label: string;
  isReadOnly: boolean;
} & {
  task?: ExtendedTask;
  handles?: string[];
};

const WorkflowDiagram = ({ meta, result }: Props) => {
  const navigate = useNavigate();

  if (meta == null || result == null) {
    return (
      <Box height="600">
        <Text>No workflow found</Text>
      </Box>
    );
  }

  const tasks = jsonParse<Task[]>(meta.tasks) || [];
  const taskMap = new Map(unwrap(result.tasks).map((t) => [t.id, t]));
  const elements: { nodes: Node<NodeData>[]; edges: Edge[] } = getLayoutedElements(
    getElementsFromWorkflow(tasks.map(convertWorkflowTaskToExtendedTask), true),
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
