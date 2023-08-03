import { Box, Container, Text, Progress, useDisclosure } from '@chakra-ui/react';
import { jsonParse, ClientWorkflow, Task, useNotifications, Pagination } from '@frinx/shared/src';
import { debounce } from 'lodash';
import React, { useMemo, useState } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import { usePagination } from '../../hooks/use-graphql-pagination';
import {
  DeleteWorkflowMutation,
  DeleteWorkflowMutationVariables,
  UpdateWorkflowMutation,
  UpdateWorkflowMutationVariables,
  WorkflowLabelsQuery,
  WorkflowsQuery,
} from '../../__generated__/graphql';
import WorkflowDefinitionsHeader from './workflow-definitions-header';
import WorkflowDefinitionsModals from './workflow-definitions-modals';
import WorkflowDefinitionsTable from './workflow-definitions-table';

type OrderBy = {
  sortKey: 'name';
  direction: 'ASC' | 'DESC';
};

type DescriptionJSON = { labels: string[]; description: string };
type WorkflowFilter = {
  keyword: string[] | null;
  labels: string[] | [];
};

const WORKFLOWS_QUERY = gql`
  query Workflows(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: FilterWorkflowsInput
    $orderBy: WorkflowsOrderByInput!
  ) {
    workflows(first: $first, after: $after, last: $last, before: $before, filter: $filter, orderBy: $orderBy) {
      edges {
        node {
          id
          name
          description
          version
          createdAt
          updatedAt
          createdBy
          updatedBy
          tasks
          hasSchedule
          inputParameters
          outputParameters {
            key
            value
          }
          restartable
          timeoutSeconds
          timeoutPolicy
        }
      }
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

const WORKFLOW_LABELS_QUERY = gql`
  query WorkflowLabels {
    workflowLabels
  }
`;

const WORKFLOW_DELETE_MUTATION = gql`
  mutation DeleteWorkflow($input: DeleteWorkflowInput!) {
    deleteWorkflow(input: $input) {
      workflow {
        id
      }
    }
  }
`;

const UPDATE_WORKFLOW_MUTATION = gql`
  mutation UpdateWorkflow($updateWorkflowId: String!, $input: UpdateWorkflowInput!) {
    updateWorkflow(id: $updateWorkflowId, input: $input) {
      workflow {
        id
      }
    }
  }
