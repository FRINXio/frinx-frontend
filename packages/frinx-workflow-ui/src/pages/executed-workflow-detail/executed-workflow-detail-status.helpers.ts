import { Workflow, WorkflowInstanceDetail } from '@frinx/workflow-ui/src/helpers/types';
import callbackUtils from '@frinx/workflow-ui/src/utils/callback-utils';
import { useAsyncGenerator } from '@frinx/shared/src/hooks';

export type TaskStatus = 'COMPLETED' | 'FAILED' | 'SCHEDULED' | 'IN_PROGRESS';
export type WorkflowStatus = 'COMPLETED' | 'FAILED' | 'RUNNING' | 'TERMINATED' | 'TIMED_OUT';

/* eslint-disable @typescript-eslint/naming-convention */
export type OutputDataPayload<T> =
  | {
      error_message: {
        response_body: {
          output: {
            'overall-status': T;
          };
        };
      };
    }
  | {
      response_body: unknown;
    };
/* eslint-enable */
export type TaskStatusPayload = {
  seq: number;
  status: TaskStatus;
  taskType: string;
  referenceTaskName: string;
  startTime: number;
  updateTime: number;
  endTime: number;
  workflowType: string;
  outputData: OutputDataPayload<TaskStatus>;
};
export type ExecutedWorkflowPayload = {
  createTime: number;
  updateTime: number;
  endTime: number;
  status: WorkflowStatus;
  workflowId: string;
  tasks: TaskStatusPayload[];
  output: OutputDataPayload<WorkflowStatus>;
};
export type ExecutedWorkflowResponse = {
  result: WorkflowInstanceDetail;
  meta: Workflow;
  subworkflows: WorkflowInstanceDetail[];
};

async function getWorkflowExecOutput(
  workflowId: string,
  abortController: AbortController,
): Promise<ExecutedWorkflowResponse | null> {
  const { getWorkflowInstanceDetail } = callbackUtils.getCallbacks;
  try {
    const response = await getWorkflowInstanceDetail(workflowId, { signal: abortController.signal });
    return response;
  } catch {
    return null;
  }
}

export function useWorkflowGenerator(workflowId: string): ExecutedWorkflowResponse | null {
  const { data } = useAsyncGenerator<ExecutedWorkflowResponse>({
    repeatTill: (data) => data?.result.status === 'RUNNING' || data?.result.status === 'PAUSED',
    fn: (abortController) => () => getWorkflowExecOutput(workflowId, abortController),
  });

  return data;
}

export function getStatusBadgeColor(status: WorkflowStatus | TaskStatus): string {
  switch (status) {
    case 'RUNNING':
    case 'IN_PROGRESS':
      return 'blue';
    case 'COMPLETED':
      return 'green';
    case 'FAILED':
    case 'TIMED_OUT':
      return 'red';
    case 'SCHEDULED':
      return 'purple';
    default:
      return '';
  }
}
