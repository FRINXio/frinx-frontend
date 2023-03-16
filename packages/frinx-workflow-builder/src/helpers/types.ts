import { ExtendedDecisionTask, ExtendedSwitchTask, ExtendedTask } from '@frinx/shared/src';

export type GraphExtendedDecisionTask = Omit<ExtendedDecisionTask, 'decisionCases'> & {
  isCaseExpressionEnabled: boolean;
  decisionCases: { key: string; tasks: ExtendedTask[] }[];
};

export type GraphExtendedSwitchTask = Omit<ExtendedSwitchTask, 'decisionCases'> & {
  decisionCases: { key: string; tasks: ExtendedTask[] }[];
  expression: string;
};

export type GraphExtendedTask =
  | Exclude<ExtendedTask, ExtendedDecisionTask | ExtendedSwitchTask>
  | GraphExtendedDecisionTask
  | GraphExtendedSwitchTask;
