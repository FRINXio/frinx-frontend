import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Heading,
  Box,
  ButtonGroup,
  Stack,
  FormControl,
  Switch,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Tag,
  Code,
  useDisclosure,
  Progress,
  Container,
} from '@chakra-ui/react';
import sortBy from 'lodash/sortBy';
import FeatherIcon from 'feather-icons-react';
import { ScheduleWorkflowModal } from '@frinx/workflow-ui/src/common/modals';
import { usePagination } from '@frinx/workflow-ui/src/common/pagination-hook';
import Paginator from '@frinx/workflow-ui/src/common/pagination';
import {
  useNotifications,
  callbackUtils,
  ScheduledWorkflow,
  StatusType,
  ClientWorkflow,
  DescriptionJSON,
  jsonParse,
  Task,
} from '@frinx/shared/src';
import { gql, useQuery } from 'urql';
import { WorkflowListQuery, WorkflowListQueryVariables } from '../../../__generated__/graphql';

const WORKFLOWS_QUERY = gql`
  query WorkflowList {
    workflows {
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
          hasSchedule
          inputParameters
        }
      }
    }
  }
`;

function ScheduledWorkflowList() {
  const { currentPage, setCurrentPage, pageItems, setItemList, totalPages } = usePagination<ScheduledWorkflow>();
  const [selectedWorkflow, setSelectedWorkflow] = useState<ScheduledWorkflow | null>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addToastNotification } = useNotifications();

  const [{ data: workflows, fetching: isLoadingWorkflows }] = useQuery<WorkflowListQuery, WorkflowListQueryVariables>({
    query: WORKFLOWS_QUERY,
  });

  const getData = useCallback(() => {
    const { getSchedules } = callbackUtils.getCallbacks;

    setSelectedWorkflow(null);
    getSchedules()
      .then((schedules) => {
        setItemList(sortBy(schedules, ['name']));
      })
      .catch((err: Error) => {
        addToastNotification({
          content: err.message,
          type: 'error',
          title: 'Error',
        });
      });
  }, [setItemList, addToastNotification]);

  useEffect(() => {
    getData();
  }, [getData]);

  const onEdit = (workflow: ScheduledWorkflow) => {
    setSelectedWorkflow(workflow);
    onOpen();
  };

  const handleWorkflowUpdate = ({ workflowName, workflowVersion, ...scheduledWf }: Partial<ScheduledWorkflow>) => {
    if (workflowName == null || workflowVersion == null) {
      addToastNotification({
        content: 'Workflow name and version must be specified',
        type: 'error',
      });
    } else {
      const { registerSchedule } = callbackUtils.getCallbacks;

      registerSchedule(workflowName, workflowVersion, { ...scheduledWf, workflowName, workflowVersion })
        .then(() => {
          addToastNotification({
            content: 'Schedule successfully registered',
            type: 'success',
            title: 'Success',
          });
          getData();
        })
        .catch((err) => {
          addToastNotification({
            title: 'Failed to schedule workflow',
            type: 'error',
            content: err.message,
          });
        });
    }
  };

  const handleDeleteBtnClick = (workflow: ScheduledWorkflow) => {
    const { deleteSchedule } = callbackUtils.getCallbacks;
    deleteSchedule(workflow.workflowName, String(workflow.workflowVersion))
      .then(() => {
        addToastNotification({
          content: 'Deleted successfuly',
          title: 'Success',
          type: 'success',
        });
        getData();
      })
      .catch((err) => {
        addToastNotification({
          type: 'error',
          title: 'Error',
          content: err?.message,
        });
      });
  };

  function getStatusTagColor(status: StatusType) {
    switch (status) {
      case 'COMPLETED':
        return 'green';
      case 'RUNNING':
        return 'cyan';
      case 'FAILED':
        return 'red';
      default:
        return null;
    }
  }

  if (!pageItems == null || isLoadingWorkflows) {
    return <Progress isIndeterminate size="xs" marginTop={-10} />;
  }

  if (!pageItems.length) {
    return (
      <Container maxWidth={1200} mx="auto">
        <Box textAlign="center" marginY={15}>
          There are no scheduled workflows yet
        </Box>
      </Container>
    );
  }

  const clientWorkflows: ClientWorkflow[] =
    workflows?.workflows.edges.map(({ node }) => {
      const parsedLabels = jsonParse<DescriptionJSON>(node.description)?.labels ?? [];
      const tasks = jsonParse<Task[]>(node.tasks) ?? [];
      return {
        ...node,
        labels: parsedLabels,
        tasks,
        hasSchedule: node.hasSchedule ?? false,
      };
    }) ?? [];

  const selectedClientWorkflow = clientWorkflows.find((wf) => wf.name === selectedWorkflow?.workflowName);

  return (
    <Container maxWidth={1200} mx="auto">
      {selectedWorkflow != null && selectedClientWorkflow != null && (
        <ScheduleWorkflowModal
          workflow={selectedClientWorkflow}
          scheduledWorkflow={selectedWorkflow}
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedWorkflow(null);
          }}
          onSubmit={handleWorkflowUpdate}
        />
      )}
      <Table background="white">
        <Thead>
          <Tr>
            <Th>Active</Th>
            <Th>Name/Version</Th>
            <Th>Last Status</Th>
            <Th>Cron expression</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        {!pageItems.length ? null : (
          <>
            <Tbody>
              {pageItems.map((item: ScheduledWorkflow) => (
                <Tr key={item.name} role="group">
                  <Td>
                    <FormControl display="flex" alignItems="center">
                      <Switch
                        isChecked={item.enabled ?? false}
                        onChange={() => {
                          const editedWorkflow = {
                            ...item,
                            enabled: !item.enabled,
                          };

                          handleWorkflowUpdate(editedWorkflow);
                          setSelectedWorkflow(null);
                        }}
                      />
                    </FormControl>
                  </Td>
                  <Td>
                    <Heading as="h6" size="xs">
                      {item.name}
                    </Heading>
                  </Td>
                  <Td>
                    <Tag colorScheme={getStatusTagColor(item.status) ?? ''}>{item.status || '-'}</Tag>
                  </Td>
                  <Td>
                    <Code>{item.cronString}</Code>
                  </Td>
                  <Td>
                    <Stack direction="row" spacing={4}>
                      <ButtonGroup>
                        <Button
                          colorScheme="red"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            handleDeleteBtnClick(item);
                          }}
                        >
                          <Box as="span" flexShrink={0} alignSelf="center">
                            <Box
                              as={FeatherIcon}
                              size="1em"
                              icon="trash-2"
                              flexShrink={0}
                              lineHeight={4}
                              verticalAlign="middle"
                            />
                          </Box>
                        </Button>
                        <Button colorScheme="black" size="sm" variant="outline" onClick={() => onEdit(item)}>
                          <Box as="span" flexShrink={0} alignSelf="center">
                            <Box
                              as={FeatherIcon}
                              size="1em"
                              icon="edit"
                              flexShrink={0}
                              lineHeight={4}
                              verticalAlign="middle"
                            />
                          </Box>
                        </Button>
                      </ButtonGroup>
                    </Stack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>
                  <Paginator currentPage={currentPage} onPaginationClick={setCurrentPage} pagesCount={totalPages} />
                </Th>
              </Tr>
            </Tfoot>
          </>
        )}
      </Table>
    </Container>
  );
}

export default ScheduledWorkflowList;
