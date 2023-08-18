import { callbackUtils, ExecutedWorkflowResponse, TaskStatus, useAsyncGenerator, WorkflowStatus } from '@frinx/shared';

async function getWorkflowExecOutput(
  workflowId: string,
  abortController: AbortController,
): Promise<ExecutedWorkflowResponse | null> {
  const { getWorkflowInstanceDetail } = callbackUtils.getCallbacks;
  try {
    const response = await getWorkflowInstanceDetail(workflowId, { signal: abortController.signal });
    return response;
  } catch (error) {
    return null;
  }
}

export function useWorkflowGenerator(workflowId: string): ExecutedWorkflowResponse | null {
  const data = useAsyncGenerator<ExecutedWorkflowResponse>({
    repeatTill: (workflow) => workflow?.result.status === 'RUNNING' || workflow?.result.status === 'PAUSED',
    fn: (abortController) => () => getWorkflowExecOutput(workflowId, abortController),
    updateDeps: [workflowId],
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
