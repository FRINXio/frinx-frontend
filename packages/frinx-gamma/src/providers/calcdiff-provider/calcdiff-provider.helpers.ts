import { asyncGenerator, CalcDiffPayload } from '../../components/commit-status-modal/commit-status-modal.helpers';
import { getTransactionId } from '../../helpers/transaction-id';
import unwrap from '../../helpers/unwrap';
import uniflowCallbackUtils from '../../uniflow-callback-utils';

export async function getWorkflowId(): Promise<string> {
  const callbacks = uniflowCallbackUtils.getCallbacks;
  const workflowResult = await callbacks.executeWorkflow({
    name: 'Process_calcdiff_ui',
    version: 2,
    input: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unistore_node_name: 'service',
      US_UI_TX: unwrap(getTransactionId()),
    },
  });

  const workflowId = workflowResult.text;

  if (!workflowId) {
    throw Error('worklow was not created');
  }

  return workflowId;
}

export async function pollData(workflowId: string): Promise<CalcDiffPayload> {
  const controller = new AbortController();

  // eslint-disable-next-line no-restricted-syntax
  for await (const data of asyncGenerator<CalcDiffPayload>({
    workflowId,
    abortController: controller,
    onFinish: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  })) {
    if (data.result.status === 'COMPLETED') {
      // eslint-disable-next-line no-console
      console.log(data.result.output);
      return data.result.output;
    }
  }

  throw Error(`Could not get workflow data: ${workflowId}`);
}

export async function getCalcDiff(): Promise<CalcDiffPayload | null> {
  try {
    const workflowId = await getWorkflowId();
    const data = await pollData(workflowId);

    return data;
  } catch (e) {
    return null;
  }
}
