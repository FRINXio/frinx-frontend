import AddTaskModal from './add-task-modal';
import PageContainer from '../../../common/PageContainer';
import React, { useEffect, useState } from 'react';
import callbackUtils from '../../../utils/callback-utils';
import { Button, Flex, Icon, Input, InputGroup, InputLeftElement, useDisclosure } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { sortAscBy, sortDescBy } from '../workflowUtils';
import { taskDefinition } from '../../../constants';
import { usePagination } from '../../../common/PaginationHook';
import TaskTable from './task-table';
import { TaskDefinition } from '../../../types/uniflow-types';
import TaskConfigModal from './task-modal';

const TaskList = () => {
  const [keywords, setKeywords] = useState('');
  const [sorted, setSorted] = useState(false);
  const [task, setTask] = useState<TaskDefinition>();
  const { currentPage, setCurrentPage, pageItems, setItemList, totalPages } = usePagination([], 10);
  const addTaskModal = useDisclosure();
  const taskConfigModal = useDisclosure();

  useEffect(() => {
    const { getTaskDefinitions } = callbackUtils.getCallbacks;

    getTaskDefinitions().then((taskDefinitions) => {
      const data = taskDefinitions.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)) || [];
      setItemList(data);
    });
  }, []);

  const handleTaskModal = (task: TaskDefinition) => {
    setTask(task);
    taskConfigModal.onOpen();
  };

  const handleDeleteTask = (name: string) => {
    const { deleteTaskDefinition } = callbackUtils.getCallbacks;

    deleteTaskDefinition(name).then((deletedTask) => {
      setItemList(pageItems.filter((task: TaskDefinition) => task.name !== deletedTask.name));
    });
  };

  const sortArray = (key: string) => {
    const sortedArray = pageItems;

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
            value={keywords}
            placeholder="Search..."
            onChange={(e) => setKeywords(e.target.value)}
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
    </PageContainer>
  );
};

export default TaskList;
