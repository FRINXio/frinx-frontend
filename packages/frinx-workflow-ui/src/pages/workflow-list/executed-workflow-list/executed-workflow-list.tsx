import React, { useMemo, useState } from 'react';
import { Container, Progress, VStack, Text } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import ExecutedWorkflowSearchBox, { ExecutedWorkflowSearchQuery } from './executed-workflow-searchbox/executed-workflow-searchbox';
import ExecutedWorkflowsTable from './executed-workflow-table/executed-workflow-table';
import ExecutedWorkflowBulkOperationsBlock from './executed-workflow-bulk-operations-block/executed-workflow-bulk-operations';
import { gql, useQuery } from 'urql';
import { ExecutedWorkflow, ExecutedWorkflowsQuery, ExecutedWorkflowsQueryVariables, ExecutedWorkflowStatus } from '../../../__generated__/graphql';
import { makeArrayFromValue, makeURLSearchParamsFromObject } from '../../../helpers/utils.helpers';
import moment from 'moment';
import { omitNullValue } from '@frinx/shared/src';

export type SortProperty = { key: keyof ExecutedWorkflow, value: 'ASC' | 'DESC' };

export type ExecutedworkflowsFilter = {
  isRootWorkflow: boolean,
  from?: string,
  to?: string,
  status: ExecutedWorkflowStatus[] | ExecutedWorkflowStatus,
  workflowId: string[] | string,
  workflowType: string[] | string,
  workflowsPerPage: number
}

const EXECUTED_WORKFLOW_QUERY = gql`
  query ExecutedWorkflows($pagination: PaginationArgs, $searchQuery: ExecutedWorkflowSearchInput) {
    executedWorkflows(pagination: $pagination, searchQuery: $searchQuery) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          createdAt
          updatedAt
          status
          parentWorkflowId
          input
          output
          startTime
          endTime
          workflowVersion
          workflowName
          workflowId
        }
      }
    }
  }
`;

const BULK_PAUSE_MUTATION = gql`
  mutation BulkPause($workflowIds: [String!]!) {
    bulkPauseWorkflow(workflowIds: $workflowIds) {
      bulkErrorResults
      bulkSuccessfulResults
    }
  }
`;

const BULK_RESUME_MUTATION = gql`
  mutation BulkResume($workflowIds: [String!]!) {
    bulkResumeWorkflow(workflowIds: $workflowIds) {
      bulkErrorResults
      bulkSuccessfulResults
    }
  }
`;

const ExecutedWorkflowList = () => {
  const ctx = useMemo(() => ({ additionalTypenames: ['ExecutedWorkflows'] }), [])
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<ExecutedWorkflowSearchQuery>(() => {
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
      ...(to != null && { to: moment(new Date(to)).format('dd-MM-yyyyThh:mm') })
    }
  });
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [sort, setSort] = useState<SortProperty>({ key: 'startTime', value: 'DESC' });
  const [isFlat, setIsFlat] = useState(false);

  const [{ data, fetching: isLoadingWorkflows, error }] = useQuery<ExecutedWorkflowsQuery, ExecutedWorkflowsQueryVariables>({
    query: EXECUTED_WORKFLOW_QUERY,
    variables: function() {
      const status = filter.status.map((s) => {
        if (s === 'PAUSED' || s === 'TERMINATED' || s === 'RUNNING' || s === 'COMPLETED' || s === 'FAILED' || s === 'TIMED_OUT') {
          return s;
        }
        return null;
      });

      const result = {
        pagination: {
          size: filter?.workflowsPerPage ?? 20,
          start: 0
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
            ...(filter.status != null && filter.status.length > 0 && { status: status.filter(omitNullValue<ExecutedWorkflowStatus>) }),
            ...(filter.workflowId != null && filter.workflowId.length > 0 && { workflowId: filter.workflowId }),
            ...(filter.workflowType != null && filter.workflowType.length > 0 && { workflowType: filter.workflowType })
          }
        }
      }

      return result;
    }(),
    context: ctx
  });

  const handleOnWorkflowSelect = (workflowId: string) => {
    const isAlreadySelected = selectedWorkflows.includes(workflowId);

    if (isAlreadySelected) {
      setSelectedWorkflows(selectedWorkflows.filter((selectedWorkflowId) => selectedWorkflowId !== workflowId))
    } else {
      setSelectedWorkflows([...selectedWorkflows, workflowId])
    }
  }

  const handleOnAllWorkflowsSelect = () => {
    const areAllWorkflowsSelected = data?.executedWorkflows?.edges.length === selectedWorkflows.length;

    if (data == null || data.executedWorkflows == null || data?.executedWorkflows?.edges == null || data?.executedWorkflows?.edges.length === 0) {
      setSelectedWorkflows([])

      return
    }

    if (areAllWorkflowsSelected) {
      setSelectedWorkflows([])
    } else {
      setSelectedWorkflows(data.executedWorkflows.edges.map(({ node }) => node.id))
    }
  }

  const handleOnSort = ({ key, value }: SortProperty) => {
    if (key === sort.key && value === 'ASC') {
      setSort({ key, value: 'DESC' });
      return;
    }

    if (key === sort.key && value === 'DESC') {
      setSort({ key, value: 'ASC' });
      return;
    }

    setSort({ key, value: 'DESC' });
  }

  const handleOnSearchBoxSubmit = (searchInput: ExecutedWorkflowSearchQuery) => {
    setFilter(searchInput);

    const newSearchParams = makeURLSearchParamsFromObject({
      ...searchInput,
      isRootWorkflow: searchInput.isRootWorkflow.toString(),
    })
    setSearchParams(newSearchParams);
  }

  console.log(filter, data)

  return (
    <Container maxWidth={1200} mx="auto">
      <VStack spacing={10} alignItems="stretch">
        <ExecutedWorkflowSearchBox
          onSearchBoxSubmit={handleOnSearchBoxSubmit}
          onTableTypeChange={() => setIsFlat((prev) => !prev)}
          isFlat={isFlat}
          initialSearchValues={filter}
        />

        <ExecutedWorkflowBulkOperationsBlock
          amountOfVisibleWorkflows={data?.executedWorkflows?.edges.length ?? 0}
          amountOfSelectedWorkflows={selectedWorkflows.length}
          onPause={() => { }}
          onRetry={() => { }}
          onResume={() => { }}
          onTerminate={() => { }}
          onRestartWithLatest={() => { }}
          onRestartWithCurrent={() => { }}
        />

        {!isLoadingWorkflows && (data == null || data.executedWorkflows == null || data.executedWorkflows.edges.length === 0) && (
          <Text>There are no workflows</Text>
        )}

        {error != null && (
          <Text textColor="red">{JSON.stringify(error)}</Text>
        )}

        {isLoadingWorkflows && <Progress isIndeterminate size="sm" />}

        {data != null && data.executedWorkflows != null && !isLoadingWorkflows && (
          <ExecutedWorkflowsTable
            onSelectAllWorkflows={handleOnAllWorkflowsSelect}
            onSortPropertyClick={handleOnSort}
            sort={sort}
            workflows={data}
            onWorkflowSelect={handleOnWorkflowSelect}
            selectedWorkflows={selectedWorkflows}
            isFlat={isFlat}
          />
        )}
      </VStack>

      {/* <Paginator currentPage={currentPage} onPaginationClick={setCurrentPage} pagesCount={totalPages} showPageNumbers /> */}
    </Container>
  );
};

export default ExecutedWorkflowList;
