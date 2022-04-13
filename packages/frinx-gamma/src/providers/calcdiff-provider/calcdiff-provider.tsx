import React, { createContext, FC, useEffect, useMemo, useState } from 'react';
import { CalcDiffPayload } from '../../components/commit-status-modal/commit-status-modal.helpers';
import { getCalcDiff } from './calcdiff-provider.helpers';
import { calcDiffData } from './calcdiff-data.js';

export type CalcDiffContextProps = {
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

export const CalcDiffContext = createContext<CalcDiffContextProps | null>(null);

export const CalcDiffProvider: FC = ({ children }) => {
  const [dataState, setDataState] = useState<CalcDiffState>(INITIAL_STATE);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCalcDiff();
      // const data = calcDiffData.output;
      // console.log(data);

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
