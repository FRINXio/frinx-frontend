import { Button, Container, Flex, Icon, Input, InputGroup, InputLeftElement, useDisclosure } from '@chakra-ui/react';
import { callbackUtils, omitNullValue, TaskDefinition, useNotifications } from '@frinx/shared/src';
import FeatherIcon from 'feather-icons-react';
import { orderBy } from 'lodash';
import { gql, useMutation, useQuery } from 'urql';
import MiniSearch, { SearchResult } from 'minisearch';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePagination } from '../../../hooks/use-pagination-hook';
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
  query TaskDefinitions {
    taskDefinitions {
      name
      timeoutSeconds
      description
      retryCount
      pollTimeoutSeconds
      inputKeys
      outputKeys
      inputTemplate
      timeoutPolicy
      retryLogic
      retryDelaySeconds
      responseTimeoutSeconds
      concurrentExecLimit
      rateLimitFrequencyInSeconds
      rateLimitPerFrequency
      ownerEmail
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
      version
      name
      timeoutSeconds
      createTime
      updateTime
      createdBy
      updatedBy
      description
      retryCount
      pollTimeoutSeconds
      inputKeys
      outputKeys
      inputTemplate
      timeoutPolicy
      retryLogic
      retryDelaySeconds
      responseTimeoutSeconds
      concurrentExecLimit
      rateLimitFrequencyInSeconds
      rateLimitPerFrequency
      ownerEmail
    }
  }
`;

function getFilteredResults<T extends { name: string }>(searchTerm: string, defs: T[]): T[] {
  return defs.filter((df) => df.name.toLowerCase().includes(searchTerm.toLowerCase()));
}

const TaskList = () => {
  const context = useMemo(() => ({ additionalTypenames: ['TaskDefinition'] }), []);
  const { currentPage, setCurrentPage, pageItems, setItemList, totalPages } = usePagination<TaskDefinition>();
  const [sorted, setSorted] = useState(false);
  const [task, setTask] = useState<TaskDefinition>();
  const [tasks, setTasks] = useState<TaskDefinition[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToastNotification } = useNotifications();
  const addTaskModal = useDisclosure();
  const taskConfigModal = useDisclosure();

  const [{ data: taskData }] = useQuery<TaskDefinitionsQuery, TaskDefinitionsQueryVariables>({
    query: TASK_DEFINITIONS_QUERY,
  });

  const [, onDelete] = useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DELETE_TASK_DEFINITION_MUTATION);
  const [, onCreate] = useMutation<CreateTaskDefinitionMutation, CreateTaskDefinitionMutationVariables>(
    CREATE_TASK_DEFINITION_MUTATION,
  );

  const sortedTasks =
    (taskData?.taskDefinitions || []).sort((a, b) => a.name.localeCompare(b.name)) || [].filter(omitNullValue);

  useEffect(() => {
    if (searchTerm.length > 0) {
      setItemList(getFilteredResults(searchTerm, sortedTasks));
    }
    if (!searchTerm.length) {
      setItemList(sortedTasks);
    }
  }, [searchTerm, taskData]);

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

  const sortArray = (key: string) => {
    setItemList(sorted ? orderBy(sortedTasks, [key], ['desc']) : orderBy(sortedTasks, [key], ['asc']));
    setSorted(!sorted);
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
  const taskDefinitions = searchTerm
    ? pageItems.filter((task) => {
        !task.name.includes(searchTerm);
      })
    : pageItems;

  return (
    <Container maxWidth={1200} mx="auto">
      <AddTaskModal
        isOpen={addTaskModal.isOpen}
        onSubmit={addTask}
        onClose={addTaskModal.onClose}
        task={taskDefinition}
      />
      {task && <TaskConfigModal isOpen={taskConfigModal.isOpen} onClose={taskConfigModal.onClose} task={task} />}
      <Flex marginBottom={8}>
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
        <Button marginLeft={4} colorScheme="blue" onClick={addTaskModal.onOpen}>
          New
        </Button>
      </Flex>

      <TaskTable
        tasks={pageItems}
        onTaskConfigClick={handleTaskModal}
        onTaskDelete={handleDeleteTask}
        pagination={{ currentPage, setCurrentPage, totalPages }}
        sortArray={sortArray}
      />
    </Container>
  );
};

export default TaskList;
