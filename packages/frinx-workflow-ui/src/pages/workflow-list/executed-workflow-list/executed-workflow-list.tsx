import { Container, Progress, Text, useToast, VStack } from '@chakra-ui/react';
import Pagination from '@frinx/inventory-client/src/components/pagination';
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
      pageInfo {
        hasNextPage
        hasPreviousPage
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
  const [currentStartOfPage, setCurrentStartOfPage] = useState(0);

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

  const handleOnBulkPause = () => {
    onBulkPause({ executedWorkflowIds: selectedWorkflows })
      .then((res) => {
        if (res.error != null) {
          throw new Error(res.error.message);
        }

        addToastNotification({
          title: 'Bulk Pause',
          content: 'Successfully paused selected workflows',
          type: 'success',
        });
      })
      .catch(() => {
        addToastNotification({
          title: 'Bulk Pause',
          content: 'Failed to pause selected workflows',
          type: 'error',
        });
      });
  };

  const handleOnBulkResume = () => {
    onBulkResume({ executedWorkflowIds: selectedWorkflows })
      .then((res) => {
        if (res.error != null) {
          throw new Error(res.error.message);
        }

        addToastNotification({
          title: 'Bulk Resume',
          content: 'Successfully resumed selected workflows',
          type: 'success',
        });
      })
      .catch(() => {
        addToastNotification({
          title: 'Bulk Resume',
          content: 'Failed to resume selected workflows',
          type: 'error',
        });
      });
  };

  const handleOnBulkRetry = () => {
    onBulkRetry({ executedWorkflowIds: selectedWorkflows })
      .then((res) => {
        if (res.error != null) {
          throw new Error(res.error.message);
        }

        addToastNotification({
          title: 'Bulk Retry',
          content: 'Successfully retried selected workflows',
          type: 'success',
        });
      })
      .catch(() => {
        addToastNotification({
          title: 'Bulk Retry',
          content: 'Failed to retry selected workflows',
          type: 'error',
        });
      });
  };

  const handleOnBulkRestart = () => {
    onBulkRestart({ executedWorkflowIds: selectedWorkflows })
      .then((res) => {
        if (res.error != null) {
          throw new Error(res.error.message);
        }

        addToastNotification({
          title: 'Bulk Restart',
          content: 'Successfully restarted selected workflows',
          type: 'success',
        });
      })
      .catch(() => {
        addToastNotification({
          title: 'Bulk Restart',
          content: 'Failed to restart selected workflows',
          type: 'error',
        });
      });
  };

  const handleOnBulkTerminate = () => {
    onBulkTerminate({ executedWorkflowIds: selectedWorkflows })
      .then((res) => {
        if (res.error != null) {
          throw new Error(res.error.message);
        }

        addToastNotification({
          title: 'Bulk Terminate',
          content: 'Successfully terminated selected workflows',
          type: 'success',
        });
      })
      .catch(() => {
        addToastNotification({
          title: 'Bulk Terminate',
          content: 'Failed to terminate selected workflows',
          type: 'error',
        });
      });
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
          amountOfVisibleWorkflows={data?.executedWorkflows?.edges.length ?? 0}
          amountOfSelectedWorkflows={selectedWorkflows.length}
          onPause={handleOnBulkPause}
          onRetry={handleOnBulkRetry}
          onRestart={handleOnBulkRestart}
          onTerminate={handleOnBulkTerminate}
          onResume={handleOnBulkResume}
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
