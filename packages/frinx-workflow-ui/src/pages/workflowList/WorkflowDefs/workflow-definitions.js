// @flow
import React, { useEffect, useState } from 'react';
import {
  Button,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import DefinitionModal from './DefinitonModal/DefinitionModal';
import DependencyModal from './DependencyModal/DependencyModal';
import DiagramModal from './DiagramModal/DiagramModal';
import InputModal from './InputModal/input-modal';
import PageContainer from '../../../common/PageContainer';
import PaginationPages from '../../../common/Pagination';
import SchedulingModal from '../Scheduling/SchedulingModal/SchedulingModal';
import WfLabels from '../../../common/wf-labels';
import WorkflowListViewModal from './WorkflowListViewModal/WorkflowListViewModal';
import callbackUtils from '../../../utils/callbackUtils';
import { jsonParse } from '../../../common/utils';
import { usePagination } from '../../../common/PaginationHook';
import WorkflowActions from './workflow-actions';
import WorkflowDefinitionsHeader from './workflow-definitions-header';

const getLabels = (dataset) => {
  const labelsArr = dataset.map(({ description }) => {
    return jsonParse(description)?.labels;
  });
  const allLabels = [...new Set([].concat(...labelsArr))];
  return allLabels
    .filter((e) => {
      return e !== undefined;
    })
    .sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));
};

