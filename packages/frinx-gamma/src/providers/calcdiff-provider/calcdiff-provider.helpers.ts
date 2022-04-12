import { asyncGenerator, CalcDiffPayload } from '../../components/commit-status-modal/commit-status-modal.helpers';
import { getTransactionId } from '../../helpers/transaction-id';
import unwrap from '../../helpers/unwrap';
import uniflowCallbackUtils from '../../uniflow-callback-utils';

export async function getWorkflowId(nodeName: 'service' | 'vpn-bearer'): Promise<string> {
  const callbacks = uniflowCallbackUtils.getCallbacks;
  const workflowResult = await callbacks.executeWorkflow({
    name: 'Process_calcdiff_ui',
    version: 2,
    input: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unistore_node_name: nodeName,
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
      return data.result.output;
    }
  }

  throw Error(`Could not get workflow data: ${workflowId}`);
}

export async function getCalcDiff(): Promise<{ service: CalcDiffPayload; bearer: CalcDiffPayload } | null> {
  try {
    const serviceWorkflowId = await getWorkflowId('service');
    const bearerWorkflowId = await getWorkflowId('vpn-bearer');
    const serviceData = await pollData(serviceWorkflowId);
    const bearerData = await pollData(bearerWorkflowId);

    return { service: serviceData, bearer: bearerData };
  } catch (e) {
    return null;
  }
}
