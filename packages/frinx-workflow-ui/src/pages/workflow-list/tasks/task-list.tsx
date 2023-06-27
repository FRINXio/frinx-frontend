import { Button, Container, Flex, Icon, Input, InputGroup, InputLeftElement, useDisclosure } from '@chakra-ui/react';
import { callbackUtils, TaskDefinition } from '@frinx/shared/src';
import FeatherIcon from 'feather-icons-react';
import { orderBy } from 'lodash';
import MiniSearch, { SearchResult } from 'minisearch';
import React, { useEffect, useRef, useState } from 'react';
import { usePagination } from '../../../hooks/use-pagination-hook';
import AddTaskModal from './add-task-modal';
import TaskConfigModal from './task-modal';
import TaskTable from './task-table';

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
};

function getFilteredResults<T extends { name: string }>(searchResult: SearchResult[], defs: T[]): T[] {
  const resultIds = searchResult.map((r) => r.id);
  return defs.filter((df) => resultIds.includes(df.name));
}

const TaskList = () => {
  const { currentPage, setCurrentPage, pageItems, setItemList, totalPages } = usePagination<TaskDefinition>();
  const [sorted, setSorted] = useState(false);
  const [task, setTask] = useState<TaskDefinition>();
  const [tasks, setTasks] = useState<TaskDefinition[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { current: minisearch } = useRef(new MiniSearch({ fields: ['name'], idField: 'name' }));
  const addTaskModal = useDisclosure();
  const taskConfigModal = useDisclosure();

  useEffect(() => {
    const { getTaskDefinitions } = callbackUtils.getCallbacks;

    getTaskDefinitions().then((taskDefinitions) => {
      const data = taskDefinitions.sort((a, b) => a.name.localeCompare(b.name)) || [];
      setTasks(data);
    });
  }, []);

  useEffect(() => {
    minisearch.addAll(tasks);
  }, [tasks, minisearch]);

  useEffect(() => {
    const searchResults = getFilteredResults(minisearch.search(searchTerm, { prefix: true }), tasks);

    if (searchTerm.length > 0) {
      setItemList(searchResults);
    }
    if (!searchTerm.length) {
      setItemList(tasks);
    }
  }, [searchTerm, tasks, minisearch, setItemList]);

  const handleTaskModal = (tsk: TaskDefinition) => {
    setTask(tsk);
    taskConfigModal.onOpen();
  };

  const handleDeleteTask = (taskToDelete: TaskDefinition) => {
    const { deleteTaskDefinition } = callbackUtils.getCallbacks;

    deleteTaskDefinition(taskToDelete.name).then(() => {
      setItemList(tasks.filter((tsk: TaskDefinition) => tsk.name !== taskToDelete.name));
    });
  };

  const sortArray = (key: string) => {
    setItemList(sorted ? orderBy(tasks, [key], ['desc']) : orderBy(tasks, [key], ['asc']));
    setSorted(!sorted);
  };

  const addTask = (tsk: TaskDefinition) => {
    if (tsk.name !== '') {
      const ownerEmail = tsk.ownerEmail || 'example@example.com';
      const { registerTaskDefinition } = callbackUtils.getCallbacks;

      registerTaskDefinition([
        {
          ...tsk,
          ownerEmail,
          outputKeys: [...new Set(tsk.outputKeys?.filter((outputKey) => outputKey !== ''))],
          inputKeys: [...new Set(tsk.inputKeys?.filter((inputKey) => inputKey !== ''))],
        },
      ]).then(() => {
        window.location.reload();
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
