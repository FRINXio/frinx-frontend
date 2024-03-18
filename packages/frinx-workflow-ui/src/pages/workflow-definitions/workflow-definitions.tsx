import { Container, Text, Progress, useDisclosure } from '@chakra-ui/react';
import { jsonParse, ClientWorkflow, ClientWorkflowWithTasks, Task, Pagination, usePagination } from '@frinx/shared';
import { debounce } from 'lodash';
import React, { FC, useMemo, useState } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import WorkflowListHeader from '../../components/workflow-list-header';
import {
  DeleteWorkflowDefinitionMutation,
  DeleteWorkflowDefinitionMutationVariables,
  WorkflowsQuery,
  WorkflowsQueryVariables,
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
  keyword: string | null;
  labels: string[] | [];
};

const WORKFLOWS_QUERY = gql`
  query Workflows(
    $filter: WorkflowsFilterInput
    $orderBy: WorkflowsOrderByInput
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    conductor {
      workflowDefinitions(
        filter: $filter
        orderBy: $orderBy
        first: $first
        after: $after
        last: $last
        before: $before
      ) {
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
            inputParameters
            outputParameters {
              key
              value
            }
            timeoutSeconds
            restartable
            variables
            timeoutPolicy
            ownerEmail
            tasksJson
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
  }
`;

const WORKFLOW_LABELS_QUERY = gql`
  query WorkflowLabels {
    conductor {
      workflowLabels
    }
  }
`;

const WORKFLOW_DELETE_MUTATION = gql`
  mutation DeleteWorkflowDefinition($input: DeleteWorkflowDefinitionInput!) {
    conductor {
      deleteWorkflowDefinition(input: $input) {
        workflowDefinition {
          id
        }
      }
    }
  }
`;

type Props = {
  onImportSuccess: () => void;
};

const WorkflowDefinitions: FC<Props> = ({ onImportSuccess }) => {
  const context = useMemo(() => ({ additionalTypenames: ['DeleteWorkflow'] }), []);
  const [keywords, setKeywords] = useState('');
  // TODO: FD-493 this is redundant because we can use the labels from filter state
  const [filter, setFilter] = useState<WorkflowFilter>({
    keyword: null,
    labels: [],
  });
  const [orderBy, setOrderBy] = useState<OrderBy>({ sortKey: 'name', direction: 'ASC' });
  const [activeWf, setActiveWf] = useState<ClientWorkflowWithTasks>();
  const definitionModal = useDisclosure();
  const diagramModal = useDisclosure();
  const dependencyModal = useDisclosure();
  const schedulingModal = useDisclosure();
  const inputParametersModal = useDisclosure();
  const confirmDeleteModal = useDisclosure();
  const [paginationArgs, { nextPage, previousPage }] = usePagination();
  const [{ data: workflowsData, fetching: isLoadingWorkflowDefinitions, error: workflowDefinitionsError }] = useQuery<
    WorkflowsQuery,
    WorkflowsQueryVariables
  >({
    query: WORKFLOWS_QUERY,
    variables: {
      filter,
      orderBy,
      ...paginationArgs,
    },
    context,
  });
  const [{ data: labelsData }] = useQuery({
    query: WORKFLOW_LABELS_QUERY,
  });
  const [, deleteWorkflow] = useMutation<DeleteWorkflowDefinitionMutation, DeleteWorkflowDefinitionMutationVariables>(
    WORKFLOW_DELETE_MUTATION,
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
    await deleteWorkflow(
      {
        input: {
          name,
          version: Number(version) || 1,
        },
      },
      {
        additionalTypenames: ['WorkflowDefinition', 'WorkflowDefinitionConnection'],
      },
    );
  };

  const handleSort = () => {
    setOrderBy((prev) => ({
      ...prev,
      direction: prev.direction === 'DESC' ? 'ASC' : 'DESC',
    }));
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

  const workflows: ClientWorkflowWithTasks[] =
    workflowsData?.conductor.workflowDefinitions.edges.map(({ node: w }) => {
      const parsedLabels = jsonParse<DescriptionJSON>(w.description)?.labels ?? [];
      const tasks = jsonParse<Task[]>(w.tasksJson) ?? [];
      return {
        ...w,
        timeoutSeconds: w.timeoutSeconds ?? 0,
        labels: parsedLabels,
        hasSchedule: false,
        tasks,
      };
    }) ?? [];

  return (
    <Container maxWidth="container.xl" mx="auto">
      <WorkflowListHeader onImportSuccess={onImportSuccess} />
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
        allLabels={labelsData?.conductor.workflowLabels ?? []}
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
        onSort={handleSort}
        orderBy={orderBy}
        definitionModal={definitionModal}
        diagramModal={diagramModal}
        dependencyModal={dependencyModal}
        executeWorkflowModal={inputParametersModal}
        scheduleWorkflowModal={schedulingModal}
        confirmDeleteModal={confirmDeleteModal}
        setActiveWorkflow={setActiveWf}
        onLabelClick={(label) => {
          setFilter({ ...filter, labels: [...new Set([...filter.labels, label])] });
        }}
      />
      {workflowsData && (
        <Pagination
          onPrevious={previousPage(workflowsData.conductor.workflowDefinitions.pageInfo.startCursor)}
          onNext={nextPage(workflowsData.conductor.workflowDefinitions.pageInfo.endCursor)}
          hasNextPage={workflowsData.conductor.workflowDefinitions.pageInfo.hasNextPage}
          hasPreviousPage={workflowsData.conductor.workflowDefinitions.pageInfo.hasPreviousPage}
        />
      )}
    </Container>
  );
};

export default WorkflowDefinitions;
