import React, { createContext, FC, useEffect, useMemo, useState } from 'react';
import { CalcDiffPayload } from '../../components/commit-status-modal/commit-status-modal.helpers';
import { getCalcDiff } from './calcdiff-provider.helpers';

export type State = { service: CalcDiffPayload | null; bearer: CalcDiffPayload | null };
export type CalcDiffContextProps = {
  data: { service: CalcDiffPayload | null; bearer: CalcDiffPayload | null } | null;
  invalidateCache: () => void;
  isValid: boolean;
  isLoading: boolean;
};

type CalcDiffState =
  | {
      isLoading: true;
      data: null;
      error: null;
    }
  | {
      isLoading: false;
      data: State;
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

export const CalcDiffContext = createContext<CalcDiffContextProps | null>(null);

export const CalcDiffProvider: FC = ({ children }) => {
  const [dataState, setDataState] = useState<CalcDiffState>(INITIAL_STATE);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCalcDiff();
      if (data != null) {
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
      isValid,
      isLoading: dataState.isLoading,
    }),
    [dataState, isValid],
  );

  return <CalcDiffContext.Provider value={value}>{children}</CalcDiffContext.Provider>;
};
