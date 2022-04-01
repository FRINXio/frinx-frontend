/*
  FIXME
  This is just copy-pasted WorfklowDefs with removed functionality.
  Find out better way to implement read only components. We probably
  want to use something different than class inheritance.

  https://reactjs.org/docs/composition-vs-inheritance.html

*/

// @flow
import DefinitionModal from './definition-modal/definition-modal';
import DependencyModal from './DependencyModal/DependencyModal';
import DiagramModal from './DiagramModal/DiagramModal';
import InputModal from './InputModal/input-modal';
import PageContainer from '../../../common/PageContainer';
import Paginator from '../../../common/pagination';
import React, { useEffect, useState } from 'react';
import WfAutoComplete from '../../../common/wf-autocomplete';
import WfLabels from '../../../common/wf-labels';
import _ from 'lodash';
import callbackUtils from '../../../utils/callback-utils';
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
import { faCodeBranch, faFileCode, faPlay, faSearch, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutlined } from '@fortawesome/free-regular-svg-icons';
import { jsonParse } from '../../../common/utils';
import { usePagination } from '../../../common/pagination-hook';

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

function WorkflowDefs({ onDefinitionClick, onWorkflowIdClick }: Props) {
  const [keywords, setKeywords] = useState('');
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [activeWf, setActiveWf] = useState(null);
  const [defModal, setDefModal] = useState(false);
  const [diagramModal, setDiagramModal] = useState(false);
  const [inputModal, setInputModal] = useState(false);
  const [dependencyModal, setDependencyModal] = useState(false);
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
  }, [keywords, labels, data, setItemList]);

  const getData = () => {
    const { getWorkflows } = callbackUtils.getCallbacks;

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

  const createLabels = ({ name, description }) => {
    const labelsDef = jsonParse(description)?.labels || [];

    return labelsDef.map((label, i) => {
      const index = allLabels.findIndex((lab) => lab === label);
      return <WfLabels key={`${name}-${i}`} label={label} index={index} search={() => setLabels([...labels, label])} />;
    });
  };

  const repeatButtons = (dataset) => {
    return (
      <Td textAlign="center">
        <Stack direction="row" spacing={1} justify="center">
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
        <Tr>
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
            <Popover trigger="hover">
              <PopoverTrigger>
                <Button size="sm" disabled={getDependencies(e).length === 0} onClick={() => showDependencyModal(e)}>
                  {' '}
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

  const showDependencyModal = (workflow) => {
    setDependencyModal(!dependencyModal);
    setActiveWf(workflow);
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

  return (
    <PageContainer>
      {renderDefinitionModal()}
      {renderInputModal()}
      {renderDiagramModal()}
      {renderDependencyModal()}
      <Grid templateColumns="40px 1fr 1fr" gap={4} marginBottom={8}>
        <IconButton
          colorScheme="blue"
          height={9}
          width={9}
          onClick={() => searchFavourites()}
          title="Favourites"
          icon={<Icon as={FontAwesomeIcon} icon={labels.includes('FAVOURITE') ? faStar : faStarOutlined} />}
        />
        <Box>
          <WfAutoComplete options={allLabels} onChange={setLabels} selected={labels} placeholder="Search by label." />
        </Box>
        <Box>
          <InputGroup marginBottom={0}>
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
              <Paginator currentPage={currentPage} onPaginationClick={setCurrentPage} pagesCount={totalPages} />
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    </PageContainer>
  );
}

export default WorkflowDefs;
