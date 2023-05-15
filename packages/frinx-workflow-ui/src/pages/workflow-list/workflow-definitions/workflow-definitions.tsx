import { Box, Container, useDisclosure } from '@chakra-ui/react';
import Pagination from '@frinx/inventory-client/src/components/pagination'; // TODO: can we move this to shared components?
import { jsonParse, ClientWorkflow, Task } from '@frinx/shared/src';
import { debounce } from 'lodash';
import React, { useMemo, useState } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import { usePagination as graphlUsePagination } from '../../../hooks/use-graphql-pagination';
import {
  DeleteWorkflowMutation,
  DeleteWorkflowMutationVariables,
  WorkflowLabelsQuery,
  WorkflowsQuery,
} from '../../../__generated__/graphql';
import WorkflowDefinitionsHeader from './workflow-definitions-header';
import WorkflowDefinitionsModals from './workflow-definitions-modals';
import WorkflowDefinitionsTable from './workflow-definitions-table';

type DescriptionJSON = { labels: string[]; description: string };
type WorkflowFilter = {
  keyword: string[] | null;
  labels: string[] | [];
};

const WORKFLOWS_QUERY = gql`
  query Workflows($first: Int, $after: String, $last: Int, $before: String, $filter: FilterWorkflowsInput) {
    workflows(first: $first, after: $after, last: $last, before: $before, filter: $filter) {
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
  mutation DeleteWorkflow($name: String!, $version: Int!) {
    deleteWorkflow(name: $name, version: $version) {
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
  const [activeWf, setActiveWf] = useState<ClientWorkflow>();

  const definitionModal = useDisclosure();
  const diagramModal = useDisclosure();
  const dependencyModal = useDisclosure();
  const schedulingModal = useDisclosure();
  const inputParametersModal = useDisclosure();
  const confirmDeleteModal = useDisclosure();
  const [paginationArgs, { nextPage, previousPage }] = graphlUsePagination();

  const [{ data: workflowsData }] = useQuery<WorkflowsQuery>({
    query: WORKFLOWS_QUERY,
    variables: {
      ...paginationArgs,
      filter,
    },
    context,
  });

  const [{ data: labelsData }] = useQuery<WorkflowLabelsQuery>({
    query: WORKFLOW_LABELS_QUERY,
  });

  const [, deleteWorkflow] = useMutation<DeleteWorkflowMutation, DeleteWorkflowMutationVariables>(
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
    await deleteWorkflow({
      name,
      version: version || 1,
    });
  };

  const updateFavourite = (workflow: ClientWorkflow) => {
    let wfDescription = jsonParse<DescriptionJSON>(workflow.description);

    // if workflow doesn't contain description attr. at all
    if (!wfDescription) {
      wfDescription = {
        description: '',
        labels: ['FAVOURITE'],
      };
    }
    // if workflow has only description but no labels array
    else if (wfDescription && !wfDescription.labels) {
      wfDescription = {
        ...wfDescription,
        labels: ['FAVOURITE'],
      };
    }
    // if workflow is already favourited (unfav.)
    else if (wfDescription.labels.includes('FAVOURITE')) {
      wfDescription.labels = wfDescription?.labels.filter((e: string) => e !== 'FAVOURITE');
    }
    // if workflow has correct description object, just add label
    else {
      wfDescription.labels.push('FAVOURITE');
    }
  };

  if (workflowsData == null || labelsData == null) {
    return null;
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
        allLabels={labelsData.workflowLabels}
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
        definitionModal={definitionModal}
        diagramModal={diagramModal}
        dependencyModal={dependencyModal}
        executeWorkflowModal={inputParametersModal}
        scheduleWorkflowModal={schedulingModal}
        confirmDeleteModal={confirmDeleteModal}
        setActiveWorkflow={setActiveWf}
        onFavoriteClick={updateFavourite}
        onLabelClick={(label) => {
          setFilter({ ...filter, labels: [...new Set([...filter.labels, label])] });
        }}
        allLabels={labelsData.workflowLabels}
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
