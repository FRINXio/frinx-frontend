import { useContext } from 'react';
import unwrap from '../../helpers/unwrap';
import { CalcDiffContext, CalcDiffContextProps } from './calcdiff-provider';

export default function useCalcDiffContext(): CalcDiffContextProps {
  return unwrap(useContext(CalcDiffContext));
}
