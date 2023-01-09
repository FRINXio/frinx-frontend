import React, { useEffect, useRef, useState } from 'react';
import MiniSearch, { SearchResult } from 'minisearch';
import throttle from 'lodash/throttle';
import { Button, Container, Flex, Icon, Input, InputGroup, InputLeftElement, useDisclosure } from '@chakra-ui/react';
import { callbackUtils, TaskDefinition } from '@frinx/shared/src';
import { sortAscBy, sortDescBy } from '@frinx/workflow-ui/src/utils/helpers.utils';
import { usePagination } from '@frinx/workflow-ui/src/common/pagination-hook';
import FeatherIcon from 'feather-icons-react';
import TaskTable from './task-table';
import TaskConfigModal from './task-modal';
import AddTaskModal from './add-task-modal';

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
  const { currentPage, setCurrentPage, pageItems: tasks, setItemList, totalPages } = usePagination<TaskDefinition>();
  const [sorted, setSorted] = useState(false);
  const [task, setTask] = useState<TaskDefinition>();
  const [searchTerm, setSearchTerm] = useState('');
  const { current: minisearch } = useRef(new MiniSearch({ fields: ['name'], idField: 'name' }));
  const addTaskModal = useDisclosure();
  const taskConfigModal = useDisclosure();

  useEffect(() => {
    const { getTaskDefinitions } = callbackUtils.getCallbacks;

    getTaskDefinitions().then((taskDefinitions) => {
      const data = taskDefinitions.sort((a, b) => a.name.localeCompare(b.name)) || [];
      setItemList(data);
    });
  }, [setItemList]);

  useEffect(() => {
    minisearch.addAll(tasks);
  }, [tasks, minisearch]);

  const searchFn = throttle(() => getFilteredResults(minisearch.search(searchTerm, { prefix: true }), tasks), 60);

  const handleTaskModal = (tsk: TaskDefinition) => {
    setTask(tsk);
    taskConfigModal.onOpen();
  };

  const handleDeleteTask = (name: string) => {
    const { deleteTaskDefinition } = callbackUtils.getCallbacks;

    deleteTaskDefinition(name).then((deletedTask) => {
      setItemList(tasks.filter((tsk: TaskDefinition) => tsk.name !== deletedTask.name));
    });
  };

  const sortArray = (key: string) => {
    const sortedArray = tasks;

    sortedArray.sort(sorted ? sortDescBy(key) : sortAscBy(key));
    setSorted(!sorted);
    setItemList(sortedArray);
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

  const result = searchTerm.length > 0 ? searchFn() : tasks;

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
        tasks={result || []}
        onTaskConfigClick={handleTaskModal}
        onTaskDelete={handleDeleteTask}
        pagination={{ currentPage, setCurrentPage, totalPages }}
        sortArray={sortArray}
      />
    </Container>
  );
};

export default TaskList;
