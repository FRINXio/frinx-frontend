import React, { useMemo, useState } from 'react';
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
  Th,
  Thead,
  Tr,
  Tag,
  Code,
  useDisclosure,
  Progress,
  Container,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import {
  omitNullValue,
  useNotifications,
  ScheduledWorkflow,
  StatusType,
  ClientWorkflow,
  DescriptionJSON,
  jsonParse,
  Task,
  EditScheduledWorkflow,
  Pagination,
  usePagination,
} from '@frinx/shared';
import { sortBy } from 'lodash';
import { gql, useQuery, useMutation } from 'urql';
import {
  DeleteScheduleMutation,
  DeleteScheduleMutationVariables,
  EditWorkflowScheduleMutation,
  EditWorkflowScheduleMutationVariables,
  SchedulesQuery,
  WorkflowsQuery,
  WorkflowsQueryVariables,
} from '../../__generated__/graphql';
import EditScheduleWorkflowModal from '../../components/modals/edit-schedule-workflow-modal';

const WORKFLOWS_QUERY = gql`
  query WorkflowList {
    conductor {
      workflowDefinitions {
        edges {
          node {
            id
            name
            description
            version
            createdAt
            updatedAt
            hasSchedule
            inputParameters
          }
        }
      }
    }
  }
`;

const SCHEDULED_WORKFLOWS_QUERY = gql`
  query Schedules {
    scheduler {
      schedules {
        edges {
          node {
            name
            workflowName
            workflowVersion
            cronString
            workflowContext
            enabled
            fromDate
            toDate
            parallelRuns
            status
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        totalCount
      }
    }
  }
`;

// const DELETE_SCHEDULE_MUTATION = gql`
//   mutation DeleteSchedule($deleteScheduleId: String!) {
//     deleteSchedule(id: $deleteScheduleId) {
//       isOk
//     }
//   }
// `;
//
// const UPDATE_SCHEDULE_MUTATION = gql`
//   mutation EditWorkflowSchedule($input: EditWorkflowScheduleInput!, $editWorkflowScheduleId: String!) {
//     editWorkflowSchedule(input: $input, id: $editWorkflowScheduleId) {
//       name
//       workflowName
//       workflowVersion
//       cronString
//       workflowContext
//       isEnabled
//       performFromDate
//       performTillDate
//       parallelRuns
//     }
//   }
// `;
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

