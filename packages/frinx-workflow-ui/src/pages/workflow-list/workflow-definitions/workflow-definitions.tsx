import React, { useEffect, useState } from 'react';
import { Container, useDisclosure } from '@chakra-ui/react';
import callbackUtils from '@frinx/workflow-ui/src/utils/callback-utils';
import { usePagination } from '@frinx/workflow-ui/src/common/pagination-hook';
import { Workflow } from '@frinx/workflow-ui/src/helpers/types';
import { jsonParse } from '@frinx/workflow-ui/src/utils/helpers.utils';
import WorkflowDefinitionsHeader from './workflow-definitions-header';
import WorkflowDefinitionsModals from './workflow-definitions-modals';
import WorkflowDefinitionsTable from './workflow-definitions-table';

const getLabels = (dataset: Workflow[]) => {
  const labelsArr: string[] = dataset.flatMap(({ description }) => {
    return jsonParse(description)?.labels;
  });
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

  const { currentPage, setCurrentPage, setItemList, totalPages, pageItems } = usePagination<Workflow>();

  const definitionModal = useDisclosure();
  const diagramModal = useDisclosure();
  const dependencyModal = useDisclosure();
  const schedulingModal = useDisclosure();
  const inputParametersModal = useDisclosure();
  const confirmDeleteModal = useDisclosure();

  useEffect(() => {
    const { getWorkflows } = callbackUtils.getCallbacks;

    getWorkflows().then((wfs) => {
      setWorkflows(wfs);
      setAllLabels(getLabels(wfs));
    });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [keywords, labels]);

  useEffect(() => {
    const results =
      !keywords && labels.length === 0
        ? workflows
        : workflows.filter((e) => {
            const queryWords = keywords.toUpperCase();
            const wfName = e.name.toUpperCase();
            const labelsArr = jsonParse(e.description)?.labels;

            // if labels are used and wf does not contain selected labels => filter out
            if (labels.length > 0) {
              return labelsArr?.some((label: string) => labels.includes(label));
            }

            // search for keywords in "searchedKeys"
            if (wfName.includes(queryWords)) {
              return true;
            }

            return false;
          });
    setItemList(results);
  }, [workflows, labels, keywords, setItemList]);

  const updateFavourite = (workflow: Workflow) => {
    let wfDescription = jsonParse(workflow.description);

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
        setItemList(dataset);
        setAllLabels(getLabels(dataset));
      });
    });
  };

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
        workflows={pageItems}
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
        workflows={pageItems}
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
        paginationProps={{
          currentPage,
          setCurrentPage,
          totalPages,
        }}
      />
    </Container>
  );
};

export default WorkflowDefinitions;
