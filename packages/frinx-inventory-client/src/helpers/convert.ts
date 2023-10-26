import { omitNullValue } from '@frinx/shared';
import { ModalWorkflowsQuery } from '../__generated__/graphql';

export type ModalWorkflow = {
  correlationId: string;
  description: string | undefined;
  name: string;
  version: number;
  inputParameters: (string | null)[];
  outputParameters: unknown;
  restartable: boolean;
  ownerEmail: string;
  schemaVersion: number;
  timeoutPolicy: string;
  timeoutSeconds: unknown;
  variables: unknown;
  tasks: never[];
};

export function convertGraphqlToClientWorkflow(workflowsData: ModalWorkflowsQuery): ModalWorkflow[] {
  if (workflowsData.conductor.getAll == null) {
    return [];
  }
  return workflowsData.conductor.getAll
    .map((workflow) => {
      if (workflow == null) {
        return null;
      }
      return {
        correlationId: '',
        description: workflow.description ?? undefined,
        name: workflow.name,
        version: workflow.version ?? 1,
        inputParameters: workflow.inputParameters ?? [],
        outputParameters: workflow.outputParameters ?? {},
        restartable: workflow.restartable ?? false,
        ownerEmail: workflow.ownerEmail ?? '',
        schemaVersion: 2,
        timeoutPolicy: workflow.timeoutPolicy ?? '',
        timeoutSeconds: workflow.timeoutSeconds,
        variables: workflow.variables ?? {},
        tasks: [],
      };
    })
    .filter(omitNullValue);
}
