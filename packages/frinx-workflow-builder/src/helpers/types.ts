import { ExtendedDecisionTask, ExtendedTask } from '@frinx/shared';

export type GraphExtendedDecisionTask = Omit<ExtendedDecisionTask, 'decisionCases'> & {
  isCaseExpressionEnabled: boolean;
  decisionCases: { key: string; tasks: ExtendedTask[] }[];
};
export type GraphExtendedTask = Exclude<ExtendedTask, ExtendedDecisionTask> | GraphExtendedDecisionTask;
