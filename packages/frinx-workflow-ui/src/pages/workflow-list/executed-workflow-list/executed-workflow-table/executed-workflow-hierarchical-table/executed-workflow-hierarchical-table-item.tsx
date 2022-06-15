import moment from 'moment';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { Tr, Td, Checkbox } from '@chakra-ui/react';
import { ExecutedWorkflow, ExecutedWorkflows, ExecutedWorkflowTask } from '@frinx/workflow-ui/src/helpers/types';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import callbackUtils from '@frinx/workflow-ui/src/utils/callback-utils';
import ExecutedSubWorkflowTable from './executed-subworkflow-table';

type Props = {
  workflows: ExecutedWorkflows;
  selectedWfs: string[];
  selectWf: (workflowId: string, isChecked: boolean) => void;
};

type NestedWorkflow = ExecutedWorkflow & {
  isExpanded: boolean;
};

type ExecutedSubworkflowTask = ExecutedWorkflowTask & { inputData: Record<string, string> };

type ExecutedSubWorkflows = {
  isLoading: boolean;
  subWorkflows: ExecutedSubworkflowTask[];
};

const ExecutedWorkflowHierarchicalTableItem: FC<Props> = ({ workflows, selectWf, selectedWfs }) => {
  const [nestedWorkflows, setNestedWorkflows] = useState<NestedWorkflow[]>([]);

  useEffect(() => {
    setNestedWorkflows(workflows.result.hits.map((w) => ({ ...w, isExpanded: false })));
  }, [workflows]);

  const [subWorkflows, setSubWorkflows] = useState<Map<string, ExecutedSubWorkflows>>(new Map());

  const handleToggle = async (workflow: ExecutedWorkflow) => {
    const { workflowId } = workflow;
    const newNestedWorkflows = nestedWorkflows.map((w) => {
      if (workflowId === w.workflowId) {
        return { ...w, isExpanded: !w.isExpanded };
      }
      return w;
    });
    setNestedWorkflows(newNestedWorkflows);

    // load subworkflows if not already loaded
    if (!subWorkflows.has(workflowId)) {
      const { getWorkflowInstanceDetail } = callbackUtils.getCallbacks;

      const loadingSubWorkflows = new Map(subWorkflows);
      loadingSubWorkflows.set(workflowId, { isLoading: true, subWorkflows: [] });
      setSubWorkflows(loadingSubWorkflows);

      const workflowDetail = await getWorkflowInstanceDetail(workflowId);
      const workflowData = workflowDetail.result.tasks.filter((t) => t.taskType === 'SUB_WORKFLOW') || [];
      const finishedSubWorkflows = new Map(subWorkflows);
      finishedSubWorkflows.set(workflowId, { isLoading: false, subWorkflows: workflowData });
      setSubWorkflows(finishedSubWorkflows);
    }
  };

  return (
    <>
      {nestedWorkflows.map((item, i) => (
        <Fragment key={item.workflowId}>
          <Tr onClick={() => handleToggle(item)}>
            <Td>
              <Checkbox
                isChecked={selectedWfs.includes(item.workflowId)}
                onChange={(e) => selectWf(item.workflowId, e.target.checked)}
              />
            </Td>
            <Td
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={item.workflowType}
            >
              {item.isExpanded ? (
                <ChevronUpIcon w="6" h="6" paddingRight={2} />
              ) : (
                <ChevronDownIcon w="6" h="6" paddingRight={2} />
              )}
              <Link to={`../executed/${item.workflowId}`}>{item.workflowType}</Link>
            </Td>
            <Td>{item.status}</Td>
            <Td>{moment(item.startTime).format('MM/DD/YYYY, HH:mm:ss:SSS')}</Td>
            <Td>{item.endTime ? moment(item.endTime).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}</Td>
          </Tr>

          {item.isExpanded && <ExecutedSubWorkflowTable subWorkflows={subWorkflows} workflowId={item.workflowId} />}
        </Fragment>
      ))}
    </>
  );
};

export default ExecutedWorkflowHierarchicalTableItem;
