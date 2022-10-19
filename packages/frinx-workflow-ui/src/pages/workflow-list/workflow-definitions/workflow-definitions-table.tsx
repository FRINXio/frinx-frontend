import {
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Heading,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Tfoot,
  UseDisclosureReturn,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import Paginator from '@frinx/workflow-ui/src/common/pagination';
import { Workflow } from '@frinx/workflow-ui/src/helpers/types';
import { jsonParse } from '@frinx/workflow-ui/src/utils/helpers.utils';
import WorkflowLabels from '@frinx/workflow-ui/src/common/workflow-labels';
import WorkflowActions from './workflow-actions';

type Props = {
  workflows: Workflow[];
  allLabels: string[];
  executeWorkflowModal: UseDisclosureReturn;
  definitionModal: UseDisclosureReturn;
  diagramModal: UseDisclosureReturn;
  dependencyModal: UseDisclosureReturn;
  scheduleWorkflowModal: UseDisclosureReturn;
  confirmDeleteModal: UseDisclosureReturn;
  paginationProps: {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
  };
  onLabelClick: (label: string) => void;
  onFavoriteClick: (wf: Workflow) => void;
  setActiveWorkflow: (wf: Workflow) => void;
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

const WorkflowDefinitionsTable: VoidFunctionComponent<Props> = ({
  setActiveWorkflow,
  onFavoriteClick,
  paginationProps,
  confirmDeleteModal,
  onLabelClick,
  workflows,
  allLabels,
  definitionModal,
  dependencyModal,
  diagramModal,
  executeWorkflowModal,
  scheduleWorkflowModal,
}) => {
  const getDependencies = (workflow: Workflow) => {
    const usedInWfs = workflows.filter((wf) => {
      const wfJSON = JSON.stringify(wf, null, 2);
      return wfJSON.includes(`"name": "${workflow.name}"`) && wf.name !== workflow.name;
    });
    return { length: usedInWfs.length, usedInWfs };
  };

  return (
    <Table background="white" mb={5}>
      <Thead>
        <Tr>
          <Th>Name/Version</Th>
          <Th>Labels</Th>
          <Th>Included in</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {workflows.length === 0 ? (
          <Tr>
            <Td colSpan={4}>No workflows match your search params</Td>
          </Tr>
        ) : (
          workflows.map((workflow: Workflow) => {
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
                  <Labels labels={allLabels} wf={workflow} onClick={onLabelClick} />
                </Td>
                <Td width={36}>
                  <Popover trigger="hover">
                    <PopoverTrigger>
                      <Button
                        size="sm"
                        disabled={getDependencies(workflow).length === 0}
                        onClick={() => {
                          dependencyModal.onOpen();
                          setActiveWorkflow(workflow);
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
                      setActiveWorkflow(workflow);
                      confirmDeleteModal.onOpen();
                    }}
                    onFavouriteBtnClick={() => {
                      onFavoriteClick(workflow);
                    }}
                    onDiagramBtnClick={() => {
                      diagramModal.onOpen();
                      setActiveWorkflow(workflow);
                    }}
                    onDefinitionBtnClick={() => {
                      definitionModal.onOpen();
                      setActiveWorkflow(workflow);
                    }}
                    onScheduleBtnClick={() => {
                      setActiveWorkflow(workflow);
                      scheduleWorkflowModal.onOpen();
                    }}
                    onExecuteBtnClick={() => {
                      setActiveWorkflow(workflow);
                      executeWorkflowModal.onOpen();
                    }}
                  />
                </Td>
              </Tr>
            );
          })
        )}
      </Tbody>
      <Tfoot>
        <Tr>
          <Th>
            <Paginator
              pagesCount={paginationProps.totalPages}
              onPaginationClick={paginationProps.setCurrentPage}
              currentPage={paginationProps.currentPage}
            />
          </Th>
        </Tr>
      </Tfoot>
    </Table>
  );
};

export default WorkflowDefinitionsTable;
