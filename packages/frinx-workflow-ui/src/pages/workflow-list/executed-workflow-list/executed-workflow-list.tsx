import { Container, Progress, Text, useToast, VStack } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared/src';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import { makeURLSearchParamsFromObject } from '../../../helpers/utils.helpers';
import {
  BulkPauseMutation,
  BulkPauseMutationVariables,
  BulkRestartMutation,
  BulkRestartMutationVariables,
  BulkResumeMutation,
  BulkResumeMutationVariables,
  BulkRetryMutation,
  BulkRetryMutationVariables,
  BulkTerminateMutation,
  BulkTerminateMutationVariables,
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
    }
  }
`;

const BULK_PAUSE_MUTATION = gql`
  mutation BulkPause($executedWorkflowIds: [String!]!) {
    bulkPauseWorkflow(executedWorkflowIds: $executedWorkflowIds) {
      bulkErrorResults
      bulkSuccessfulResults
    }
  }
`;

const BULK_RESUME_MUTATION = gql`
  mutation BulkResume($executedWorkflowIds: [String!]!) {
    bulkResumeWorkflow(executedWorkflowIds: $executedWorkflowIds) {
      bulkErrorResults
      bulkSuccessfulResults
    }
  }
`;

const BULK_RETRY_MUTATION = gql`
  mutation BulkRetry($executedWorkflowIds: [String!]!) {
    bulkRetryWorkflow(executedWorkflowIds: $executedWorkflowIds) {
      bulkErrorResults
      bulkSuccessfulResults
    }
  }
`;

const BULK_TERMINATE_MUTATION = gql`
  mutation BulkTerminate($executedWorkflowIds: [String!]!) {
    bulkTerminateWorkflow(executedWorkflowIds: $executedWorkflowIds) {
      bulkErrorResults
      bulkSuccessfulResults
    }
  }
`;

const BULK_RESTART_MUTATION = gql`
  mutation BulkRestart($executedWorkflowIds: [String!]!) {
    bulkRestartWorkflow(executedWorkflowIds: $executedWorkflowIds) {
      bulkErrorResults
      bulkSuccessfulResults
    }
  }
`;

const ExecutedWorkflowList = () => {
  const executedWorkflowsCtx = useMemo(() => ({ additionalTypenames: ['ExecutedWorkflows'] }), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToastNotification } = useNotifications();
  const toast = useToast();

  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [sort, setSort] = useState<SortProperty>({ key: 'startTime', value: 'DESC' });
  const [isFlat, setIsFlat] = useState(false);

  const [{ data, fetching: isLoadingWorkflows, error }] = useQuery<
    ExecutedWorkflowsQuery,
    ExecutedWorkflowsQueryVariables
  >({
    query: EXECUTED_WORKFLOW_QUERY,
    variables: makeSearchQueryVariableFromFilter(makeFilterFromSearchParams(searchParams)),
    context: executedWorkflowsCtx,
  });

  const [, onBulkPause] = useMutation<BulkPauseMutation, BulkPauseMutationVariables>(BULK_PAUSE_MUTATION);
  const [, onBulkRetry] = useMutation<BulkRetryMutation, BulkRetryMutationVariables>(BULK_RETRY_MUTATION);
  const [, onBulkResume] = useMutation<BulkResumeMutation, BulkResumeMutationVariables>(BULK_RESUME_MUTATION);
  const [, onBulkRestart] = useMutation<BulkRestartMutation, BulkRestartMutationVariables>(BULK_RESTART_MUTATION);
  const [, onBulkTerminate] = useMutation<BulkTerminateMutation, BulkTerminateMutationVariables>(
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

    switch (action) {
      case 'pause':
        wasSuccessfull = await onBulkPause(
          { executedWorkflowIds: selectedWorkflows },
          { additionalTypenames: ['ExecutedWorkflows'] },
        ).then((res) => res.error == null);
        break;
      case 'restart':
        wasSuccessfull = await onBulkRestart(
          { executedWorkflowIds: selectedWorkflows },
          { additionalTypenames: ['ExecutedWorkflows'] },
        ).then((res) => res.error == null);
        break;
      case 'resume':
        wasSuccessfull = await onBulkResume(
          { executedWorkflowIds: selectedWorkflows },
          { additionalTypenames: ['ExecutedWorkflows'] },
        ).then((res) => res.error == null);
        break;
      case 'retry':
        wasSuccessfull = await onBulkRetry(
          { executedWorkflowIds: selectedWorkflows },
          { additionalTypenames: ['ExecutedWorkflows'] },
        ).then((res) => res.error == null);
        break;
      case 'terminate':
        wasSuccessfull = await onBulkTerminate(
          { executedWorkflowIds: selectedWorkflows },
          { additionalTypenames: ['ExecutedWorkflows'] },
        ).then((res) => res.error == null);
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
          onSearchBoxSubmit={(searchInput) => setSearchParams(makeURLSearchParamsFromObject(searchInput))}
          onTableTypeChange={() => setIsFlat((prev) => !prev)}
          isFlat={isFlat}
          initialSearchValues={makeFilterFromSearchParams(searchParams)}
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
            onSubworkflowStatusClick={(status) => {
              if (status === 'UNKNOWN') {
                toast({
                  description: "UNKNOWN status is not supported for filtering of executed workflows.",
                  status: 'warning',
                  duration: 4000,
                  isClosable: true,
                })
              } else {
                setSearchParams(
                  makeURLSearchParamsFromObject({
                    ...makeFilterFromSearchParams(searchParams),
                    status: [...makeFilterFromSearchParams(searchParams).status, status]
                  }),
                );
              }
            }}
          />
        )}
      </VStack>
    </Container>
  );
};

export default ExecutedWorkflowList;
