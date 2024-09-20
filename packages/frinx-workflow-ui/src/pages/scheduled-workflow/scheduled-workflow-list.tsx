import React, { useMemo, useState } from 'react';
import {
  Heading,
  Box,
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
  Flex,
  IconButton,
  Button,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import {
  omitNullValue,
  useNotifications,
  StatusType,
  ClientWorkflow,
  CreateScheduledWorkflow,
  unwrap,
} from '@frinx/shared';
import { sortBy } from 'lodash';
import { gql, useQuery, useMutation } from 'urql';
import {
  CreateScheduleInput,
  CreateScheduleMutation,
  CreateScheduleMutationVariables,
  DeleteScheduleMutation,
  DeleteScheduleMutationVariables,
  SchedulesQuery,
  UpdateScheduleMutation,
  UpdateScheduleMutationVariables,
  WorkflowListQuery,
} from '../../__generated__/graphql';
import EditScheduleWorkflowModal from '../../components/modals/edit-schedule-workflow-modal';
import CreateScheduleWorkflowModal from '../../components/modals/create-schedule-workflow-modal';

const WORKFLOWS_QUERY = gql`
  query WorkflowList {
    conductor {
      workflowDefinitions {
        edges {
          node {
            id
            name
            description {
              description
              labels
            }
            version
            createdAt
            updatedAt
            updatedBy
            createdBy
            hasSchedule
            inputParameters
            timeoutSeconds
            timeoutPolicy
            ownerEmail
            restartable
            outputParameters {
              key
              value
            }
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

const CREATE_SCHEDULE_MUTATION = gql`
  mutation CreateSchedule($input: CreateScheduleInput!) {
    scheduler {
      createSchedule(input: $input) {
        name
        enabled
        workflowName
        workflowVersion
        cronString
        workflowContext
        fromDate
        toDate
      }
    }
  }
`;

const DELETE_SCHEDULE_MUTATION = gql`
  mutation DeleteSchedule($name: String!) {
    scheduler {
      deleteSchedule(name: $name)
    }
  }
`;

const UPDATE_SCHEDULE_MUTATION = gql`
  mutation UpdateSchedule($name: String!, $input: UpdateScheduleInput!) {
    scheduler {
      updateSchedule(name: $name, input: $input) {
        name
        workflowName
        workflowVersion
        cronString
        workflowContext
        enabled
        fromDate
        toDate
        parallelRuns
      }
    }
  }
`;
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
  const [selectedWorkflow, setSelectedWorkflow] = useState<CreateScheduledWorkflow | null>();
  const createScheduleDisclosure = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addToastNotification } = useNotifications();

  const [{ data: workflows }] = useQuery<WorkflowListQuery>({
    query: WORKFLOWS_QUERY,
  });
  const [{ data: scheduledWorkflows, fetching: isLoadingSchedules, error }] = useQuery<SchedulesQuery>({
    query: SCHEDULED_WORKFLOWS_QUERY,
    requestPolicy: 'cache-and-network',
  });
  const [, createSchedule] = useMutation<CreateScheduleMutation, CreateScheduleMutationVariables>(
    CREATE_SCHEDULE_MUTATION,
  );
  const [, deleteSchedule] = useMutation<DeleteScheduleMutation, DeleteScheduleMutationVariables>(
    DELETE_SCHEDULE_MUTATION,
  );
  const [, updateSchedule] = useMutation<UpdateScheduleMutation, UpdateScheduleMutationVariables>(
    UPDATE_SCHEDULE_MUTATION,
  );

  const handleOnCreateClick = () => {
    createScheduleDisclosure.onOpen();
  };

  const handleOnEditClick = (workflow: CreateScheduledWorkflow) => {
    setSelectedWorkflow(workflow);
    onOpen();
  };

  const handleCreateWorkflow = (scheduledWf: CreateScheduleInput) => {
    const scheduleInput = {
      ...scheduledWf,
      cronString: unwrap(scheduledWf.cronString),
    };
    if (scheduledWf.workflowName != null && scheduledWf.workflowVersion != null) {
      createSchedule({ input: scheduleInput })
        .then((res) => {
          if (!res.data?.scheduler.createSchedule) {
            addToastNotification({
              type: 'error',
              title: 'Error',
              content: res.error?.message,
            });
          }
          if (res.data?.scheduler.createSchedule || !res.error) {
            addToastNotification({
              content: 'Successfully scheduled',
              title: 'Success',
              type: 'success',
            });
          }
        })
        .catch(() => {
          addToastNotification({
            type: 'error',
            title: 'Error',
            content: 'Failed to schedule workflow',
          });
        });
    }
  };

  const handleWorkflowUpdate = ({ workflowName, workflowVersion, ...scheduledWf }: CreateScheduledWorkflow) => {
    const { cronString, enabled, fromDate, toDate, workflowContext } = scheduledWf;
    const input = {
      cronString,
      enabled,
      fromDate: fromDate !== '' ? fromDate : null,
      toDate: toDate !== '' ? toDate : null,
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
      updateSchedule({ input, name: scheduledWf.name })
        .then((res) => {
          if (!res.data?.scheduler.updateSchedule) {
            addToastNotification({
              type: 'error',
              title: 'Error',
              content: res.error?.message,
            });
          }
          if (res.data?.scheduler.updateSchedule || !res.error) {
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

  const handleDeleteBtnClick = (workflow: CreateScheduledWorkflow) => {
    deleteSchedule({ name: workflow.name }, context)
      .then((res) => {
        if (!res.data?.scheduler.deleteSchedule) {
          addToastNotification({
            type: 'error',
            title: 'Error',
            content: res.error?.message,
          });
        }
        if (res.data?.scheduler.deleteSchedule || !res.error) {
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

  // TODO: FIXME
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
      return {
        ...node,
        description: node.description?.description ?? '',
        labels: node.description?.labels ?? [],
        hasSchedule: node.hasSchedule ?? false,
        timeoutSeconds: node.timeoutSeconds ?? 0,
      };
    }) ?? [];

  const selectedClientWorkflow = clientWorkflows.find((wf) => wf.name === selectedWorkflow?.workflowName);

  return (
    <Container maxWidth="container.xl" mx="auto">
      <Flex justify="space-between" align="center" marginBottom={6}>
        <Heading as="h1" size="xl">
          Scheduled workflows
        </Heading>
        <Box marginLeft="auto">
          <Button colorScheme="blue" onClick={handleOnCreateClick}>
            Schedule workflow
          </Button>
        </Box>
      </Flex>
      <CreateScheduleWorkflowModal
        workflows={clientWorkflows}
        isOpen={createScheduleDisclosure.isOpen}
        onClose={() => {
          createScheduleDisclosure.onClose();
        }}
        onSubmit={handleCreateWorkflow}
      />

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
            <Th>Name</Th>
            <Th>Last Status</Th>
            <Th>Cron expression</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        {!sortedSchedules.length ? null : (
          <Tbody>
            {sortedSchedules.map((item) => (
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
                  <Tag colorScheme={getStatusTagColor(item.status || 'UNKNOWN') ?? ''}>{item.status || '-'}</Tag>
                </Td>
                <Td>
                  <Code>{item.cronString}</Code>
                </Td>
                <Td>
                  <Stack direction="row" spacing={2}>
                    <IconButton
                      aria-label="edit scheduled workflow"
                      size="sm"
                      onClick={() => {
                        handleOnEditClick(item);
                      }}
                      icon={<FeatherIcon size={12} icon="edit" />}
                    />
                    <IconButton
                      aria-label="remove scheduled workflow"
                      icon={<FeatherIcon size={12} icon="trash-2" />}
                      colorScheme="red"
                      size="sm"
                      onClick={() => {
                        handleDeleteBtnClick(item);
                      }}
                    />
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        )}
      </Table>
      {/*
      <Pagination
        onPrevious={previousPage(scheduledWorkflows.scheduler.schedules?.pageInfo.startCursor)}
        onNext={nextPage(scheduledWorkflows.scheduler.schedules?.pageInfo.endCursor)}
        hasNextPage={scheduledWorkflows.scheduler.schedules?.pageInfo.hasNextPage ?? false}
        hasPreviousPage={scheduledWorkflows.scheduler.schedules?.pageInfo.hasPreviousPage ?? false}
      />
      */}
    </Container>
  );
}

export default ScheduledWorkflowList;
