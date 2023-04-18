import { omitNullValue } from '@frinx/shared/src';
import moment from 'moment';
import { makeArrayFromValue } from '../../../helpers/utils.helpers';
import { ExecutedWorkflowStatus } from '../../../__generated__/graphql';
import { ExecutedWorkflowSearchQuery } from './executed-workflow-searchbox/executed-workflow-searchbox';

export function makeSearchQueryVariableFromFilter(filter: ExecutedWorkflowSearchQuery) {
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

  const result = {
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
          filter.status.length > 0 && { status: status.filter(omitNullValue<ExecutedWorkflowStatus>) }),
        ...(filter.workflowId != null && filter.workflowId.length > 0 && { workflowId: filter.workflowId }),
        ...(filter.workflowType != null && filter.workflowType.length > 0 && { workflowType: filter.workflowType }),
      },
    },
  };

  return result;
}

export function makeFilterFromSearchParams(searchParams: URLSearchParams): ExecutedWorkflowSearchQuery {
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const workflowsPerPage = Number(searchParams.get('workflowsPerPage'));

  return {
    isRootWorkflow: Boolean(searchParams.get('isRootWorkflow')) ?? false,
    status: makeArrayFromValue(searchParams.getAll('status')),
    workflowId: makeArrayFromValue(searchParams.getAll('workflowId')),
    workflowType: makeArrayFromValue(searchParams.getAll('workflowType')),
    workflowsPerPage: workflowsPerPage > 0 ? workflowsPerPage : 20,
    ...(from != null && { from: moment(new Date(from)).format('dd-MM-yyyyThh:mm') }),
    ...(to != null && { to: moment(new Date(to)).format('dd-MM-yyyyThh:mm') }),
  };
}
