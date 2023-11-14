import { Box, Container, Flex, Heading, Progress, Text, useToast } from '@chakra-ui/react';
import { useNotifications, Pagination, omitNullValue } from '@frinx/shared';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gql, useQuery } from 'urql';
import { makeURLSearchParamsFromObject } from '../../helpers/utils.helpers';
import {
  ExecutedWorkflowsQuery,
  ExecutedWorkflowsQueryVariables,
  SortExecutedWorkflowsBy,
  SortExecutedWorkflowsDirection,
} from '../../__generated__/graphql';
import BulkActionsMenu from './bulk-actions-menu';
import ExecutedWorkflowFilters from './executed-workflow-filters';
import ExecutedWorkflowsTable from './executed-workflow-table/executed-workflow-table';
import { makeFilterFromSearchParams, makeSearchQueryVariableFromFilter } from './executed-workflow.helpers';

export type SortProperty = { key: keyof ExecutedWorkflow; value: 'ASC' | 'DESC' };

export type SortKey = SortExecutedWorkflowsBy;

export type OrderBy = {
  sortKey: SortKey;
  direction: SortExecutedWorkflowsDirection;
};

const EXECUTED_WORKFLOW_QUERY = gql`
  query ExecutedWorkflows(
    $orderBy: ExecutedWorkflowsOrderByInput!
    $searchQuery: ExecutedWorkflowSearchInput
    $pagination: PaginationArgs
  ) {
    conductor {
      executedWorkflows(orderBy: $orderBy, searchQuery: $searchQuery, pagination: $pagination) {
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
            originalId
            workflowDefinition {
              name
              version
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
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
  const [orderBy, setOrderBy] = useState<OrderBy>({ sortKey: 'startTime', direction: 'desc' });
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
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
      orderBy,
    },
    requestPolicy: 'cache-and-network',
    context: ctx,
  });

  const handleOnWorkflowSelect = (workflowId: string | null) => {
    if (workflowId == null) {
      return;
    }
    const isAlreadySelected = selectedWorkflows.includes(workflowId);

    if (isAlreadySelected) {
      setSelectedWorkflows(selectedWorkflows.filter((selectedWorkflowName) => selectedWorkflowName !== workflowId));
    } else {
      setSelectedWorkflows([...selectedWorkflows, workflowId]);
    }
  };

  const handleOnAllWorkflowsSelect = () => {
    const areAllWorkflowsSelected = data?.conductor.executedWorkflows?.edges.length === selectedWorkflows.length;

    if (data?.conductor.executedWorkflows == null || data?.conductor.executedWorkflows?.edges.length === 0) {
      setSelectedWorkflows([]);

      return;
    }

    if (areAllWorkflowsSelected) {
      setSelectedWorkflows([]);
    } else {
      setSelectedWorkflows(
        data.conductor.executedWorkflows.edges.map(({ node }) => node.originalId).filter(omitNullValue),
      );
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

  const handleOnSort = (sortKey: SortKey) => {
    setOrderBy((prev) => ({
      sortKey,
      direction: prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleOnBulkSuccess = (message = 'Bulk operation executed successfully') => {
    addToastNotification({
      content: message,
      type: 'success',
    });
  };

  const handleOnBulkError = (message = 'Bulk operation was unsuccessful') => {
    addToastNotification({
      content: message,
      type: 'error',
    });
  };

  return (
    <Container maxWidth={1200} mx="auto">
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h1" size="xl">
          Executed workflows
        </Heading>
      </Flex>
      <ExecutedWorkflowFilters
        onSearchBoxSubmit={(searchInput) => {
          setCurrentStartOfPage(0);
          setSearchParams(makeURLSearchParamsFromObject(searchInput));
        }}
        onTableTypeChange={() => setIsFlat((prev) => !prev)}
        isFlat={isFlat}
        initialSearchValues={makeFilterFromSearchParams(searchParams)}
      />
      <Box marginBottom={6}>
        <BulkActionsMenu
          selectedWorkflowNames={selectedWorkflows}
          onBulkActionError={handleOnBulkError}
          onBulkActionSuccess={handleOnBulkSuccess}
        />
      </Box>
      {error != null && <Text textColor="red">{JSON.stringify(error)}</Text>}
      {isLoadingWorkflows && <Progress isIndeterminate size="sm" />}
      {data != null && data.conductor.executedWorkflows != null && !isLoadingWorkflows && (
        <ExecutedWorkflowsTable
          onSelectAllWorkflows={handleOnAllWorkflowsSelect}
          handleOnSort={handleOnSort}
          workflows={data}
          sort={orderBy}
          onWorkflowSelect={handleOnWorkflowSelect}
          selectedWorkflows={selectedWorkflows}
          isFlat={isFlat}
          onWorkflowStatusClick={(status) => {
            if (status === 'UNKNOWN') {
              return toast({
                description: 'UNKNOWN status is not supported for filtering of executed workflows.',
                status: 'warning',
                duration: 4000,
                isClosable: true,
              });
            }
            return setSearchParams(
              makeURLSearchParamsFromObject({
                ...makeFilterFromSearchParams(searchParams),
                status: [...makeFilterFromSearchParams(searchParams).status, status],
              }),
            );
          }}
        />
      )}
      <Pagination
        hasNextPage={data?.conductor.executedWorkflows?.pageInfo.hasNextPage ?? false}
        hasPreviousPage={data?.conductor.executedWorkflows?.pageInfo.hasPreviousPage ?? false}
        onNext={handleOnNext}
        onPrevious={handleOnPrevious}
      />
    </Container>
  );
};

export default ExecutedWorkflowList;
