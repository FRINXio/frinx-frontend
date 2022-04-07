import { useEffect, useState } from 'react';
import { Workflow, WorkflowInstanceDetail } from '../../types/types';
import callbackUtils from '../../utils/callback-utils';

export type TaskStatus = 'COMPLETED' | 'FAILED' | 'SCHEDULED' | 'IN_PROGRESS';
export type WorkflowStatus = 'COMPLETED' | 'FAILED' | 'RUNNING' | 'TERMINATED';

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

export async function* asyncGenerator(
  workflowId: string,
  abortController: AbortController,
): AsyncGenerator<ExecutedWorkflowResponse | null, void, unknown> {
  let data = await getWorkflowExecOutput(workflowId, abortController);

  while (data?.result.status === 'RUNNING' || data?.result.status === 'PAUSED') {
    await new Promise((resolve) => {
      setTimeout(resolve, 800);
    });
    yield data;
    // eslint-disable-next-line no-await-in-loop
    data = await getWorkflowExecOutput(workflowId, abortController);
  }
  // we need to do an additional yield for the last task status change
  if (data?.result.status === 'FAILED' || data?.result.status === 'COMPLETED' || data?.result.status === 'TERMINATED') {
    yield data;
  }
}

export function useAsyncGenerator(workflowId: string): ExecutedWorkflowResponse | null {
  const [execPayload, setExecPayload] = useState<ExecutedWorkflowResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      // we have to use async iterator here, so we turn off this rule
      // eslint-disable-next-line no-restricted-syntax
      for await (const data of asyncGenerator(workflowId, controller)) {
        setExecPayload(data);
      }
    })();

    return () => {
      // we want to abort the request when user leaves view and/or changes the displayed workflow
      controller.abort();
    };
  }, [workflowId]);

  return execPayload;
}

export function getStatusBadgeColor(status: WorkflowStatus | TaskStatus): string {
  switch (status) {
    case 'RUNNING':
    case 'IN_PROGRESS':
      return 'blue';
    case 'COMPLETED':
      return 'green';
    case 'FAILED':
      return 'red';
    case 'SCHEDULED':
      return 'purple';
    default:
      return '';
  }
}