`;

const WorkflowDefinitions = () => {
  const context = useMemo(() => ({ additionalTypenames: ['DeleteWorkflow'] }), []);
  const [keywords, setKeywords] = useState('');
  // TODO: FD-493 this is redundant because we can use the labels from filter state
  const [filter, setFilter] = useState<WorkflowFilter>({
    keyword: null,
    labels: [],
  });
  const [orderBy, setOrderBy] = useState<OrderBy>({ sortKey: 'name', direction: 'ASC' });
  const [activeWf, setActiveWf] = useState<ClientWorkflow>();
  const { addToastNotification } = useNotifications();

  const definitionModal = useDisclosure();
  const diagramModal = useDisclosure();
  const dependencyModal = useDisclosure();
  const schedulingModal = useDisclosure();
  const inputParametersModal = useDisclosure();
  const confirmDeleteModal = useDisclosure();
  const [paginationArgs, { nextPage, previousPage }] = usePagination();

  const [{ data: workflowsData, fetching: isLoadingWorkflowDefinitions, error: workflowDefinitionsError }] =
    useQuery<WorkflowsQuery>({
      query: WORKFLOWS_QUERY,
      variables: {
        ...paginationArgs,
        filter,
        orderBy,
      },
      context,
    });

  const [{ data: labelsData }] = useQuery<WorkflowLabelsQuery>({
    query: WORKFLOW_LABELS_QUERY,
  });

  const [, deleteWorkflow] = useMutation<DeleteWorkflowMutation, DeleteWorkflowMutationVariables>(
    WORKFLOW_DELETE_MUTATION,
  );

  const [, updateWorkflow] = useMutation<UpdateWorkflowMutation, UpdateWorkflowMutationVariables>(
    UPDATE_WORKFLOW_MUTATION,
  );

  const debouncedKeywordFilter = useMemo(
    () =>
      debounce((value) => {
        setFilter((f) => ({ ...f, keyword: value }));
      }, 500),
    [],
  );

  const handleDeleteWorkflow = async (workflow: ClientWorkflow) => {
    const { name, version } = workflow;
    await deleteWorkflow({
      input: {
        name,
        version: version || 1,
      },
    });
  };

  const handleOnFavouriteClick = (workflow: ClientWorkflow) => {
    const wfDescription = jsonParse<DescriptionJSON>(workflow.description);
    const hasLabels = wfDescription != null && wfDescription?.labels != null && wfDescription.labels.length > 0;
    const isFavourite = wfDescription?.labels?.includes('favourite');

    updateWorkflow(
      {
        updateWorkflowId: workflow.id,
        input: {
          workflow: {
            name: workflow.name,
            tasks: JSON.stringify(workflow.tasks),
            timeoutSeconds: workflow.timeoutSeconds,
            description: JSON.stringify({
              description: workflow.description,
              ...(hasLabels && {
                labels: isFavourite
                  ? wfDescription.labels.filter((l) => l !== 'FAVOURITE')
                  : [...wfDescription.labels, 'FAVOURITE'],
              }),
              ...(!hasLabels && { labels: ['FAVOURITE'] }),
            }),
          },
        },
      },
      {
        additionalTypenames: ['Workflow', 'WorkflowConnection'],
      },
    )
      .then((r) => {
        if (r.error != null) {
          throw r.error;
        }
        addToastNotification({
          title: 'Success',
          content: 'Workflow added to favourites',
          type: 'success',
        });
      })
      .catch(() => {
        addToastNotification({
          title: 'Error',
          content: 'Workflow could not be added to favourites',
          type: 'error',
        });
      });
  };

  const onSort = () => {
    return orderBy.direction === 'DESC'
      ? setOrderBy({ ...orderBy, direction: 'ASC' })
      : setOrderBy({ ...orderBy, direction: 'DESC' });
  };

  if (isLoadingWorkflowDefinitions) {
    return (
      <Container maxWidth={1280}>
        <Progress size="xs" isIndeterminate />
      </Container>
    );
  }

  if (workflowDefinitionsError) {
    return <Text>We are sorry, but something went wrong when we were loading workflow definitions.</Text>;
  }

  const workflows: ClientWorkflow[] =
    workflowsData?.workflows.edges.map((e) => {
      const { node } = e;
      const parsedLabels = jsonParse<DescriptionJSON>(e.node.description)?.labels ?? [];
      const tasks = jsonParse<Task[]>(e.node.tasks) ?? [];
      return {
        ...node,
        labels: parsedLabels,
        tasks,
        hasSchedule: node.hasSchedule ?? false,
      };
    }) ?? [];

  return (
    <Container maxWidth={1280} mx="auto">
      <WorkflowDefinitionsModals
        confirmDeleteModal={confirmDeleteModal}
        definitionModal={definitionModal}
        diagramModal={diagramModal}
        dependencyModal={dependencyModal}
        executeWorkflowModal={inputParametersModal}
        scheduledWorkflowModal={schedulingModal}
        activeWorkflow={activeWf}
        onDeleteWorkflow={handleDeleteWorkflow}
        workflows={workflows}
      />
      <WorkflowDefinitionsHeader
        allLabels={labelsData?.workflowLabels ?? []}
        keywords={keywords}
        onKeywordsChange={(value) => {
          setKeywords(value);
          debouncedKeywordFilter(value);
        }}
        labels={filter.labels}
        onLabelsChange={(newLabels) => {
          const newLabelsArray = [...new Set(newLabels)];
          setFilter((f) => ({
            ...f,
            labels: newLabelsArray,
          }));
        }}
        onClearSearch={() => {
          setKeywords('');
          setFilter({
            keyword: null,
            labels: [],
          });
        }}
      />
      <WorkflowDefinitionsTable
        workflows={workflows}
        onSort={onSort}
        orderBy={orderBy}
        definitionModal={definitionModal}
        diagramModal={diagramModal}
        dependencyModal={dependencyModal}
        executeWorkflowModal={inputParametersModal}
        scheduleWorkflowModal={schedulingModal}
        confirmDeleteModal={confirmDeleteModal}
        setActiveWorkflow={setActiveWf}
        onFavoriteClick={handleOnFavouriteClick}
        onLabelClick={(label) => {
          setFilter({ ...filter, labels: [...new Set([...filter.labels, label])] });
        }}
        allLabels={labelsData?.workflowLabels ?? []}
      />
      {workflowsData && (
        <Box marginTop={4} paddingX={4}>
          <Pagination
            onPrevious={previousPage(workflowsData.workflows.pageInfo.startCursor)}
            onNext={nextPage(workflowsData.workflows.pageInfo.endCursor)}
            hasNextPage={workflowsData.workflows.pageInfo.hasNextPage}
            hasPreviousPage={workflowsData.workflows.pageInfo.hasPreviousPage}
          />
        </Box>
      )}
    </Container>
  );
};

export default WorkflowDefinitions;
