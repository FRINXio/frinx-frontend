// @flow
import AddTaskModal from './add-task-modal';
import PageContainer from '../../../common/PageContainer';
import Paginator from '../../../common/pagination';
import React, { useEffect, useState } from 'react';
import TaskModal from './TaskModal';
import callbackUtils from '../../../utils/callback-utils';
import {
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCode, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { sortAscBy, sortDescBy } from '../workflowUtils';
import { taskDefinition } from '../../../constants';
import { usePagination } from '../../../common/pagination-hook';

const TaskList = () => {
  const [keywords, setKeywords] = useState('');
  const [sorted, setSorted] = useState(false);
  const [data, setData] = useState([]);
  const [taskModal, setTaskModal] = useState(false);
  const [taskName, setTaskName] = useState(null);
  const { currentPage, setCurrentPage, pageItems, setItemList, totalPages } = usePagination([], 10);
  const addTaskModal = useDisclosure();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const results = !keywords
      ? data
      : data.filter((e) => {
          const searchedKeys = [
            'name',
            'timeoutPolicy',
            'timeoutSeconds',
            'responseTimeoutSeconds',
            'retryCount',
            'retryLogic',
          ];

          for (let i = 0; i < searchedKeys.length; i += 1) {
            if (e[searchedKeys[i]].toString().toLowerCase().includes(keywords.toLocaleLowerCase())) {
              return true;
            }
          }
          return false;
        });
    setItemList(results);
  }, [keywords, data]);

  const getData = () => {
    const { getTaskDefinitions } = callbackUtils.getCallbacks;

    getTaskDefinitions().then((taskDefinitions) => {
      const data = taskDefinitions.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)) || [];
      setData(data);
    });
  };

  const handleTaskModal = (name) => {
    const taskName = name !== undefined ? name : null;
    setTaskName(taskName);
    setTaskModal(!taskModal);
  };

  const filteredRows = () => {
    return pageItems.map((e) => {
      return (
        <Tr key={e.name}>
          <Td>{e.name}</Td>
          <Td>{e.timeoutPolicy}</Td>
          <Td>{e.timeoutSeconds}</Td>
          <Td>{e.responseTimeoutSeconds}</Td>
          <Td>{e.retryCount}</Td>
          <Td>{e.retryLogic}</Td>
          <Td textAlign="center">
            <Stack direction="row" spacing={1}>
              <IconButton
                colorScheme="gray"
                isRound
                variant="outline"
                title="Definition"
                icon={<Icon as={FontAwesomeIcon} icon={faFileCode} />}
                onClick={() => handleTaskModal(e.name)}
              />
              <IconButton
                colorScheme="red"
                isRound
                variant="outline"
                onClick={() => deleteTask(e.name)}
                title="Delete"
                icon={<Icon as={FontAwesomeIcon} icon={faTrash} />}
              />
            </Stack>
          </Td>
        </Tr>
      );
    });
  };

  const deleteTask = (name) => {
    const { deleteTaskDefinition } = callbackUtils.getCallbacks;

    deleteTaskDefinition(name).then(() => {
      getData();
    });
  };

  const sortArray = (key) => {
    const sortedArray = data;

    sortedArray.sort(sorted ? sortDescBy(key) : sortAscBy(key));
    setSorted(!sorted);
    setData(sortedArray);
  };

  const taskTable = () => {
    return (
      <Table background="white">
        <Thead>
          <Tr>
            <Th onClick={() => sortArray('name')}>Name/Version</Th>
            <Th onClick={() => sortArray('timeoutPolicy')}>Timeout Policy</Th>
            <Th onClick={() => sortArray('timeoutSeconds')}>Timeout Seconds</Th>
            <Th onClick={() => sortArray('responseTimeoutSeconds')}>Response Timeout</Th>
            <Th onClick={() => sortArray('retryCount')}>Retry Count</Th>
            <Th onClick={() => sortArray('retryLogic')}>Retry Logic</Th>
            <Th textAlign="center">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>{filteredRows()}</Tbody>
        <Tfoot>
          <Tr>
            <Th>
              <Paginator currentPage={currentPage} onPaginationClick={setCurrentPage} pagesCount={totalPages} />
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    );
  };

  const addTask = (task) => {
    Object.keys(task).forEach((key) => {
      if (key === 'inputKeys' || key === 'outputKeys') {
        task[key] = task[key]
          .replace(/ /g, '')
          .split(',')
          .filter((e) => {
            return e !== '';
          });
        task[key] = [...new Set(task[key])];
      }
    });
    if (task['name'] !== '') {
      const newTask = { ...task, ownerEmail: 'example@example.com' };

      const { registerTaskDefinition } = callbackUtils.getCallbacks;

      registerTaskDefinition([newTask]).then(() => {
        window.location.reload();
      });
    }
  };

  const taskModalComp = taskModal ? (
    <TaskModal name={taskName} modalHandler={() => handleTaskModal()} show={taskModal} />
  ) : null;

  return (
    <PageContainer>
      <AddTaskModal
        isOpen={addTaskModal.isOpen}
        onSubmit={addTask}
        onClose={addTaskModal.onClose}
        task={taskDefinition}
      />
      {taskModalComp}
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

      {taskTable()}
    </PageContainer>
  );
};

export default TaskList;
