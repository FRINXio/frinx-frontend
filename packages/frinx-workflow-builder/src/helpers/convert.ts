import { jsonParse, Workflow } from '@frinx/shared';
import { WorkflowDefinitionFragmentFragment } from '../__generated__/graphql';

// type WorkflowDefinitionFragmentFragment = {
//   updatedAt: string;
//   variables: string;
//   outputParameters: { key: string; value: string }[];
//   description: string;
//   name: string;
//   hasSchedule: boolean;
//   version: number;
//   restartable: boolean;
//   ownerEmail: string;
//   timeoutPolicy: string;
//   timeoutSeconds: number;
// };

export function convertWorkflowFragmentToClientWorkflow(fragment: WorkflowDefinitionFragmentFragment): Workflow {
  const updateTime = fragment.updatedAt ? new Date(fragment.updatedAt).getMilliseconds() : 0;
  const variables: Record<string, string> = jsonParse<Record<string, string>>(fragment.variables) ?? {};
  const outputParameters: Record<string, string> =
    fragment.outputParameters?.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.key]: curr.value,
      };
    }, {}) ?? {};

  return {
    correlationId: '',
    description: fragment.description ?? undefined,
    hasSchedule: fragment.hasSchedule ?? false,
    name: fragment.name,
    version: fragment.version ?? 1,
    outputParameters,
    restartable: fragment.restartable ?? false,
    ownerEmail: fragment.ownerEmail ?? '',
    schemaVersion: 2,
    updateTime,
    timeoutPolicy: fragment.timeoutPolicy,
    timeoutSeconds: fragment.timeoutSeconds ?? 0,
    variables,
    tasks: [],
  };
}
