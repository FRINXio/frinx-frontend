import { orderBy } from 'lodash';
import moment from 'moment';
import { makeArrayFromValue, parseBoolean } from '../../helpers/utils.helpers';
import {
  ExecutedWorkflowsQuery,
  SortExecutedWorkflowsBy,
  SortExecutedWorkflowsDirection,
  Workflow,
  WorkflowStatus,
} from '../../__generated__/graphql';

export type SortProperty = { key: keyof Workflow | 'workflowName'; value: 'ASC' | 'DESC' };

export type SortKey = SortExecutedWorkflowsBy;

export type OrderBy = {
  sortKey: SortKey;
  direction: SortExecutedWorkflowsDirection;
};
export type ExecutedWorkflowSearchQuery = {
  isRootWorkflow: boolean;
  from?: string;
  to?: string;
  status: string[];
  workflowId: string[];
  workflowType?: string[];
  workflowsPerPage: number;
};

// TODO: FIXME
export function makeSearchQueryVariableFromFilter(filter: ExecutedWorkflowSearchQuery): Partial<unknown> {
  const initialStatus: WorkflowStatus[] = [];
  const status = filter.status.map((s) => {
    if (
      s === 'PAUSED' ||
      s === 'TERMINATED' ||
      s === 'RUNNING' ||
      s === 'COMPLETED' ||
      s === 'FAILED' ||
      s === 'TIMED_OUT'
    ) {
      return s;
    }
    return null;
  });

  return {
    pagination: {
      size: filter?.workflowsPerPage ?? 20,
      start: 0,
    },
    searchQuery: {
      ...(filter.isRootWorkflow != null && { isRootWorkflow: filter.isRootWorkflow }),
      query: {
        ...(filter.from != null && {
          startTime: {
            from: filter.from,
            to: filter.to,
          },
        }),
        ...(filter.status != null &&
          filter.status.length > 0 && {
            status: status.reduce((acc, s) => {
              if (s != null) {
                acc.push(s);
              }

              return acc;
            }, initialStatus),
          }),
        ...(filter.workflowId != null && filter.workflowId.length > 0 && { workflowId: filter.workflowId }),
        ...(filter.workflowType != null && filter.workflowType.length > 0 && { workflowType: filter.workflowType }),
      },
    },
  };
}

export function makeFilterFromSearchParams(searchParams: URLSearchParams): ExecutedWorkflowSearchQuery {
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const workflowsPerPage = Number(searchParams.get('workflowsPerPage'));

  return {
    isRootWorkflow: parseBoolean(searchParams.get('isRootWorkflow')),
    status: makeArrayFromValue(searchParams.getAll('status')).filter((wf) => wf.length > 0),
    workflowId: makeArrayFromValue(searchParams.getAll('workflowId')).filter((wf) => wf.length > 0),
    workflowType: makeArrayFromValue(searchParams.getAll('workflowType').filter((wf) => wf.length > 0)),
    workflowsPerPage: workflowsPerPage > 0 ? workflowsPerPage : 20,
    ...(from != null && { from: moment(new Date(from)).toISOString() }),
    ...(to != null && { to: moment(new Date(to)).toISOString() }),
  };
}

type GeneratedExecutedWorkflows = NonNullable<ExecutedWorkflowsQuery['conductor']['executedWorkflows']>['edges'];

export function sortExecutedWorkflows(
  workflows: GeneratedExecutedWorkflows,
  sort: SortProperty,
): GeneratedExecutedWorkflows {
  if (sort.value === 'ASC') {
    switch (sort.key) {
      case 'startTime':
        return orderBy(workflows, ['node.startTime'], ['asc']);
      case 'endTime':
        return orderBy(workflows, ['node.endTime'], ['asc']);
      case 'workflowName':
        return orderBy(workflows, ['node.workflowDefinition.name'], ['asc']);
      case 'originalId':
        return orderBy(workflows, ['node.originalId'], ['asc']);
      case 'status':
        return orderBy(workflows, ['node.status'], ['asc']);
      default:
        return workflows;
    }
  }
  switch (sort.key) {
    case 'startTime':
      return orderBy(workflows, ['node.startTime'], ['desc']);
    case 'endTime':
      return orderBy(workflows, ['node.endTime'], ['desc']);
    case 'workflowName':
      return orderBy(workflows, ['node.workflowDefinition.name'], ['desc']);
    case 'originalId':
      return orderBy(workflows, ['node.originalId'], ['desc']);
    case 'status':
      return orderBy(workflows, ['node.status'], ['desc']);
    default:
      return workflows;
  }
}
