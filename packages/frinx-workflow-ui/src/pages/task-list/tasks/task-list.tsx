import { Button, Container, Flex, Icon, Input, InputGroup, InputLeftElement, useDisclosure } from '@chakra-ui/react';
import { omitNullValue, usePagination, Pagination, TaskDefinition, useNotifications } from '@frinx/shared';
import FeatherIcon from 'feather-icons-react';
import { gql, useMutation, useQuery } from 'urql';
import React, { useMemo, useState } from 'react';
import { omitBy, isNull } from 'lodash';
import AddTaskModal from './add-task-modal';
import TaskConfigModal from './task-modal';
import TaskTable from './task-table';
import {
  CreateTaskDefinitionMutation,
  CreateTaskDefinitionMutationVariables,
  DeleteTaskMutation,
  DeleteTaskMutationVariables,
  SortTasksBy,
  TaskDefinitionsQuery,
  TaskDefinitionsQueryVariables,
  TasksOrderByInput,
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
    conductor {
      taskDefinitions(filter: $filter, orderBy: $orderBy, before: $before, last: $last, after: $after, first: $first) {
        edges {
          node {
            id
            name
            timeoutSeconds
            createdAt
            updatedAt
            createdBy
            updatedBy
            description
            retryCount
            pollTimeoutSeconds
            inputKeys
            outputKeys
            inputTemplate
            retryLogic
            retryDelaySeconds
            responseTimeoutSeconds
            concurrentExecLimit
            rateLimitFrequencyInSeconds
            rateLimitPerFrequency
            ownerEmail
            timeoutPolicy
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
  }
`;

const DELETE_TASK_DEFINITION_MUTATION = gql`
  mutation DeleteTask($name: String!) {
    conductor {
      unregisterTaskDef(tasktype: $name)
    }
  }
`;

const CREATE_TASK_DEFINITION_MUTATION = gql`
  mutation CreateTaskDefinition($input: [TaskDef_Input]) {
    conductor {
      registerTaskDef_1(input: $input)
    }
  }
`;

const TaskList = () => {
  const context = useMemo(() => ({ additionalTypenames: ['TaskDefinitions'] }), []);
  const [orderBy, setOrderBy] = useState<TasksOrderByInput | null>(null);
  const [task, setTask] = useState<Partial<TaskDefinition> | undefined>();
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
    context,
  });

  const taskDefinitions = (taskData?.conductor.taskDefinitions.edges ?? [])
    .map((e) => {
      const { node } = e;
      return {
        ...node,
        timeoutPolicy: null, // TODO: FIXME
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
    const filteredTaskData = omitBy(tsk, isNull);

    setTask(filteredTaskData);
    taskConfigModal.onOpen();
  };

  const handleDeleteTask = (taskToDelete: TaskDefinition) => {
    onDelete({ name: taskToDelete.name }, context)
      .then((res) => {
        if (!res.data) {
          addToastNotification({
            type: 'error',
            title: 'Error',
            content: res.error?.message,
          });
        }
        if (res.data || !res.error) {
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
      const ownerEmail = tsk.ownerEmail || '';
      const responseTimeoutSeconds = Number(tsk?.responseTimeoutSeconds);
      const retryCount = Number(tsk?.retryCount) || null;
      const retryDelaySeconds = Number(tsk?.retryDelaySeconds);
      const timeoutSeconds = Number(tsk?.timeoutSeconds);
      const input = {
        input: [
          {
            ...tsk,
            responseTimeoutSeconds,
            retryCount,
            retryDelaySeconds,
            timeoutSeconds,
            ownerEmail,
            outputKeys: [...new Set(tsk.outputKeys?.filter((outputKey) => outputKey !== ''))],
            inputKeys: [...new Set(tsk.inputKeys?.filter((inputKey) => inputKey !== ''))],
          },
        ],
      };

      onCreate(input, context)
        .then((res) => {
          if (res.error != null) {
            addToastNotification({
              type: 'error',
              title: 'Error',
              content: res.error?.message,
            });
          }
          if (res.data?.conductor.registerTaskDef_1 || !res.error) {
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
          onPrevious={previousPage(taskData?.conductor.taskDefinitions.pageInfo.startCursor)}
          onNext={nextPage(taskData.conductor.taskDefinitions.pageInfo.endCursor)}
          hasNextPage={taskData.conductor.taskDefinitions.pageInfo.hasNextPage}
          hasPreviousPage={taskData.conductor.taskDefinitions.pageInfo.hasPreviousPage}
        />
      )}
    </Container>
  );
};

export default TaskList;
