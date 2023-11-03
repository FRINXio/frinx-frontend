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
  UseDisclosureReturn,
  Icon,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import FeatherIcon from 'feather-icons-react';
import { ClientWorkflow, jsonParse } from '@frinx/shared';
import WorkflowActions from './workflow-actions';
import WorkflowLabel from '../../components/workflow-label';

type OrderBy = {
  sortKey: 'name';
  direction: 'ASC' | 'DESC';
};

type Props = {
  workflows: ClientWorkflow[];
  onSort: () => void;
  orderBy: OrderBy;
  executeWorkflowModal: UseDisclosureReturn;
  definitionModal: UseDisclosureReturn;
  diagramModal: UseDisclosureReturn;
  dependencyModal: UseDisclosureReturn;
  scheduleWorkflowModal: UseDisclosureReturn;
  confirmDeleteModal: UseDisclosureReturn;
  onLabelClick: (label: string) => void;
  setActiveWorkflow: (wf: ClientWorkflow) => void;
};

function getLabelsFromJSON(description?: string): string[] {
  return jsonParse<{ labels: string[] }>(description)?.labels || [];
}

const Labels: VoidFunctionComponent<{ wf: ClientWorkflow; onClick: (label: string) => void }> = ({ wf, onClick }) => {
  const { description } = wf;
  const labelsDef = getLabelsFromJSON(description ?? undefined);

  return (
    <>
      {labelsDef.map((label: string) => {
        return (
          <WorkflowLabel
            key={label}
            label={label}
            onClick={() => {
              onClick(label);
            }}
          />
        );
      })}
    </>
  );
};

const WorkflowDefinitionsTable: VoidFunctionComponent<Props> = ({
  setActiveWorkflow,
  confirmDeleteModal,
  onLabelClick,
  onSort,
  orderBy,
  workflows,
  definitionModal,
  dependencyModal,
  diagramModal,
  executeWorkflowModal,
  scheduleWorkflowModal,
}) => {
  const getDependencies = (workflow: ClientWorkflow) => {
    const usedInWfs = workflows.filter((wf) => {
      const wfJSON = JSON.stringify(wf, null, 2);
      return wfJSON.includes(`"name": "${workflow.name}"`) && wf.name !== workflow.name;
    });
    return { length: usedInWfs.length, usedInWfs };
  };

  return (
    <Table background="white" size="lg" data-cy="tbl-workflows">
      <Thead>
        <Tr>
          <Th cursor="pointer" onClick={onSort}>
            Name/Version{' '}
            <Icon as={FeatherIcon} size={40} icon={orderBy.direction === 'ASC' ? 'chevron-down' : 'chevron-up'} />
          </Th>
          <Th>Labels</Th>
          <Th whiteSpace="nowrap">Included in</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {workflows.length === 0 ? (
          <Tr>
            <Td colSpan={4}>No workflows match your search params</Td>
          </Tr>
        ) : (
          workflows.map((workflow) => {
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
                <Td>
                  <Labels wf={workflow} onClick={onLabelClick} />
                </Td>
                <Td>
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
                        {`${getDependencies(workflow).length} `} Tree
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
    </Table>
  );
};

export default WorkflowDefinitionsTable;
