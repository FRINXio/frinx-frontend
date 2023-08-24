import { Button, Container, Flex, Icon, Input, InputGroup, InputLeftElement, useDisclosure } from '@chakra-ui/react';
import { omitNullValue, usePagination, Pagination, TaskDefinition, useNotifications } from '@frinx/shared';
import FeatherIcon from 'feather-icons-react';
import { gql, useMutation, useQuery } from 'urql';
import React, { useMemo, useState } from 'react';
import AddTaskModal from './add-task-modal';
import TaskConfigModal from './task-modal';
import TaskTable from './task-table';
import {
  CreateTaskDefinitionMutation,
  CreateTaskDefinitionMutationVariables,
  DeleteTaskMutation,
  DeleteTaskMutationVariables,
  TaskDefinitionsQuery,
  TaskDefinitionsQueryVariables,
  TasksOrderByInput,
  SortTasksBy,
} from '../../../__generated__/graphql';

const taskDefinition: TaskDefinition = {
  name: '',
  description: '',
  retryCount: 0,
  retryLogic: 'FIXED',
  retryDelaySeconds: 0,
  timeoutPolicy: 'TIME_OUT_WF',
  timeoutSeconds: 60,
  responseTimeoutSeconds: 10,
  inputTemplate: '{}',
  ownerEmail: '',
  inputKeys: [],
  outputKeys: [],
  concurrentExecLimit: null,
  rateLimitFrequencyInSeconds: null,
  rateLimitPerFrequency: null,
};

const TASK_DEFINITIONS_QUERY = gql`
  query TaskDefinitions(
    $filter: FilterTaskDefinitionsInput
    $orderBy: TasksOrderByInput
    $before: String
    $last: Int
    $after: String
    $first: Int
  ) {
    taskDefinitions(filter: $filter, orderBy: $orderBy, before: $before, last: $last, after: $after, first: $first) {
      edges {
        node {
          id
          name
          timeoutPolicy
          timeoutSeconds
          responseTimeoutSeconds
          retryCount
          retryLogic
          retryDelaySeconds
          ownerEmail
        }
      }
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

const DELETE_TASK_DEFINITION_MUTATION = gql`
  mutation DeleteTask($name: String!) {
    deleteTask(name: $name) {
      isOk
    }
  }
`;

const CREATE_TASK_DEFINITION_MUTATION = gql`
  mutation CreateTaskDefinition($input: CreateTaskDefinitionInput!) {
    createTaskDefinition(input: $input) {
      id
      name
      timeoutSeconds
      retryCount
      timeoutPolicy
      retryLogic
      responseTimeoutSeconds
    }
  }
`;

const TaskList = () => {
  const context = useMemo(() => ({ additionalTypenames: ['TaskDefinition'] }), []);
  const [orderBy, setOrderBy] = useState<TasksOrderByInput | null>(null);
  const [task, setTask] = useState<TaskDefinition>();
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToastNotification } = useNotifications();
  const addTaskModal = useDisclosure();
  const taskConfigModal = useDisclosure();
  const [paginationArgs, { nextPage, previousPage }] = usePagination();

  const [{ data: taskData }] = useQuery<TaskDefinitionsQuery, TaskDefinitionsQueryVariables>({
    query: TASK_DEFINITIONS_QUERY,
    variables: {
      ...paginationArgs,
      filter: {
        keyword,
      },
      orderBy,
    },
  });

  const taskDefinitions = (taskData?.taskDefinitions.edges ?? [])
    .map((e) => {
      const { node } = e;
      return {
        ...node,
      };
    })
    .filter(omitNullValue);

  const [, onDelete] = useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DELETE_TASK_DEFINITION_MUTATION);
  const [, onCreate] = useMutation<CreateTaskDefinitionMutation, CreateTaskDefinitionMutationVariables>(
    CREATE_TASK_DEFINITION_MUTATION,
  );

  const handleSort = (value: SortTasksBy) => {
    setOrderBy({ sortKey: value, direction: orderBy?.direction === 'ASC' ? 'DESC' : 'ASC' });
  };

  const handleTaskModal = (tsk: TaskDefinition) => {
    setTask(tsk);
    taskConfigModal.onOpen();
  };

  const handleDeleteTask = (taskToDelete: TaskDefinition) => {
    onDelete({ name: taskToDelete.name }, context)
      .then((res) => {
        if (!res.data?.deleteTask?.isOk) {
          addToastNotification({
            type: 'error',
            title: 'Error',
            content: res.error?.message,
          });
        }
        if (res.data?.deleteTask?.isOk || !res.error) {
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

  const addTask = (tsk: TaskDefinition) => {
    if (tsk.name !== '') {
      const ownerEmail = tsk.ownerEmail || 'example@example.com';
      const responseTimeoutSeconds = Number(tsk?.responseTimeoutSeconds);
      const retryCount = Number(tsk?.retryCount) || null;
      const retryDelaySeconds = Number(tsk?.retryDelaySeconds);
      const timeoutSeconds = Number(tsk?.timeoutSeconds);
      const input = {
        input: {
          ...tsk,
          responseTimeoutSeconds,
          retryCount,
          retryDelaySeconds,
          timeoutSeconds,
          ownerEmail,
          outputKeys: [...new Set(tsk.outputKeys?.filter((outputKey) => outputKey !== ''))],
          inputKeys: [...new Set(tsk.inputKeys?.filter((inputKey) => inputKey !== ''))],
        },
      };

      onCreate(input)
        .then((res) => {
          if (!res.data?.createTaskDefinition?.id) {
            addToastNotification({
              type: 'error',
              title: 'Error',
              content: res.error?.message,
            });
          }
          if (res.data?.createTaskDefinition?.id || !res.error) {
            addToastNotification({
              content: 'Task created successfuly',
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
    }
  };

  return (
    <Container maxWidth={1200} mx="auto">
      <AddTaskModal
        isOpen={addTaskModal.isOpen}
        onSubmit={addTask}
        onClose={addTaskModal.onClose}
        task={taskDefinition}
      />
      {task && <TaskConfigModal isOpen={taskConfigModal.isOpen} onClose={taskConfigModal.onClose} task={task} />}
      <Flex justify="space-between" gap="20px" marginBottom={8}>
        <InputGroup>
          <InputLeftElement>
            <Icon size={20} as={FeatherIcon} icon="Search" color="grey" />
          </InputLeftElement>
          <Input
            value={searchTerm}
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            background="white"
          />
        </InputGroup>
        <Flex gap={1}>
          <Button
            colorScheme="blue"
            onClick={() => {
              setKeyword(searchTerm);
            }}
          >
            Search
          </Button>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => {
              setKeyword('');
              setSearchTerm('');
            }}
          >
            Reset
          </Button>
          <Button colorScheme="blue" variant="outline" onClick={addTaskModal.onOpen}>
            New
          </Button>
        </Flex>
      </Flex>

      <TaskTable
        tasks={taskDefinitions}
        onTaskConfigClick={handleTaskModal}
        onTaskDelete={handleDeleteTask}
        onSort={handleSort}
        orderBy={orderBy}
      />
      {taskData && (
        <Pagination
          onPrevious={previousPage(taskData?.taskDefinitions.pageInfo.startCursor)}
          onNext={nextPage(taskData.taskDefinitions.pageInfo.endCursor)}
          hasNextPage={taskData.taskDefinitions.pageInfo.hasNextPage}
          hasPreviousPage={taskData.taskDefinitions.pageInfo.hasPreviousPage}
        />
      )}
    </Container>
  );
};

export default TaskList;
