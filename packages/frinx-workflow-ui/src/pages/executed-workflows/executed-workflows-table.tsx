import React, { FC, Fragment, useState } from 'react';
import { Table, Tbody, Box, Text, Tr, Td, Checkbox, Icon, Link as ChakraLink, IconButton } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import FeatherIcon from 'feather-icons-react';
import ExecutedWorkflowsTableHead from './executed-workflows-table-head';
import { OrderBy, SortKey } from './executed-workflows.helpers';
import { WorkflowStatus } from '../../__generated__/graphql';
import WorkflowStatusLabel from '../../components/workflow-status-label/workflow-status-label';
import SubworkflowTableRow from './subworkflows-table-row';

type Props = {
  orderBy: OrderBy;
  // workflows: NonNullable<ExecutedWorkflowsQuery['conductor']['executedWorkflows']>['edges'][0]['node'][];
  workflows: unknown[]; // TODO: FIXME
  selectedWorkflows: string[];
  onSort: (value: SortKey) => void;
  onSelectAllWorkflows: () => void;
  onWorkflowSelect: (workflowId: string | null) => void;
  onWorkflowStatusClick?: (status: WorkflowStatus | 'UNKNOWN') => void;
};

const ExecutedWorkflowsTable: FC<Props> = ({
  workflows,
  onSelectAllWorkflows,
  onWorkflowSelect,
  onWorkflowStatusClick,
  selectedWorkflows,
  onSort,
  orderBy,
}) => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const isAllSelected = workflows.length === selectedWorkflows.length;

  return (
    <Box marginBottom={10}>
      <Table background="white" size="md">
        <ExecutedWorkflowsTableHead
          orderBy={orderBy}
          onSelectAllWorkflows={onSelectAllWorkflows}
          isAllSelected={isAllSelected}
          onSort={onSort}
        />
        <Tbody>
          {workflows.map((workflow) => {
            return {
              /*           
              <Fragment key={workflow.id}>
                <Tr key={workflow.id}>
                  <Td>
                    <Checkbox
                      isChecked={selectedWorkflows.includes(workflow.originalId ?? '')}
                      onChange={() => {
                        onWorkflowSelect(workflow.originalId ?? '');
                      }}
                    />
                  </Td>
                  <Td display="flex" alignItems="center">
                    <IconButton
                      opacity={workflow.hasSubworkflows ? 1 : 0}
                      pointerEvents={workflow.hasSubworkflows ? 'all' : 'none'}
                      cursor={workflow.hasSubworkflows ? 'pointer' : 'pointer'}
                      size="sm"
                      aria-label="expand"
                      onClick={() => {
                        setSelectedWorkflowId((prev) => {
                          if (prev === workflow.id) {
                            return null;
                          }
                          return workflow.id;
                        });
                      }}
                      icon={
                        workflow.id === selectedWorkflowId ? (
                          <Icon as={FeatherIcon} icon="chevron-up" size={20} w="6" h="6" />
                        ) : (
                          <Icon as={FeatherIcon} icon="chevron-down" size={20} w="6" h="6" />
                        )
                      }
                    />
                    <Box marginLeft={4}>
                      <ChakraLink color="blue.500" as={Link} to={workflow.id} display="block" marginBottom={2}>
                        {workflow.workflowDefinition?.name}
                      </ChakraLink>
                      <Text as="span" color="blackAlpha.700" fontSize="sm">
                        {workflow.originalId}
                      </Text>
                    </Box>
                  </Td>
                  <Td fontSize="sm">{moment(workflow.startTime).format('MM/DD/YYYY, HH:mm:ss:SSS')}</Td>
                  <Td fontSize="sm">
                    {workflow.endTime ? moment(workflow.endTime).format('MM/DD/YYYY, HH:mm:ss:SSS') : '-'}
                  </Td>
                  <Td>
                    <WorkflowStatusLabel status={workflow.status ?? 'UNKNOWN'} onClick={onWorkflowStatusClick} />
                  </Td>
                </Tr>
                {selectedWorkflowId === workflow.id && <SubworkflowTableRow workflowId={selectedWorkflowId} />}
              </Fragment>
              */
            };
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ExecutedWorkflowsTable;