function ScheduledWorkflowList() {
  const context = useMemo(() => ({ additionalTypenames: ['Schedule'] }), []);
  const [selectedWorkflow, setSelectedWorkflow] = useState<EditScheduledWorkflow | null>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addToastNotification } = useNotifications();
  const [paginationArgs, { nextPage, previousPage }] = usePagination();

  const [{ data: workflows }] = useQuery<WorkflowsQuery, WorkflowsQueryVariables>({
    query: WORKFLOWS_QUERY,
  });
  const [{ data: scheduledWorkflows, fetching: isLoadingSchedules, error }] = useQuery<SchedulesQuery>({
    query: SCHEDULED_WORKFLOWS_QUERY,
    variables: {
      ...paginationArgs,
    },
  });
  const [, onDelete] = useMutation<DeleteScheduleMutation, DeleteScheduleMutationVariables>(DELETE_SCHEDULE_MUTATION);
  const [, onUpdate] = useMutation<EditWorkflowScheduleMutation, EditWorkflowScheduleMutationVariables>(
    UPDATE_SCHEDULE_MUTATION,
  );

  const onEdit = (workflow: EditScheduledWorkflow) => {
    setSelectedWorkflow(workflow);
    onOpen();
  };

  const handleWorkflowUpdate = ({ workflowName, workflowVersion, ...scheduledWf }: EditScheduledWorkflow) => {
    const { cronString, isEnabled, fromDate: performFromDate, performTillDate, workflowContext } = scheduledWf;
    const input = {
      cronString,
      isEnabled,
      performFromDate,
      performTillDate,
      workflowContext: JSON.stringify(workflowContext),
      workflowName,
      workflowVersion,
    };

    if (workflowName == null || workflowVersion == null) {
      addToastNotification({
        content: 'Workflow name and version must be specified',
        type: 'error',
      });
    } else {
      onUpdate({ input, editWorkflowScheduleId: scheduledWf.id })
        .then((res) => {
          if (!res.data?.editWorkflowSchedule) {
            addToastNotification({
              type: 'error',
              title: 'Error',
              content: res.error?.message,
            });
          }
          if (res.data?.editWorkflowSchedule || !res.error) {
            addToastNotification({
              content: 'Schedule successfully updated',
              title: 'Success',
              type: 'success',
            });
          }
        })
        .catch((err) => {
          addToastNotification({
            title: 'Failed to edit scheduled workflow',
            type: 'error',
            content: err.message,
          });
        });
    }
  };

  const handleDeleteBtnClick = (workflow: ScheduledWorkflow) => {
    onDelete({ deleteScheduleId: workflow.id }, context)
      .then((res) => {
        if (!res.data?.deleteSchedule?.isOk) {
          addToastNotification({
            type: 'error',
            title: 'Error',
            content: res.error?.message,
          });
        }
        if (res.data?.deleteSchedule?.isOk || !res.error) {
          addToastNotification({
            content: 'Deleted successfuly',
            title: 'Success',
            type: 'success',
          });
        }
      })
      .catch((err) => {
        addToastNotification({
          type: 'error',
          title: 'Error',
          content: err?.message,
        });
      });
  };

  if (isLoadingSchedules) {
    return <Progress isIndeterminate size="xs" marginTop={-10} />;
  }

  if (error != null || scheduledWorkflows == null) {
    return <div>{error?.message}</div>;
  }

  const schedules =
    scheduledWorkflows?.scheduler.schedules?.edges.filter(omitNullValue).map((edge) => {
      const node = edge?.node;
      const workflowContext = JSON.parse(node?.workflowContext || '{}');
      return { ...node, workflowContext };
    }) ?? [];

  const sortedSchedules = sortBy(schedules, [(u) => u.name?.toLowerCase()]);

  if (sortedSchedules?.length === 0) {
    return (
      <Container maxWidth={1200} mx="auto">
        <Box textAlign="center" marginY={15}>
          There are no scheduled workflows yet
        </Box>
      </Container>
    );
  }

  const clientWorkflows: ClientWorkflow[] =
    workflows?.conductor.workflowDefinitions.edges.map(({ node }) => {
      const parsedLabels = jsonParse<DescriptionJSON>(node.description)?.labels ?? [];
      return {
        ...node,
        labels: parsedLabels,
        hasSchedule: node.hasSchedule ?? false,
        timeoutSeconds: node.timeoutSeconds ?? 0,
      };
    }) ?? [];

  const selectedClientWorkflow = clientWorkflows.find((wf) => wf.name === selectedWorkflow?.workflowName);

  return (
    <Container maxWidth={1200} mx="auto">
      {selectedWorkflow != null && selectedClientWorkflow != null && (
        <EditScheduleWorkflowModal
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
        {!sortedSchedules.length ? null : (
          <>
            <Tbody>
              {sortedSchedules.map((item) => (
                <Tr key={item.id} role="group">
                  <Td>
                    <FormControl display="flex" alignItems="center">
                      <Switch
                        isChecked={item.isEnabled ?? false}
                        onChange={() => {
                          const editedWorkflow = {
                            ...item,
                            isEnabled: !item.isEnabled,
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
                    <Tag colorScheme={getStatusTagColor(item.status || 'UNKNOWN') ?? ''}>{item.status || '-'}</Tag>
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
            <Pagination
              onPrevious={previousPage(scheduledWorkflows.schedules.pageInfo.startCursor)}
              onNext={nextPage(scheduledWorkflows.schedules.pageInfo.endCursor)}
              hasNextPage={scheduledWorkflows.schedules.pageInfo.hasNextPage}
              hasPreviousPage={scheduledWorkflows.schedules.pageInfo.hasPreviousPage}
            />
          </>
        )}
      </Table>
    </Container>
  );
}

export default ScheduledWorkflowList;
