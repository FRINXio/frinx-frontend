import React, { useMemo, useState } from 'react';
import { Container, useDisclosure, Box } from '@chakra-ui/react';
import { jsonParse } from '@frinx/shared/src';
import { gql, useMutation, useQuery } from 'urql';
import { debounce } from 'lodash';
import { Task } from '@frinx/shared';
import Pagination from '@frinx/inventory-client/src/components/pagination'; // TODO: can we move this to shared components?
import WorkflowDefinitionsHeader from './workflow-definitions-header';
import WorkflowDefinitionsModals from './workflow-definitions-modals';
import WorkflowDefinitionsTable from './workflow-definitions-table';
import { usePagination as graphlUsePagination } from '../../../hooks/use-graphql-pagination';
import {
  DeleteWorkflowMutation,
  DeleteWorkflowMutationVariables,
  WorkflowLabelsQuery,
  WorkflowsQuery,
} from '../../../__generated__/graphql';
import { Workflow } from './workflow-types';

type DescriptionJSON = { labels: string[]; description: string };
type WorkflowFilter = {
  keyword: string[] | null;
  labels: string[] | null;
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
  const [labels, setLabels] = useState<string[]>([]);
  const [filter, setFilter] = useState<WorkflowFilter>({
    keyword: null,
    labels: null,
  });
  const [activeWf, setActiveWf] = useState<Workflow>();

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

  const handleDeleteWorkflow = async (workflow: Workflow) => {
    const { name, version } = workflow;
    await deleteWorkflow({
      name,
      version: version || 1,
    });
  };

  const updateFavourite = (workflow: Workflow) => {
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

  const workflows =
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
        getData={() => {
          // TODO: FD-493 we can remove the getData function
          // https://github.com/FRINXio/frinx-frontend/blob/main/packages/frinx-resource-manager/src/pages/resource-types-page/resource-types-page.tsx#L53
          // use context in the useQuery hook provided link can be used as inspiration
        }}
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
        labels={labels}
        onLabelsChange={(newLabels) => {
          const newLabelsArray = [...new Set(newLabels)];
          setLabels(newLabelsArray);
          setFilter((f) => ({
            ...f,
            labels: newLabelsArray,
          }));
        }}
        onClearSearch={() => {
          setKeywords('');
          setLabels([]);
          setFilter({
            keyword: null,
            labels: null,
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
          // TODO: FD-492 we ae handling only the labels state that is redundant and we are not updating the filter labels.
          // That causes when user clicks on label in table nothing will happen... you need to use setFilter function
          setLabels((prevLabels) => [...new Set([...prevLabels, label])]);
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