const Labels = (props: { wf: Workflow, labels: string[], onClick: (label: string) => void }) => {
  const { wf, labels, onClick } = props;
  const { name, description } = wf;
  const labelsDef = jsonParse(description)?.labels || [];

  return labelsDef.map((label, i) => {
    const index = labels.findIndex((lab) => lab === label);
    return (
      <WfLabels
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

type Workflow = {
  name: string,
  version: number,
  description: string,
  hasSchedule: boolean,
};
type Props = {
  onDefinitionClick: (name: string, version: string) => void,
  onWorkflowIdClick: (wfId: string) => void,
};

const WorkflowDefinitions = ({ onDefinitionClick, onWorkflowIdClick }: Props) => {
  const [keywords, setKeywords] = useState('');
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [activeWf, setActiveWf] = useState(null);
  const [defModal, setDefModal] = useState(false);
  const [diagramModal, setDiagramModal] = useState(false);
  const [inputModal, setInputModal] = useState(false);
  const [dependencyModal, setDependencyModal] = useState(false);
  const [schedulingModal, setSchedulingModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [workflowListViewModal, setWorkflowListViewModal] = useState(false);
  const [allLabels, setAllLabels] = useState([]);
  const { currentPage, setCurrentPage, pageItems, setItemList, totalPages } = usePagination([], 10);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const results =
      !keywords && labels.length === 0
        ? data
        : data.filter((e) => {
            const searchedKeys = ['name'];
            const queryWords = keywords.toUpperCase().split(' ');
            const labelsArr = jsonParse(e.description)?.labels;

            // if labels are used and wf doesnt contain selected labels => filter out
            if (labels.length > 0) {
              if (_.difference(labels, labelsArr).length !== 0) {
                return false;
              }
            }

            // search for keywords in "searchedKeys"
            for (let i = 0; i < searchedKeys.length; i += 1) {
              for (let j = 0; j < queryWords.length; j += 1) {
                if (e[searchedKeys[i]].toString().toUpperCase().indexOf(queryWords[j]) === -1) {
                  return false;
                }
              }
              return true;
            }
          });

    setItemList(results);
  }, [keywords, labels, data]);

  const getData = () => {
    const getWorkflows = callbackUtils.getWorkflowsCallback();

    getWorkflows().then((workflows) => {
      if (workflows) {
        const dataset = workflows.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)) || [];
        setData(dataset);
        setAllLabels(getLabels(dataset));
      }
    });
  };

  const updateFavourite = (workflow) => {
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
      wfDescription.labels = wfDescription?.labels.filter((e) => e !== 'FAVOURITE');
    }
    // if workflow has correct description object, just add label
    else {
      wfDescription.labels.push('FAVOURITE');
    }

    workflow.description = JSON.stringify(wfDescription);

    const putWorkflow = callbackUtils.putWorkflowCallback();
    const getWorkflows = callbackUtils.getWorkflowsCallback();

    putWorkflow([workflow]).then(() => {
      getWorkflows().then((workflows) => {
        const dataset = workflows.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)) || [];
        const allLabels = getLabels(dataset);
        setData(dataset);
        setAllLabels(allLabels);
      });
    });
  };

  const deleteWorkflow = (workflow) => {
    const deleteWorkflow = callbackUtils.deleteWorkflowCallback();

    deleteWorkflow(workflow?.name, workflow?.version).then(() => {
      getData();
      setConfirmDeleteModal(false);
    });
  };

  const showDefinitionModal = (workflow) => {
    setDefModal(!defModal);
    setActiveWf(workflow);
  };

  const showInputModal = (workflow) => {
    setInputModal(!inputModal);
    setActiveWf(workflow);
  };

  const showDiagramModal = (workflow) => {
    setDiagramModal(!diagramModal);
    setActiveWf(workflow);
  };

  const onSchedulingModalClose = () => {
    setSchedulingModal(false);
    getData();
  };

  const showSchedulingModal = (workflow) => {
    setSchedulingModal(!schedulingModal);
    setActiveWf(workflow);
  };

  const showDependencyModal = (workflow) => {
    setDependencyModal(!dependencyModal);
    setActiveWf(workflow);
  };

  const showConfirmDeleteModal = (workflow) => {
    setConfirmDeleteModal(!confirmDeleteModal);
    setActiveWf(workflow);
  };

  const showWorkflowListViewModal = (workflow) => {
    setWorkflowListViewModal(!workflowListViewModal);
    setActiveWf(workflow);
  };

  const getActiveWfScheduleName = () => {
    if (activeWf != null && activeWf.expectedScheduleName != null) {
      return activeWf.expectedScheduleName;
    }
    return null;
  };

  const getDependencies = (workflow) => {
    const usedInWfs = data.filter((wf) => {
      const wfJSON = JSON.stringify(wf, null, 2);
      return wfJSON.includes(`"name": "${workflow.name}"`) && wf.name !== workflow.name;
    });
    return { length: usedInWfs.length, usedInWfs };
  };

  const renderDefinitionModal = () => {
    return defModal ? <DefinitionModal wf={activeWf} modalHandler={showDefinitionModal} show={defModal} /> : null;
  };

  const renderInputModal = () => {
    return inputModal ? (
      <InputModal wf={activeWf} modalHandler={showInputModal} show={inputModal} onWorkflowIdClick={onWorkflowIdClick} />
    ) : null;
  };

  const renderDiagramModal = () => {
    return diagramModal ? <DiagramModal wf={activeWf} modalHandler={showDiagramModal} show={diagramModal} /> : null;
  };

  const renderWorkflowListViewModal = () => {
    return workflowListViewModal ? (
      <WorkflowListViewModal
        wf={activeWf}
        modalHandler={showWorkflowListViewModal}
        show={workflowListViewModal}
        data={data}
        onDefinitionClick={onDefinitionClick}
      />
    ) : null;
  };

  const renderSchedulingModal = () => {
    return (
      schedulingModal && (
        <SchedulingModal
          name={getActiveWfScheduleName()}
          workflowName={activeWf?.name}
          workflowVersion={activeWf?.version}
          onClose={onSchedulingModalClose}
          isOpen={schedulingModal}
        />
      )
    );
  };

  const renderDependencyModal = () => {
    return dependencyModal ? (
      <DependencyModal
        wf={activeWf}
        modalHandler={showDependencyModal}
        show={dependencyModal}
        data={data}
        onDefinitionClick={onDefinitionClick}
      />
    ) : null;
  };

  const renderConfirmDeleteModal = () => {
    return confirmDeleteModal ? (
      <Modal size="sm" isOpen={confirmDeleteModal} onClose={showConfirmDeleteModal}>
        <ModalOverlay />
        <ModalCloseButton />
        <ModalContent>
          <ModalHeader>Delete Workflow</ModalHeader>
          <ModalBody>
            <p>
              Do you want to delete workflow <b>{activeWf?.name}</b> ?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button marginRight={4} colorScheme="red" onClick={() => deleteWorkflow(activeWf)}>
              <Icon as={FontAwesomeIcon} icon={faTrash} />
              &nbsp;&nbsp;Delete
            </Button>
            <Button colorScheme="gray" onClick={() => showConfirmDeleteModal()}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    ) : null;
  };

  return (
    <PageContainer>
      {renderDefinitionModal()}
      {renderInputModal()}
      {renderDiagramModal()}
      {renderDependencyModal()}
      {renderSchedulingModal()}
      {renderConfirmDeleteModal()}
      {renderWorkflowListViewModal()}
      <WorkflowDefinitionsHeader
        allLabels={allLabels}
        keywords={keywords}
        onKeywordsChange={setKeywords}
        labels={labels}
        onLabelsChange={setLabels}
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
          {pageItems.map((e) => {
            return (
              <Tr key={`${e.name}-${e.version}`} role="group">
                <Td width={540}>
                  <Heading as="h6" size="xs" marginBottom={1}>
                    {e.name} / {e.version}
                  </Heading>
                  <Text fontStyle="italic" color="gray.600">
                    {jsonParse(e.description)?.description ||
                      (jsonParse(e.description)?.description !== '' && e.description) ||
                      'no description'}
                  </Text>
                </Td>
                <Td width={64}>
                  <Labels
                    labels={allLabels}
                    wf={e}
                    onClick={(label) => {
                      setLabels((ls) => [...ls, label]);
                    }}
                  />
                </Td>
                <Td width={36}>
                  <Popover trigger="hover">
                    <PopoverTrigger>
                      <Button
                        size="sm"
                        disabled={getDependencies(e).length === 0}
                        onClick={() => showDependencyModal(e)}
                      >
                        {getDependencies(e).length + ' '} Tree{' '}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Used directly in following workflows:</PopoverHeader>
                      <PopoverBody>
                        {getDependencies(e).usedInWfs.map((wf) => (
                          <p key={wf.name}>{wf.name}</p>
                        ))}
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Td>
                <Td>
                  <WorkflowActions
                    isFavourite={jsonParse(e.description)?.labels?.includes('FAVOURITE') ?? false}
                    hasSchedule={e.hasSchedule}
                    onDeleteBtnClick={() => {
                      showConfirmDeleteModal(e);
                    }}
                    onFavouriteBtnClick={() => {
                      updateFavourite(e);
                    }}
                    onDiagramBtnClick={() => {
                      showDiagramModal(e);
                    }}
                    onDefinitionBtnClick={() => {
                      showDefinitionModal(e);
                    }}
                    onListBtnClick={() => {
                      showWorkflowListViewModal(e);
                    }}
                    onEditBtnClick={() => {
                      onDefinitionClick(e.name, e.version);
                    }}
                    onScheduleBtnClick={() => {
                      showSchedulingModal(e);
                    }}
                    onExecuteBtnClick={() => {
                      showInputModal(e);
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
              <PaginationPages totalPages={totalPages} currentPage={currentPage} changePageHandler={setCurrentPage} />
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    </PageContainer>
  );
};

export default WorkflowDefinitions;
