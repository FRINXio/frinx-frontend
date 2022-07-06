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
  useDisclosure,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import DefinitionModal from '@frinx/workflow-ui/src/common/modals/definition-modal';
import DependencyModal from '@frinx/workflow-ui/src/common/modals/dependency-modal';
import DiagramModal from '@frinx/workflow-ui/src/common/modals/diagram-modal';
import InputModal from '@frinx/workflow-ui/src/common/modals/input-modal';
import PageContainer from '@frinx/workflow-ui/src/common/PageContainer';
import ScheduledWorkflowModal from '../../../common/modals/scheduled-workflow-modal';
import WfLabels from '@frinx/workflow-ui/src/common/wf-labels';
import callbackUtils from '@frinx/workflow-ui/src/utils/callback-utils';
import { jsonParse } from '@frinx/workflow-ui/src/common/utils';
import { usePagination } from '@frinx/workflow-ui/src/common/pagination-hook';
import WorkflowActions from './workflow-actions';
import WorkflowDefinitionsHeader from './workflow-definitions-header';
import useNotifications from '@frinx/workflow-ui/src/hooks/use-notifications';
import Paginator from '@frinx/workflow-ui/src/common/pagination';
import { ScheduledWorkflow, Workflow } from '@frinx/workflow-ui/src/helpers/types';

const getLabels = (dataset: Workflow[]) => {
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

const Labels = (props: { wf: Workflow; labels: string[]; onClick: (label: string) => void }) => {
  const { wf, labels, onClick } = props;
  const { name, description } = wf;
  const labelsDef = jsonParse(description)?.labels || [];

  return labelsDef.map((label: string) => {
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

const WorkflowDefinitions = () => {
  const [keywords, setKeywords] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<Workflow[]>([]);
  const [activeWf, setActiveWf] = useState<Workflow>();
  const definitionModal = useDisclosure();
  const diagramModal = useDisclosure();
  const dependencyModal = useDisclosure();
  const schedulingModal = useDisclosure();
  const inputModal = useDisclosure();
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [allLabels, setAllLabels] = useState([]);
  const {
    currentPage,
    setCurrentPage,
    pageItems: workflows,
    setItemList,
    totalPages,
  } = usePagination<Workflow>([], 10);

  const { addToastNotification } = useNotifications();

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
  }, [keywords, labels, data]);

  const getData = () => {
    const { getWorkflows } = callbackUtils.getCallbacks;

    getWorkflows().then((workflows) => {
      if (workflows != null) {
        const dataset = workflows.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)) || [];
        setData(dataset);
        setAllLabels(getLabels(dataset));
      }
    });
  };

  function handleWorkflowSchedule(scheduledWf: Partial<ScheduledWorkflow>) {
    const { registerSchedule } = callbackUtils.getCallbacks;

    if (scheduledWf.workflowName != null && scheduledWf.workflowVersion != null) {
      registerSchedule(scheduledWf.workflowName, scheduledWf.workflowVersion, scheduledWf)
        .then(() => {
          addToastNotification({
            type: 'success',
            title: 'Success',
            content: 'Successfully scheduled',
          });
          getData();
        })
        .catch(() => {
          addToastNotification({
            type: 'error',
            title: 'Error',
            content: 'Failed to schedule workflow',
          });
        });
    }
  }

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

    workflow.description = JSON.stringify(wfDescription);

    const { putWorkflow, getWorkflows } = callbackUtils.getCallbacks;

    putWorkflow([workflow]).then(() => {
      getWorkflows().then((workflows) => {
        const dataset = workflows.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)) || [];
        const allLabels = getLabels(dataset);
        setData(dataset);
        setAllLabels(allLabels);
      });
    });
  };

  const deleteWorkflow = (workflow: Workflow) => {
    const { deleteWorkflow } = callbackUtils.getCallbacks;

    deleteWorkflow(workflow.name, workflow.version.toString()).then(() => {
      getData();
      setConfirmDeleteModal(false);
    });
  };

  const showConfirmDeleteModal = (workflow: Workflow) => {
    setActiveWf(workflow);
    setConfirmDeleteModal(!confirmDeleteModal);
  };

  const getDependencies = (workflow: Workflow) => {
    const usedInWfs = data.filter((wf) => {
      const wfJSON = JSON.stringify(wf, null, 2);
      return wfJSON.includes(`"name": "${workflow.name}"`) && wf.name !== workflow.name;
    });
    return { length: usedInWfs.length, usedInWfs };
  };

  const renderConfirmDeleteModal = () => {
    return confirmDeleteModal ? (
      <Modal size="sm" isOpen={confirmDeleteModal} onClose={() => showConfirmDeleteModal(activeWf!)}>
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
            <Button marginRight={4} colorScheme="red" onClick={() => deleteWorkflow(activeWf!)}>
              <Icon as={FontAwesomeIcon} icon={faTrash} />
              &nbsp;&nbsp;Delete
            </Button>
            <Button colorScheme="gray" onClick={() => showConfirmDeleteModal(activeWf!)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    ) : null;
  };

  const onLabelsChange = (labels: string[]) => {
    setLabels([...new Set(labels)]);
  };

  return (
    <PageContainer>
      <DefinitionModal workflow={activeWf} isOpen={definitionModal.isOpen} onClose={definitionModal.onClose} />
      <DiagramModal workflow={activeWf} onClose={diagramModal.onClose} isOpen={diagramModal.isOpen} />
      <DependencyModal
        workflow={activeWf}
        onClose={dependencyModal.onClose}
        isOpen={dependencyModal.isOpen}
        workflows={data}
      />
      {activeWf != null && (
        <ScheduledWorkflowModal
          workflow={activeWf}
          onClose={schedulingModal.onClose}
          isOpen={schedulingModal.isOpen}
          onSubmit={handleWorkflowSchedule}
        />
      )}
      {activeWf != null && <InputModal onClose={inputModal.onClose} isOpen={inputModal.isOpen} wf={activeWf} />}
      {renderConfirmDeleteModal()}
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
                <Td width={540}>
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
                        {getDependencies(workflow).length + ' '} Tree{' '}
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
                      showConfirmDeleteModal(workflow);
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
                      inputModal.onOpen();
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
    </PageContainer>
  );
};

export default WorkflowDefinitions;
