import React, { useEffect, useRef, useState } from 'react';
import MiniSearch, { SearchResult } from 'minisearch';
import { throttle } from 'lodash';
import { Button, Flex, Icon, Input, InputGroup, InputLeftElement, useDisclosure } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import AddTaskModal from './add-task-modal';
import PageContainer from '@frinx/workflow-ui/src/common/PageContainer';
import callbackUtils from '@frinx/workflow-ui/src/utils/callback-utils';
import { sortAscBy, sortDescBy } from '../workflowUtils';
import { taskDefinition } from '@frinx/workflow-ui/src/constants';
import { usePagination } from '@frinx/workflow-ui/src/common/pagination-hook';
import TaskTable from './task-table';
import { TaskDefinition } from '@frinx/workflow-ui/src/helpers/uniflow-types';
import TaskConfigModal from './task-modal';

function getFilteredResults<T extends { name: string }>(searchResult: SearchResult[], defs: T[]): T[] {
  const resultIds = searchResult.map((r) => r.id);
  return defs.filter((df) => resultIds.includes(df.name));
}

const TaskList = () => {
  const {
    currentPage,
    setCurrentPage,
    pageItems: tasks,
    setItemList,
    totalPages,
  } = usePagination<TaskDefinition>([], 10);
  const [sorted, setSorted] = useState(false);
  const [task, setTask] = useState<TaskDefinition>();
  const [searchTerm, setSearchTerm] = useState('');
  const { current: minisearch } = useRef(new MiniSearch({ fields: ['name'], idField: 'name' }));
  const addTaskModal = useDisclosure();
  const taskConfigModal = useDisclosure();

  useEffect(() => {
    const { getTaskDefinitions } = callbackUtils.getCallbacks;

    getTaskDefinitions().then((taskDefinitions) => {
      const data = taskDefinitions.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)) || [];
      setItemList(data);
    });
  }, []);

  useEffect(() => {
    minisearch.addAll(tasks);
  }, [tasks, minisearch]);

  const searchFn = throttle(() => getFilteredResults(minisearch.search(searchTerm, { prefix: true }), tasks), 60);

  const handleTaskModal = (task: TaskDefinition) => {
    setTask(task);
    taskConfigModal.onOpen();
  };

  const handleDeleteTask = (name: string) => {
    const { deleteTaskDefinition } = callbackUtils.getCallbacks;

    deleteTaskDefinition(name).then((deletedTask) => {
      setItemList(tasks.filter((task: TaskDefinition) => task.name !== deletedTask.name));
    });
  };

  const sortArray = (key: string) => {
    const sortedArray = tasks;

    sortedArray.sort(sorted ? sortDescBy(key) : sortAscBy(key));
    setSorted(!sorted);
    setItemList(sortedArray);
  };

  const addTask = (task: TaskDefinition) => {
    Object.keys(task).forEach((key) => {
      if (key === 'inputKeys' || key === 'outputKeys') {
        task[key] = task[key]?.filter((e) => {
          return e !== '';
        });
        task[key] = [...new Set(task[key])];
      }
    });
    if (task['name'] !== '') {
      const ownerEmail = task.ownerEmail || 'example@example.com';
      const newTask = { ...task, ownerEmail };

      const { registerTaskDefinition } = callbackUtils.getCallbacks;

      registerTaskDefinition([newTask]).then(() => {
        window.location.reload();
      });
    }
  };

  const result = searchTerm.length > 2 ? searchFn() : tasks;

  return (
    <PageContainer>
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
            <Icon as={FontAwesomeIcon} icon={faSearch} color="grey" />
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
    </PageContainer>
  );
};

export default TaskList;
