import { Container, Progress, Text, useToast, VStack } from '@chakra-ui/react';
import Pagination from '@frinx/inventory-client/src/components/pagination';
import { useNotifications } from '@frinx/shared';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import { makeURLSearchParamsFromObject } from '../../../helpers/utils.helpers';
import {
  BulkPauseWorkflowMutation,
  BulkPauseWorkflowMutationVariables,
  BulkRestartWorkflowMutation,
  BulkRestartWorkflowMutationVariables,
  BulkResumeWorkflowMutation,
  BulkResumeWorkflowMutationVariables,
  BulkRetryWorkflowMutation,
  BulkRetryWorkflowMutationVariables,
  BulkTerminateWorkflowMutation,
  BulkTerminateWorkflowMutationVariables,
  ExecutedWorkflow,
  ExecutedWorkflowsQuery,
  ExecutedWorkflowsQueryVariables,
  ExecutedWorkflowStatus,
} from '../../../__generated__/graphql';
import ExecutedWorkflowBulkOperationsBlock from './executed-workflow-bulk-operations-block/executed-workflow-bulk-operations';
import ExecutedWorkflowSearchBox from './executed-workflow-searchbox/executed-workflow-searchbox';
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
  query ExecutedWorkflows($searchQuery: ExecutedWorkflowSearchInput, $pagination: PaginationArgs) {
    executedWorkflows(searchQuery: $searchQuery, pagination: $pagination) {
      edges {
        cursor
        node {
          endTime
          id
          input
          output
          startTime
          status
          variables
          workflowId
          workflowName
          workflowVersion
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

const BULK_PAUSE_MUTATION = gql`
  mutation BulkPauseWorkflow($input: BulkOperationInput!) {
    bulkPauseWorkflow(input: $input) {
      bulkErrorResults
      bulkSuccessfulResults
    }
  }
`;

const BULK_RESUME_MUTATION = gql`
  mutation BulkResumeWorkflow($input: BulkOperationInput!) {
    bulkResumeWorkflow(input: $input) {
      bulkErrorResults
      bulkSuccessfulResults
    }
  }
`;

const BULK_RETRY_MUTATION = gql`
  mutation BulkRetryWorkflow($input: BulkOperationInput!) {
    bulkRetryWorkflow(input: $input) {
      bulkErrorResults
      bulkSuccessfulResults
    }
  }
`;

const BULK_TERMINATE_MUTATION = gql`
  mutation BulkTerminateWorkflow($input: BulkOperationInput!) {
    bulkTerminateWorkflow(input: $input) {
      bulkErrorResults
      bulkSuccessfulResults
    }
  }
`;

const BULK_RESTART_MUTATION = gql`
  mutation BulkRestartWorkflow($input: BulkOperationInput!) {
    bulkRestartWorkflow(input: $input) {
      bulkErrorResults
      bulkSuccessfulResults
    }
  }
`;

const ExecutedWorkflowList = () => {
  const ctx = useMemo(
    () => ({ additionalTypenames: ['ExecutedWorkflows', 'ExecutedWorkflowConnection', 'ExecutedWorkflowEdge'] }),
    [],
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToastNotification } = useNotifications();
  const toast = useToast();
  const [currentStartOfPage, setCurrentStartOfPage] = useState(0);
  const [isExecutingBulkOperation, setIsExecutingBulkOperation] = useState(false);

  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [sort, setSort] = useState<SortProperty>({ key: 'startTime', value: 'DESC' });
  const [isFlat, setIsFlat] = useState(false);

  const [{ data, fetching: isLoadingWorkflows, error }] = useQuery<
    ExecutedWorkflowsQuery,
    ExecutedWorkflowsQueryVariables
  >({
    query: EXECUTED_WORKFLOW_QUERY,
    variables: {
      ...makeSearchQueryVariableFromFilter(makeFilterFromSearchParams(searchParams)),
      pagination: {
        size: makeFilterFromSearchParams(searchParams).workflowsPerPage,
        start: currentStartOfPage,
      },
    },
    context: ctx,
  });

  const [, onBulkPause] = useMutation<BulkPauseWorkflowMutation, BulkPauseWorkflowMutationVariables>(
    BULK_PAUSE_MUTATION,
  );
  const [, onBulkRetry] = useMutation<BulkRetryWorkflowMutation, BulkRetryWorkflowMutationVariables>(
    BULK_RETRY_MUTATION,
  );
  const [, onBulkResume] = useMutation<BulkResumeWorkflowMutation, BulkResumeWorkflowMutationVariables>(
    BULK_RESUME_MUTATION,
  );
  const [, onBulkRestart] = useMutation<BulkRestartWorkflowMutation, BulkRestartWorkflowMutationVariables>(
    BULK_RESTART_MUTATION,
  );
  const [, onBulkTerminate] = useMutation<BulkTerminateWorkflowMutation, BulkTerminateWorkflowMutationVariables>(
    BULK_TERMINATE_MUTATION,
  );

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

    if (data?.executedWorkflows == null || data?.executedWorkflows?.edges.length === 0) {
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

  const handleOnBulkOperation = async (action: 'pause' | 'resume' | 'retry' | 'terminate' | 'restart') => {
    let wasSuccessfull = false;

    if (selectedWorkflows == null || selectedWorkflows.length === 0) {
      addToastNotification({
        content: 'You need to selected atleast one workflow',
        type: 'error',
      });

      return;
    }

    setIsExecutingBulkOperation(true);

    switch (action) {
      case 'pause':
        wasSuccessfull = await onBulkPause({ input: { executedWorkflowIds: selectedWorkflows } }, ctx).then(
          (res) => res.error == null,
        );
        break;
      case 'restart':
        wasSuccessfull = await onBulkRestart({ input: { executedWorkflowIds: selectedWorkflows } }, ctx).then(
          (res) => res.error == null,
        );
        break;
      case 'resume':
        wasSuccessfull = await onBulkResume({ input: { executedWorkflowIds: selectedWorkflows } }, ctx).then(
          (res) => res.error == null,
        );
        break;
      case 'retry':
        wasSuccessfull = await onBulkRetry({ input: { executedWorkflowIds: selectedWorkflows } }, ctx).then(
          (res) => res.error == null,
        );
        break;
      case 'terminate':
        wasSuccessfull = await onBulkTerminate({ input: { executedWorkflowIds: selectedWorkflows } }, ctx).then(
          (res) => res.error == null,
        );
        break;
      default:
        break;
    }

    setIsExecutingBulkOperation(false);

    if (wasSuccessfull) {
      addToastNotification({
        content: 'Bulk operation executed successfully',
        type: 'success',
      });

      setSelectedWorkflows([]);
    } else {
      addToastNotification({
        content: 'We had a problem to execute the bulk operation. Try again please.',
        type: 'error',
      });
    }
  };

  const handleOnNext = () => {
    const { workflowsPerPage } = makeFilterFromSearchParams(searchParams);
    setCurrentStartOfPage(currentStartOfPage + workflowsPerPage);
  };

  const handleOnPrevious = () => {
    const { workflowsPerPage } = makeFilterFromSearchParams(searchParams);
    setCurrentStartOfPage(currentStartOfPage - workflowsPerPage);
  };

  return (
    <Container maxWidth={1200} mx="auto">
      <VStack spacing={10} alignItems="stretch">
        <ExecutedWorkflowSearchBox
          onSearchBoxSubmit={(searchInput) => {
            setCurrentStartOfPage(0);
            setSearchParams(makeURLSearchParamsFromObject(searchInput));
          }}
          onTableTypeChange={() => setIsFlat((prev) => !prev)}
          isFlat={isFlat}
          initialSearchValues={makeFilterFromSearchParams(searchParams)}
        />

        <ExecutedWorkflowBulkOperationsBlock
          isExecutingBulkOperation={isExecutingBulkOperation}
          amountOfVisibleWorkflows={data?.executedWorkflows?.edges.length ?? 0}
          amountOfSelectedWorkflows={selectedWorkflows.length}
          onPause={() => handleOnBulkOperation('pause')}
          onRetry={() => handleOnBulkOperation('retry')}
          onRestart={() => handleOnBulkOperation('restart')}
          onTerminate={() => handleOnBulkOperation('terminate')}
          onResume={() => handleOnBulkOperation('resume')}
        />

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
            onWorkflowStatusClick={(status) => {
              if (status === 'UNKNOWN') {
                toast({
                  description: 'UNKNOWN status is not supported for filtering of executed workflows.',
                  status: 'warning',
                  duration: 4000,
                  isClosable: true,
                });
              } else {
                setSearchParams(
                  makeURLSearchParamsFromObject({
                    ...makeFilterFromSearchParams(searchParams),
                    status: [...makeFilterFromSearchParams(searchParams).status, status],
                  }),
                );
              }
            }}
          />
        )}

        <Pagination
          hasNextPage={data?.executedWorkflows?.pageInfo.hasNextPage ?? false}
          hasPreviousPage={data?.executedWorkflows?.pageInfo.hasPreviousPage ?? false}
          onNext={handleOnNext}
          onPrevious={handleOnPrevious}
        />
      </VStack>
    </Container>
  );
};

export default ExecutedWorkflowList;
