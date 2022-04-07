import React, { createContext, FC, useEffect, useMemo, useState } from 'react';
import { asyncGenerator, CalcDiffPayload } from './components/commit-status-modal/commit-status-modal.helpers';
import { getTransactionId } from './helpers/transaction-id';
import uniflowCallbackUtils from './uniflow-callback-utils';
import unwrap from './helpers/unwrap';

type ContextProps = {
  data: CalcDiffPayload | null;
  invalidateCache: () => void;
};

type CalcDiffState =
  | {
      isLoading: true;
      data: null;
      error: null;
    }
  | {
      isLoading: false;
      data: CalcDiffPayload;
      error: null;
    }
  | {
      isLoading: false;
      data: null;
      error: string;
    };

const INITIAL_STATE: CalcDiffState = {
  isLoading: true as const,
  data: null,
  error: null,
};

async function getWorkflowId(): Promise<string> {
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

async function pollData(workflowId: string): Promise<CalcDiffPayload> {
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

async function getCalcDiff(): Promise<CalcDiffPayload | null> {
  try {
    const workflowId = await getWorkflowId();
    const data = await pollData(workflowId);

    return data;
  } catch (e) {
    return null;
  }
}

export const CalcDiffContext = createContext<ContextProps | null>(null);

export const CalcDiffProvider: FC = ({ children }) => {
  const [dataState, setDataState] = useState<CalcDiffState>(INITIAL_STATE);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCalcDiff();
      if (data) {
        // const siteChanges = await getSiteChanges(data);
        // console.log('-- site changes: ', siteChanges);
        setDataState({
          isLoading: false,
          data,
          error: null,
        });
      } else {
        setDataState({
          isLoading: false,
          data: null,
          error: `calcdiff error`,
        });
      }
      setIsValid(true);
    };
    if (!isValid) {
      fetchData();
    }
  }, [isValid]);

  const value = useMemo(
    () => ({
      data: dataState.data,
      invalidateCache: () => setIsValid(false),
    }),
    [dataState.data],
  );

  return <CalcDiffContext.Provider value={value}>{children}</CalcDiffContext.Provider>;
};
