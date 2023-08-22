import { Workflow } from '@frinx/shared';
import { ModalWorkflowsQuery } from '../__generated__/graphql';

export function convertGraphqlToClientWorkflow(workflowsData: ModalWorkflowsQuery): Workflow[] {
  return workflowsData.workflows.edges.map((e) => {
    const { node } = e;
    const updateTime = node.updatedAt ? new Date(node.updatedAt).getMilliseconds() : 0;
    return {
      correlationId: '',
      description: node.description ?? undefined,
      hasSchedule: node.hasSchedule ?? false,
      name: node.name,
      version: node.version ?? 1,
      outputParameters: node.outputParameters ?? {},
      restartable: node.restartable ?? false,
      ownerEmail: node.ownerEmail ?? '',
      schemaVersion: 2,
      updateTime,
      timeoutPolicy: node.timeoutPolicy ?? '',
      timeoutSeconds: node.timeoutSeconds,
      variables: node.variables ?? {},
      tasks: [],
    };
  });
}
