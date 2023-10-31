import { Container, Text, Progress, useDisclosure } from '@chakra-ui/react';
import { jsonParse, ClientWorkflow } from '@frinx/shared';
import { debounce } from 'lodash';
import React, { useMemo, useState } from 'react';
import { gql, useMutation, useQuery } from 'urql';
import { DeleteWorkflowMutation, DeleteWorkflowMutationVariables, WorkflowsQuery } from '../../__generated__/graphql';
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
  query Workflows($filter: FilterWorkflowsInput, $orderBy: WorkflowsOrderByInput) {
    conductor {
      workflowDefitions(filter: $filter, orderBy: $orderBy) {
        edges {
          node {
            id
            name
            description
            version
            createdAt
            updatedAt
            tasks {
              name
            }
            inputParameters
            outputParameters {
              key
              value
            }
          }
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
  mutation DeleteWorkflow($name: String!, $version: Int!) {
    conductor {
      unregisterWorkflowDef(name: $name, version: $version)
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
  const definitionModal = useDisclosure();
  const diagramModal = useDisclosure();
  const dependencyModal = useDisclosure();
  const schedulingModal = useDisclosure();
  const inputParametersModal = useDisclosure();
  const confirmDeleteModal = useDisclosure();
  const [{ data: workflowsData, fetching: isLoadingWorkflowDefinitions, error: workflowDefinitionsError }] =
    useQuery<WorkflowsQuery>({
      query: WORKFLOWS_QUERY,
      variables: {
        filter,
        orderBy,
      },
      context,
    });
  const [{ data: labelsData }] = useQuery({
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
    await deleteWorkflow(
      {
        name,
        version: Number(version) || 1,
      },
      {
        additionalTypenames: ['WorkflowDefinition', 'WorkflowDefinitionConnection'],
      },
    );
  };

  const handleSort = () => {
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
    workflowsData?.conductor.workflowDefitions.edges.map(({ node: w }) => {
      const parsedLabels = jsonParse<DescriptionJSON>(w.description)?.labels ?? [];
      return {
        ...w,
        labels: parsedLabels,
        tasks: w.tasks,
        hasSchedule: false,
      };
    }) ?? [];

  return (
    <Container maxWidth="container.xl" mx="auto">
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
        allLabels={labelsData?.workflowLabels ?? []}
      />
    </Container>
  );
};

export default WorkflowDefinitions;
