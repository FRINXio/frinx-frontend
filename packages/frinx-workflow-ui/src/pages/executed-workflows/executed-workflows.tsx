import { Container, Flex, FormControl, FormLabel, Heading, Progress, Switch, Text } from '@chakra-ui/react';
import { useNotifications, Pagination, omitNullValue } from '@frinx/shared';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gql, useQuery } from 'urql';
import { makeURLSearchParamsFromObject } from '../../helpers/utils.helpers';
import { ExecutedWorkflowsQuery, ExecutedWorkflowsQueryVariables } from '../../__generated__/graphql';
import BulkActionsMenu from './bulk-actions-menu';
import ExecutedWorkflowsFilters from './executed-workflows-filters';
import ExecutedWorkflowsTable from './executed-workflows-table';
import {
  makeFilterFromSearchParams,
  makeSearchQueryVariableFromFilter,
  OrderBy,
  SortKey,
} from './executed-workflows.helpers';

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
            hasSubworkflows
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

const ExecutedWorkflows = () => {
  const ctx = useMemo(
    () => ({ additionalTypenames: ['ExecutedWorkflows', 'ExecutedWorkflowConnection', 'ExecutedWorkflowEdge'] }),
    [],
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToastNotification } = useNotifications();
  const [currentStartOfPage, setCurrentStartOfPage] = useState(0);
  const [orderBy, setOrderBy] = useState<OrderBy>({ sortKey: 'startTime', direction: 'desc' });
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
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

  const executedWorkflows =
    data?.conductor.executedWorkflows?.edges
      .map((e) => {
        if (e.node.__typename) {
          return e.node;
        }
        return null;
      })
      .filter(omitNullValue) ?? [];

  return (
    <Container maxWidth={1200} mx="auto">
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h1" size="xl">
          Executed workflows
        </Heading>
      </Flex>
      <ExecutedWorkflowsFilters
        onSearchBoxSubmit={(searchInput) => {
          setCurrentStartOfPage(0);
          setSearchParams(makeURLSearchParamsFromObject(searchInput));
        }}
        initialSearchValues={makeFilterFromSearchParams(searchParams)}
      />
      <Flex marginBottom={6} justifyContent="space-between" alignItems="center">
        <BulkActionsMenu
          selectedWorkflowIds={selectedWorkflows}
          onBulkActionError={handleOnBulkError}
          onBulkActionSuccess={handleOnBulkSuccess}
        />
        <FormControl maxWidth="max-content" display="flex" alignItems="center" alignSelf="flex-end">
          <FormLabel htmlFor="isRootWorkflows" mb="0">
            Only root workflows
          </FormLabel>
          <Switch
            id="isRootWorkflows"
            defaultValue={`${makeFilterFromSearchParams(searchParams).isRootWorkflow}`}
            isChecked={makeFilterFromSearchParams(searchParams).isRootWorkflow}
            onChange={(event) => {
              setSearchParams(() => {
                searchParams.set('isRootWorkflow', String(event.target.checked));
                return searchParams;
              });
            }}
            name="isRootWorkflow"
          />
        </FormControl>
      </Flex>
      {error != null && <Text textColor="red">{JSON.stringify(error)}</Text>}
      {isLoadingWorkflows && <Progress isIndeterminate size="sm" />}
      {data != null && data.conductor.executedWorkflows != null && !isLoadingWorkflows && (
        <ExecutedWorkflowsTable
          workflows={executedWorkflows}
          selectedWorkflows={selectedWorkflows}
          orderBy={orderBy}
          onSort={handleOnSort}
          onWorkflowSelect={handleOnWorkflowSelect}
          onSelectAllWorkflows={handleOnAllWorkflowsSelect}
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

export default ExecutedWorkflows;
