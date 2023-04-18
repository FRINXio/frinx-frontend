import { Container, Progress, Text, VStack } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared/src';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import { makeURLSearchParamsFromObject } from '../../../helpers/utils.helpers';
import {
  ExecutedWorkflow,
  ExecutedWorkflowsQuery,
  ExecutedWorkflowsQueryVariables,
  ExecutedWorkflowStatus,
} from '../../../__generated__/graphql';
import ExecutedWorkflowBulkOperationsBlock from './executed-workflow-bulk-operations-block/executed-workflow-bulk-operations';
import ExecutedWorkflowSearchBox, {
  ExecutedWorkflowSearchQuery,
} from './executed-workflow-searchbox/executed-workflow-searchbox';
import ExecutedWorkflowsTable from './executed-workflow-table/executed-workflow-table';
import { makeFilterFromSearchParams, makeSearchQueryVariableFromFilter } from './executed-workflow.helpers';

export type SortProperty = { key: keyof ExecutedWorkflow; value: 'ASC' | 'DESC' };

export type ExecutedworkflowsFilter = {
  isRootWorkflow: boolean;
  from?: string;
  to?: string;
  status: ExecutedWorkflowStatus[] | ExecutedWorkflowStatus;
  workflowId: string[] | string;
  workflowType: string[] | string;
  workflowsPerPage: number;
};

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

const BULK_RETRY_MUTATION = gql`
  mutation BulkRetry($workflowIds: [String!]!) {
    bulkRetryWorkflow(workflowIds: $workflowIds) {
      bulkErrorResults
      bulkSuccessfulResults
    }
  }
`;

const BULK_TERMINATE_MUTATION = gql`
  mutation BulkTerminate($workflowIds: [String!]!) {
    bulkTerminateWorkflow(workflowIds: $workflowIds) {
      bulkErrorResults
      bulkSuccessfulResults
    }
  }
`;

const BULK_RESTART_MUTATION = gql`
  mutation BulkRestart($workflowIds: [String!]!) {
    bulkRestartWorkflow(workflowIds: $workflowIds) {
      bulkErrorResults
      bulkSuccessfulResults
    }
  }
`;

const ExecutedWorkflowList = () => {
  const ctx = useMemo(() => ({ additionalTypenames: ['ExecutedWorkflows'] }), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToastNotification } = useNotifications();

  const [filter, setFilter] = useState<ExecutedWorkflowSearchQuery>(makeFilterFromSearchParams(searchParams));
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [sort, setSort] = useState<SortProperty>({ key: 'startTime', value: 'DESC' });
  const [isFlat, setIsFlat] = useState(false);

  const [{ data, fetching: isLoadingWorkflows, error }] = useQuery<
    ExecutedWorkflowsQuery,
    ExecutedWorkflowsQueryVariables
  >({
    query: EXECUTED_WORKFLOW_QUERY,
    variables: makeSearchQueryVariableFromFilter(filter),
    context: ctx,
  });

  const [, onBulkPause] = useMutation(BULK_PAUSE_MUTATION);
  const [, onBulkRetry] = useMutation(BULK_RETRY_MUTATION);
  const [, onBulkResume] = useMutation(BULK_RESUME_MUTATION);
  const [, onBulkRestart] = useMutation(BULK_RESTART_MUTATION);
  const [, onBulkTerminate] = useMutation(BULK_TERMINATE_MUTATION);

  const handleOnWorkflowSelect = (workflowId: string) => {
    const isAlreadySelected = selectedWorkflows.includes(workflowId);

    if (isAlreadySelected) {
      setSelectedWorkflows(selectedWorkflows.filter((selectedWorkflowId) => selectedWorkflowId !== workflowId));
    } else {
      setSelectedWorkflows([...selectedWorkflows, workflowId]);
    }
  };

  const handleOnAllWorkflowsSelect = () => {
    const areAllWorkflowsSelected = data?.executedWorkflows?.edges.length === selectedWorkflows.length;

    if (
      data == null ||
      data.executedWorkflows == null ||
      data?.executedWorkflows?.edges == null ||
      data?.executedWorkflows?.edges.length === 0
    ) {
      setSelectedWorkflows([]);

      return;
    }

    if (areAllWorkflowsSelected) {
      setSelectedWorkflows([]);
    } else {
      setSelectedWorkflows(data.executedWorkflows.edges.map(({ node }) => node.id));
    }
  };

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
  };

  const handleOnSearchBoxSubmit = (searchInput: ExecutedWorkflowSearchQuery) => {
    setFilter(searchInput);

    const newSearchParams = makeURLSearchParamsFromObject(searchInput);
    setSearchParams(newSearchParams);
  };

  const handleOnBulkOperation = (action: 'pause' | 'resume' | 'retry' | 'terminate' | 'restart') => {
    let wasSuccessfull = false;

    if (selectedWorkflows == null || selectedWorkflows.length === 0) {
      addToastNotification({
        content: 'You need to selected atleast one workflow',
        type: 'error',
      });

      return;
    }

    switch (action) {
      case 'pause':
        onBulkPause(selectedWorkflows).then((res) => (wasSuccessfull = res.error == null));
        break;
      case 'restart':
        onBulkRestart(selectedWorkflows).then((res) => (wasSuccessfull = res.error == null));
        break;
      case 'resume':
        onBulkResume(selectedWorkflows).then((res) => (wasSuccessfull = res.error == null));
        break;
      case 'retry':
        onBulkRetry(selectedWorkflows).then((res) => (wasSuccessfull = res.error == null));
        break;
      case 'terminate':
        onBulkTerminate(selectedWorkflows).then((res) => (wasSuccessfull = res.error == null));
        break;
      default:
        break;
    }

    if (wasSuccessfull) {
      addToastNotification({
        content: 'Bulk operation executed successfully',
        type: 'success',
      });
    } else {
      addToastNotification({
        content: 'We had a problem to execute the bulk operation. Try again please.',
        type: 'error',
      });
    }
  };

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
          onPause={() => {
            handleOnBulkOperation('pause');
          }}
          onRetry={() => {
            handleOnBulkOperation('retry');
          }}
          onResume={() => {
            handleOnBulkOperation('resume');
          }}
          onTerminate={() => {
            handleOnBulkOperation('terminate');
          }}
          onRestart={() => {
            handleOnBulkOperation('restart');
          }}
        />

        {!isLoadingWorkflows &&
          (data == null || data.executedWorkflows == null || data.executedWorkflows.edges.length === 0) && (
            <Text>There are no workflows</Text>
          )}

        {error != null && <Text textColor="red">{JSON.stringify(error)}</Text>}

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
