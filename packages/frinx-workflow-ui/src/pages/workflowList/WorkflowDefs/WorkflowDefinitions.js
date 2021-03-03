// @flow
import DefinitionModal from './DefinitonModal/DefinitionModal';
import DependencyModal from './DependencyModal/DependencyModal';
import DiagramModal from './DiagramModal/DiagramModal';
import InputModal from './InputModal/InputModal';
import PageContainer from '../../../common/PageContainer';
import PaginationPages from '../../../common/Pagination';
import React, { useEffect, useState } from 'react';
import SchedulingModal from '../Scheduling/SchedulingModal/SchedulingModal';
import WfLabels from '../../../common/WfLabels';
import WorkflowListViewModal from './WorkflowListViewModal/WorkflowListViewModal';
import _ from 'lodash';
import callbackUtils from '../../../utils/callbackUtils';
import {
  Box,
  Button,
  Grid,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
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
  Stack,
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
import { Typeahead } from 'react-bootstrap-typeahead';
import {
  faClock,
  faCodeBranch,
  faEdit,
  faFileCode,
  faListUl,
  faPlay,
  faSearch,
  faStar,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutlined } from '@fortawesome/free-regular-svg-icons';
import { jsonParse } from '../../../common/utils';
import { usePagination } from '../../../common/PaginationHook';

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

  const searchFavourites = () => {
    const newLabels = [...labels];
    const index = newLabels.findIndex((label) => label === 'FAVOURITE');
    index > -1 ? newLabels.splice(index, 1) : newLabels.push('FAVOURITE');
    setLabels(newLabels);
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

  const createLabels = ({ name, description }) => {
    const labelsDef = jsonParse(description)?.labels || [];

    return labelsDef.map((label, i) => {
      const index = allLabels.findIndex((lab) => lab === label);
      return <WfLabels key={`${name}-${i}`} label={label} index={index} search={() => setLabels([...labels, label])} />;
    });
  };

  const deleteWorkflow = (workflow) => {
    const deleteWorkflow = callbackUtils.deleteWorkflowCallback();

    deleteWorkflow(workflow?.name, workflow?.version).then(() => {
      getData();
      setConfirmDeleteModal(false);
    });
  };

  const repeatButtons = (dataset) => {
    return (
      <Td textAlign="center">
        <Stack direction="row" spacing={1}>
          <IconButton
            colorScheme="red"
            isRound
            variant="outline"
            onClick={() => showConfirmDeleteModal(dataset)}
            title="Delete"
            icon={<Icon as={FontAwesomeIcon} icon={faTrash} />}
          />
          <IconButton
            colorScheme="gray"
            isRound
            variant="outline"
            title="Favourites"
            icon={<Icon as={FontAwesomeIcon} icon={labels.includes('FAVOURITE') ? faStar : faStarOutlined} />}
            onClick={() => updateFavourite(dataset)}
          />
          <IconButton
            colorScheme="gray"
            isRound
            variant="outline"
            title="Diagram"
            icon={<Icon as={FontAwesomeIcon} icon={faCodeBranch} />}
            onClick={() => showDiagramModal(dataset)}
          />
          <IconButton
            colorScheme="gray"
            isRound
            variant="outline"
            title="Definition"
            icon={<Icon as={FontAwesomeIcon} icon={faFileCode} />}
            onClick={() => showDefinitionModal(dataset)}
          />
          <IconButton
            colorScheme="gray"
            isRound
            variant="outline"
            title="Workflow List"
            icon={<Icon as={FontAwesomeIcon} icon={faListUl} />}
            onClick={() => showWorkflowListViewModal(dataset)}
          />
          <IconButton
            colorScheme="gray"
            isRound
            variant="outline"
            title="Edit"
            icon={<Icon as={FontAwesomeIcon} icon={faEdit} />}
            onClick={() => {
              onDefinitionClick(dataset.name, dataset.version);
            }}
          />
          <IconButton
            colorScheme="gray"
            isRound
            variant="outline"
            title={dataset.hasSchedule ? 'Edit schedule' : 'Create schedule'}
            icon={<Icon as={FontAwesomeIcon} icon={faClock} />}
            onClick={() => showSchedulingModal(dataset)}
          />
          <IconButton
            colorScheme="blue"
            isRound
            title="Execute"
            icon={<Icon as={FontAwesomeIcon} icon={faPlay} />}
            onClick={() => showInputModal(dataset)}
          />
        </Stack>
      </Td>
    );
  };

  const filteredRows = () => {
    return pageItems.map((e) => {
      return (
        <Tr key={`${e.name}-${e.version}`}>
          <Td>
            <Heading as="h6" size="xs">
              {e.name} / {e.version}
            </Heading>
            <Text>
              {jsonParse(e.description)?.description ||
                (jsonParse(e.description)?.description !== '' && e.description) ||
                'no description'}
            </Text>
          </Td>
          <Td>{createLabels(e)}</Td>
          <Td width={2} textAlign="center">
            <Popover>
              <PopoverTrigger>
                <Button size="sm" disabled={getDependencies(e).length === 0} onClick={() => showDependencyModal(e)}>
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
          {repeatButtons(e)}
        </Tr>
      );
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
      <SchedulingModal
        name={getActiveWfScheduleName()}
        workflowName={activeWf?.name}
        workflowVersion={activeWf?.version}
        onClose={onSchedulingModalClose}
        show={schedulingModal}
      />
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
      <Grid templateColumns="40px 1fr 1fr" gap={4}>
        <IconButton
          colorScheme="blue"
          height={8}
          width={8}
          onClick={() => searchFavourites()}
          title="Favourites"
          icon={<Icon as={FontAwesomeIcon} icon={labels.includes('FAVOURITE') ? faStar : faStarOutlined} />}
        />
        <Box>
          <Typeahead
            id="typeaheadDefs"
            selected={labels}
            onChange={(e) => setLabels(e)}
            clearButton
            labelKey="name"
            multiple
            options={allLabels}
            placeholder="Search by label."
          />
        </Box>
        <Box>
          <InputGroup marginBottom={8}>
            <InputLeftElement>
              <Icon as={FontAwesomeIcon} icon={faSearch} color="grey" />
            </InputLeftElement>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Search by keyword."
              background="white"
            />
          </InputGroup>
        </Box>
      </Grid>
      <Table background="white">
        <Thead>
          <Tr>
            <Th>Name/Version</Th>
            <Th>Labels</Th>
            <Th textAlign="center">Included in</Th>
            <Th textAlign="center">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>{filteredRows()}</Tbody>
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
