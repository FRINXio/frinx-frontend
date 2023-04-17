import moment from 'moment';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { Tr, Td, Checkbox, Icon } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { callbackUtils, ExecutedWorkflowTask } from '@frinx/shared/src';
import FeatherIcon from 'feather-icons-react';
import ExecutedSubWorkflowTable from './executed-subworkflow-table';
import ExecutedWorkflowStatusLabels from '../executed-workflow-status-labels';
import { ExecutedWorkflowsQuery } from '../../../../../__generated__/graphql';

type Props = {
  workflows: NonNullable<ExecutedWorkflowsQuery['executedWorkflows']>;
  selectedWorkflows: string[];
  onWorkflowSelect: (workflowId: string) => void;
};

type ExecutedWorkflowNode = NonNullable<ExecutedWorkflowsQuery['executedWorkflows']>['edges'][0];

type NestedWorkflow = ExecutedWorkflowNode & {
  isExpanded: boolean;
};

type ExecutedSubworkflowTask = ExecutedWorkflowTask & { inputData: Record<string, string> };

type ExecutedSubWorkflows = {
  isLoading: boolean;
  subWorkflows: ExecutedSubworkflowTask[];
};

const ExecutedWorkflowHierarchicalTableItem: FC<Props> = ({ workflows, onWorkflowSelect, selectedWorkflows }) => {
  const [nestedWorkflows, setNestedWorkflows] = useState<NestedWorkflow[]>([]);

  useEffect(() => {
    setNestedWorkflows(workflows.edges.map(({ cursor, node }) => ({ cursor, node, isExpanded: false })));
  }, [workflows]);

  const [subWorkflows, setSubWorkflows] = useState<Map<string, ExecutedSubWorkflows>>(new Map());

  const handleToggle = async ({ node: workflow }: ExecutedWorkflowNode) => {
    const newNestedWorkflows = nestedWorkflows.map(({ node: w, isExpanded, cursor }) => {
      if (workflow.workflowId === w.workflowId) {
        return { node: w, isExpanded: !isExpanded, cursor };
      }

      return {
        node: w,
        cursor,
        isExpanded,
      };
    });
    setNestedWorkflows(newNestedWorkflows);

    // load subworkflows if not already loaded
    if (workflow.workflowId != null && !subWorkflows.has(workflow.workflowId)) {
      const { getWorkflowInstanceDetail } = callbackUtils.getCallbacks;

      const loadingSubWorkflows = new Map(subWorkflows);
      loadingSubWorkflows.set(workflow.workflowId, { isLoading: true, subWorkflows: [] });
      setSubWorkflows(loadingSubWorkflows);

      const workflowDetail = await getWorkflowInstanceDetail(workflow.workflowId);
      const workflowData = workflowDetail.result.tasks.filter((t) => t.taskType === 'SUB_WORKFLOW') || [];
      const finishedSubWorkflows = new Map(subWorkflows);
      finishedSubWorkflows.set(workflow.workflowId, { isLoading: false, subWorkflows: workflowData });
      setSubWorkflows(finishedSubWorkflows);
    }
  };

  return (
    <>
      {nestedWorkflows.map(({ node: item, isExpanded, cursor }) => (
        <Fragment key={item.workflowId}>
          <Tr onClick={() => handleToggle({ node: item, cursor })}>
            <Td>
              <Checkbox
                isChecked={selectedWorkflows.includes(item.id)}
                onChange={() => {
                  onWorkflowSelect(item.id)
                }}
              />
            </Td>
            <Td
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={item.workflowId ?? "Unknown workflow"}
              textColor="blue.500"
            >
              {isExpanded ? (
                <Icon as={FeatherIcon} icon="chevron-up" size={20} w="6" h="6" paddingRight={2} />
              ) : (
                <Icon as={FeatherIcon} icon="chevron-down" size={20} w="6" h="6" paddingRight={2} />
              )}
              <Link to={`../executed/${item.workflowId}`}>{item.workflowId ?? '-'}</Link>
            </Td>

            <Td>{item.workflowName}</Td>

            <Td>{moment(item.startTime).format('MM/DD/YYYY, HH:mm:ss:SSS')}</Td>
            <Td>{item.endTime ? moment(item.endTime).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}</Td>
            <Td><ExecutedWorkflowStatusLabels status={item.status ?? 'UNKNOWN'} /></Td>
          </Tr>

          {isExpanded && <ExecutedSubWorkflowTable subWorkflows={subWorkflows} workflowId={item.workflowId ?? ""} />}
        </Fragment>
      ))}
    </>
  );
};

export default ExecutedWorkflowHierarchicalTableItem;
