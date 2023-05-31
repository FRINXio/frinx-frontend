import { orderBy } from 'lodash';
import moment from 'moment';
import { makeArrayFromValue, parseBoolean } from '../../../helpers/utils.helpers';
import {
  ExecutedWorkflowsQuery,
  ExecutedWorkflowsQueryVariables,
  ExecutedWorkflowStatus,
} from '../../../__generated__/graphql';
import { SortProperty } from './executed-workflow-list';
import { ExecutedWorkflowSearchQuery } from './executed-workflow-searchbox/executed-workflow-searchbox';

export function makeSearchQueryVariableFromFilter(
  filter: ExecutedWorkflowSearchQuery,
): ExecutedWorkflowsQueryVariables {
  const initialStatus: ExecutedWorkflowStatus[] = [];
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
    status: makeArrayFromValue(searchParams.getAll('status')),
    workflowId: makeArrayFromValue(searchParams.getAll('workflowId')),
    workflowType: makeArrayFromValue(searchParams.getAll('workflowType')),
    workflowsPerPage: workflowsPerPage > 0 ? workflowsPerPage : 20,
    ...(from != null && { from: moment(new Date(from)).format('yyyy-MM-DDThh:mm:ss.SSSZ') }),
    ...(to != null && { to: moment(new Date(to)).format('yyyy-MM-DDThh:mm:ss.SSSZ') }),
  };
}

type GeneratedExecutedWorkflows = NonNullable<ExecutedWorkflowsQuery['executedWorkflows']>['edges'];

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
        return orderBy(workflows, ['node.workflowName'], ['asc']);
      case 'workflowId':
        return orderBy(workflows, ['node.workflowId'], ['asc']);
      case 'status':
        return orderBy(workflows, ['node.status'], ['asc']);
      default:
        return workflows;
    }
  } else {
    switch (sort.key) {
      case 'startTime':
        return orderBy(workflows, ['node.startTime'], ['desc']);
      case 'endTime':
        return orderBy(workflows, ['node.endTime'], ['desc']);
      case 'workflowName':
        return orderBy(workflows, ['node.workflowName'], ['desc']);
      case 'workflowId':
        return orderBy(workflows, ['node.workflowId'], ['desc']);
      case 'status':
        return orderBy(workflows, ['node.status'], ['desc']);
      default:
        return workflows;
    }
  }
}
