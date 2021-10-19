import callbackUtils from '../../callback-utils';

export type TaskStatus = 'COMPLETED' | 'FAILED' | 'SCHEDULED' | 'IN_PROGRESS';
export type WorkflowStatus = 'COMPLETED' | 'FAILED' | 'RUNNING';

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
  result: ExecutedWorkflowPayload;
};

async function getWorkflowExecOutput(workflowId: string) {
  const callbacks = callbackUtils.getCallbacks;
  const response = await callbacks.getWorkflowInstanceDetail(workflowId);
  const data = response as ExecutedWorkflowResponse;
  return data;
}

export async function* asyncGenerator(workflowId: string): AsyncGenerator<ExecutedWorkflowResponse, void, unknown> {
  let data = await getWorkflowExecOutput(workflowId);
  while (data.result.status !== 'FAILED' && data.result.status !== 'COMPLETED') {
    yield data;
    // eslint-disable-next-line no-await-in-loop
    data = await getWorkflowExecOutput(workflowId);
  }
  // we need to do an additional yield for the last task status change
  if (data.result.status === 'FAILED' || data.result.status === 'COMPLETED') {
    yield data;
  }
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
