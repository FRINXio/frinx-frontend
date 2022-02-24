import { useEffect, useRef, useState } from 'react';
import uniflowCallbackUtils from '../../uniflow-callback-utils';

export type TaskStatus = 'COMPLETED' | 'FAILED' | 'SCHEDULED' | 'IN_PROGRESS';
export type WorkflowStatus = 'COMPLETED' | 'FAILED' | 'RUNNING';

/* eslint-disable @typescript-eslint/naming-convention */
export type CommitDataPayload<T = WorkflowStatus> =
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

export type CalcDiffPayload = {
  changes: {
    creates: {
      sites: Record<string, unknown>;
      'vpn-services': Record<string, unknown>;
    };
    deletes: {
      site: unknown[];
      vpn_service: unknown[];
    };
    updates: {
      sites: Record<string, unknown>;
      'vpn-services': Record<string, unknown>;
    };
  };
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
  outputData: CommitDataPayload<TaskStatus>;
};
export type ExecutedWorkflowPayload<T> = {
  createTime: number;
  updateTime: number;
  endTime: number;
  status: WorkflowStatus;
  workflowId: string;
  tasks: TaskStatusPayload[];
  output: T;
};
export type ExecutedWorkflowResponse<T> = {
  result: ExecutedWorkflowPayload<T>;
};

async function getWorkflowExecOutput<T>(workflowId: string, abortController: AbortController) {
  const callbacks = uniflowCallbackUtils.getCallbacks;
  const response = await callbacks.getWorkflowInstanceDetail(workflowId, { signal: abortController.signal });
  const data = response as T;
  return data;
}

export type AsyncGeneratorParams = {
  workflowId: string;
  abortController: AbortController;
  onFinish?: (isCompleted: boolean) => void;
};

export async function* asyncGenerator<T>({
  workflowId,
  abortController,
  onFinish,
}: AsyncGeneratorParams): AsyncGenerator<ExecutedWorkflowResponse<T>, void, unknown> {
  let data = await getWorkflowExecOutput<ExecutedWorkflowResponse<T>>(workflowId, abortController);
  while (data.result.status === 'RUNNING') {
    yield data;
    // eslint-disable-next-line no-await-in-loop
    data = await getWorkflowExecOutput(workflowId, abortController);
  }
  // we need to do an additional yield for the last task status change
  if (data.result.status === 'FAILED' || data.result.status === 'COMPLETED') {
    yield data;
    if (onFinish) {
      onFinish(data.result.status === 'COMPLETED');
    }
  }
}

export type UseAsyncGeneratorParams = {
  workflowId: string | null;
  onFinish?: (isCompleted: boolean) => void;
};

export function useAsyncGenerator<T>(props: UseAsyncGeneratorParams): ExecutedWorkflowPayload<T> | null {
  const { current: controller } = useRef(new AbortController());
  const [execPayload, setExecPayload] = useState<ExecutedWorkflowPayload<T> | null>(null);

  useEffect(() => {
    (async () => {
      const { workflowId, onFinish } = props;
      if (workflowId != null) {
        // we have to use async iterator here, so we turn off this rule
        // eslint-disable-next-line no-restricted-syntax
        for await (const data of asyncGenerator<T>({ workflowId, abortController: controller, onFinish })) {
          setExecPayload(data.result);
        }
      }
    })();
  }, [props, controller]);

  // we need to abort all fetch requests on unmount, otherwise we will get an error
  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, [controller]);

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
