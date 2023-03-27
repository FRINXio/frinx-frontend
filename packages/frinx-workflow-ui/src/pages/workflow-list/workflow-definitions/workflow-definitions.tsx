import React, { useEffect, useState } from 'react';
import { Container, useDisclosure, Box } from '@chakra-ui/react';
import { callbackUtils, jsonParse, omitNullValue, Workflow } from '@frinx/shared/src';
import { gql, useQuery } from 'urql';
import WorkflowDefinitionsHeader from './workflow-definitions-header';
import WorkflowDefinitionsModals from './workflow-definitions-modals';
import WorkflowDefinitionsTable from './workflow-definitions-table';
import Pagination from '../../../../../frinx-inventory-client/src/components/pagination';
import { usePagination as graphlUsePagination } from '../../../hooks/use-graphql-pagination';
import { WorkflowsQuery } from '../../../../../frinx-inventory-client/src/__generated__/graphql';

type DescriptionJSON = { labels: string[]; description: string };



const WORKFLOWS_QUERY = gql`
  query Workflows($first: Int, $after: String, $last: Int, $before: String) {
    workflows(first: $first, after: $after, last: $last, before: $before) {
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

const getLabels = (dataset: WorkflowsQuery | undefined) => {
  const labelsArr = dataset?.workflows.edges
    .flatMap(({ node }) => {
      return jsonParse<DescriptionJSON>(node.description)?.labels;
    })
    .filter(omitNullValue);
  const allLabels = [...new Set(labelsArr)];

  return allLabels
    .filter((e) => {
      return e !== undefined;
    })
    .sort((a, b) => {
      return a.localeCompare(b);
    });
};

const WorkflowDefinitions = () => {
  const [keywords, setKeywords] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [activeWf, setActiveWf] = useState<Workflow>();
  const [allLabels, setAllLabels] = useState<string[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  const definitionModal = useDisclosure();
  const diagramModal = useDisclosure();
  const dependencyModal = useDisclosure();
  const schedulingModal = useDisclosure();
  const inputParametersModal = useDisclosure();
  const confirmDeleteModal = useDisclosure();
  const [paginationArgs, { nextPage, previousPage, firstPage }] = graphlUsePagination();

  const [{ data: workflowsData, fetching: isFetchingWorkflows }] = useQuery<WorkflowsQuery>({
    query: WORKFLOWS_QUERY,
    variables: {
      ...paginationArgs,
    },
  });

  const wfs = workflowsData?.workflows.edges.map(( {node} ) => {
    return node;
  });

  useEffect(() => {
    setWorkflows(wfs);
    setAllLabels(getLabels(workflowsData));
  }, [workflowsData]);

  console.log(workflowsData,wfs);
  

  useEffect(() => {
    const results =
      !keywords && labels.length === 0
        ? workflows
        : workflows.filter((e) => {
            const queryWords = keywords.toUpperCase();
            const wfName = e.name.toUpperCase();
            const labelsArr = jsonParse<DescriptionJSON>(e.description)?.labels;

            // if labels are used and wf does not contain selected labels => filter out
            if (labels.length) {
              return labels?.every((label: string) => labelsArr?.includes(label));
            }

            // search for keywords in "searchedKeys"
            if (wfName.includes(queryWords)) {
              return true;
            }

            return false;
          });
    setWorkflows(results);
  }, [workflows, labels, keywords]);

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

    const { putWorkflow, getWorkflows } = callbackUtils.getCallbacks;

    putWorkflow([
      {
        ...workflow,
        description: JSON.stringify(wfDescription),
      },
    ]).then(() => {
      getWorkflows().then((wfs) => {
        const dataset =
          wfs.sort((a, b) => {
            return a.name.localeCompare(b.name);
          }) || [];
        setWorkflows(dataset);
        setAllLabels(getLabels(dataset));
      });
    });
  };

  if (isFetchingWorkflows && workflowsData == null) {
    return null;
  }

  return (
    <Container maxWidth={1200} mx="auto">
      <WorkflowDefinitionsModals
        confirmDeleteModal={confirmDeleteModal}
        definitionModal={definitionModal}
        diagramModal={diagramModal}
        dependencyModal={dependencyModal}
        executeWorkflowModal={inputParametersModal}
        scheduledWorkflowModal={schedulingModal}
        activeWorkflow={activeWf}
        getData={() => {
          const { getWorkflows } = callbackUtils.getCallbacks;

          getWorkflows().then((wfs) => {
            setWorkflows(wfs);
            setAllLabels(getLabels(wfs));
          });
        }}
        workflows={workflows}
      />
      <WorkflowDefinitionsHeader
        allLabels={allLabels}
        keywords={[keywords]}
        onKeywordsChange={setKeywords}
        labels={labels}
        onLabelsChange={(newLabels) => {
          setLabels([...new Set(newLabels)]);
        }}
        onClearSearch={() => {
          setKeywords('');
          setLabels([]);
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
          setLabels((prevLabels) => [...new Set([...prevLabels, label])]);
        }}
        allLabels={allLabels}
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
