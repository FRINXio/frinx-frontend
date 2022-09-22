import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import _ from 'lodash';
import WorkflowLabels from '@frinx/workflow-ui/src/common/workflow-labels';
import callbackUtils from '@frinx/workflow-ui/src/utils/callback-utils';
import { usePagination } from '@frinx/workflow-ui/src/common/pagination-hook';
import Paginator from '@frinx/workflow-ui/src/common/pagination';
import { Workflow } from '@frinx/workflow-ui/src/helpers/types';
import { jsonParse } from '@frinx/workflow-ui/src/utils/helpers.utils';
import WorkflowDefinitionsModals from '@frinx/workflow-ui/src/common/modals';
import WorkflowDefinitionsHeader from './workflow-definitions-header';
import WorkflowActions from './workflow-actions';

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

const Labels = ({ wf, labels, onClick }: { wf: Workflow; labels: string[]; onClick: (label: string) => void }) => {
  const { description } = wf;
  const labelsDef = jsonParse(description)?.labels || [];

  return labelsDef.map((label: string) => {
    const index = labels.findIndex((lab) => lab === label);

    return (
      <WorkflowLabels
        key={label}
        label={label}
        index={index}
        onClick={() => {
          onClick(label);
        }}
      />
    );
  });
};

const WorkflowDefinitions = () => {
  const [keywords, setKeywords] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<Workflow[]>([]);
  const [activeWf, setActiveWf] = useState<Workflow>();
  const [allLabels, setAllLabels] = useState<string[]>([]);

  const {
    currentPage,
    setCurrentPage,
    pageItems: workflows,
    setItemList,
    totalPages,
  } = usePagination<Workflow>([], 10);

  const definitionModal = useDisclosure();
  const diagramModal = useDisclosure();
  const dependencyModal = useDisclosure();
  const schedulingModal = useDisclosure();
  const inputParametersModal = useDisclosure();
  const confirmDeleteModal = useDisclosure();

  const getData = () => {
    const { getWorkflows } = callbackUtils.getCallbacks;

    getWorkflows().then((wfs) => {
      if (wfs != null) {
        const dataset =
          wfs.sort((a, b) => {
            return a.name.localeCompare(b.name);
          }) || [];
        setData(dataset);
        setAllLabels(getLabels(dataset));
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const results =
      !keywords && labels.length === 0
        ? data
        : data.filter((e) => {
            const queryWords = keywords.toUpperCase();
            const wfName = e.name.toUpperCase();
            const labelsArr = jsonParse(e.description)?.labels;

            // if labels are used and wf doesnt contain selected labels => filter out
            if (labels.length > 0) {
              if (_.difference(labels, labelsArr).length !== 0) {
                return false;
              }
            }

            // search for keywords in "searchedKeys"
            if (wfName.includes(queryWords)) {
              return true;
            }

            return false;
          });

    setItemList(results);
  }, [keywords, labels, data, setItemList]);

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
        setData(dataset);
        setAllLabels(getLabels(dataset));
      });
    });
  };

  const getDependencies = (workflow: Workflow) => {
    const usedInWfs = data.filter((wf) => {
      const wfJSON = JSON.stringify(wf, null, 2);
      return wfJSON.includes(`"name": "${workflow.name}"`) && wf.name !== workflow.name;
    });
    return { length: usedInWfs.length, usedInWfs };
  };

  const onLabelsChange = (newLabels: string[]) => {
    setLabels([...new Set(newLabels)]);
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
        getData={getData}
        workflows={data}
      />
      <WorkflowDefinitionsHeader
        allLabels={allLabels}
        keywords={[keywords]}
        onKeywordsChange={setKeywords}
        labels={labels}
        onLabelsChange={onLabelsChange}
      />
      <Table background="white">
        <Thead>
          <Tr>
            <Th>Name/Version</Th>
            <Th>Labels</Th>
            <Th>Included in</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {workflows.map((workflow: Workflow) => {
            return (
              <Tr key={`${workflow.name}-${workflow.version}`} role="group">
                <Td>
                  <Heading as="h6" size="xs" marginBottom={1}>
                    {workflow.name} / {workflow.version}
                  </Heading>
                  <Text fontStyle="italic" color="gray.600">
                    {jsonParse(workflow.description)?.description ||
                      (jsonParse(workflow.description)?.description !== '' && workflow.description) ||
                      'no description'}
                  </Text>
                </Td>
                <Td width={64}>
                  <Labels
                    labels={allLabels}
                    wf={workflow}
                    onClick={(label: string) => {
                      setLabels((oldLabels) => [...new Set([...oldLabels, label])]);
                    }}
                  />
                </Td>
                <Td width={36}>
                  <Popover trigger="hover">
                    <PopoverTrigger>
                      <Button
                        size="sm"
                        disabled={getDependencies(workflow).length === 0}
                        onClick={() => {
                          dependencyModal.onOpen();
                          setActiveWf(workflow);
                        }}
                      >
                        {`${getDependencies(workflow).length} `} Tree{' '}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Used directly in following workflows:</PopoverHeader>
                      <PopoverBody>
                        {getDependencies(workflow).usedInWfs.map((wf) => (
                          <p key={wf.name}>{wf.name}</p>
                        ))}
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Td>
                <Td>
                  <WorkflowActions
                    workflow={workflow}
                    onDeleteBtnClick={() => {
                      setActiveWf(workflow);
                      confirmDeleteModal.onOpen();
                    }}
                    onFavouriteBtnClick={() => {
                      updateFavourite(workflow);
                    }}
                    onDiagramBtnClick={() => {
                      diagramModal.onOpen();
                      setActiveWf(workflow);
                    }}
                    onDefinitionBtnClick={() => {
                      definitionModal.onOpen();
                      setActiveWf(workflow);
                    }}
                    onScheduleBtnClick={() => {
                      setActiveWf(workflow);
                      schedulingModal.onOpen();
                    }}
                    onExecuteBtnClick={() => {
                      setActiveWf(workflow);
                      inputParametersModal.onOpen();
                    }}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>
              <Paginator pagesCount={totalPages} onPaginationClick={setCurrentPage} currentPage={currentPage} />
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    </Container>
  );
};

export default WorkflowDefinitions;
