// @flow
import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow';
import AceEditor from 'react-ace';
import PageContainer from '../../../common/PageContainer';
import PaginationPages from '../../../common/Pagination';
import callbackUtils from '../../../utils/callbackUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { usePagination } from '../../../common/PaginationHook';

const EventListeners = () => {
  const [eventListeners, setEventListeners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { currentPage, setCurrentPage, pageItems, setItemList, totalPages } = usePagination([], 10);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const results = !searchTerm
      ? eventListeners
      : eventListeners.filter((e) => {
          const searchedKeys = ['name', 'event'];
          for (let i = 0; i < searchedKeys.length; i += 1) {
            if (e[searchedKeys[i]].toString().toLowerCase().includes(searchTerm.toLocaleLowerCase())) {
              return true;
            }
          }
          return false;
        });
    setItemList(results);
  }, [searchTerm, eventListeners]);

  const getData = () => {
    const getEventListeners = callbackUtils.getEventListenersCallback();

    getEventListeners().then((eventListeners) => {
      if (Array.isArray(eventListeners)) {
        setEventListeners(eventListeners);
      }
    });
  };

  const editEvent = (state, event) => {
    if (state !== null) {
      event.active = state;
    }

    const registerEventListener = callbackUtils.registerEventListenerCallback();

    registerEventListener(event)
      .then(() => {
        getData();
      })
      .catch((err) => {
        alert(err);
      });
    setSelectedEvent(null);
  };

  const deleteEvent = (name) => {
    const deleteEventListener = callbackUtils.deleteEventListenerCallback();

    deleteEventListener(name)
      .then(() => {
        getData();
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const parseJSON = (data) => {
    try {
      const parsedJSON = JSON.parse(data);
      setSelectedEvent(parsedJSON);
    } catch (e) {
      console.log(e);
    }
  };

  const editModal = () => (
    <Modal size="3xl" isOpen={selectedEvent !== null} onClose={() => setSelectedEvent(null)}>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>Edit {selectedEvent?.name}</ModalHeader>
        <ModalBody>
          <AceEditor
            mode="javascript"
            theme="tomorrow"
            width="100%"
            height="300px"
            onChange={(data) => parseJSON(data)}
            fontSize={16}
            value={JSON.stringify(selectedEvent, null, 2)}
            wrapEnabled={true}
            setOptions={{
              showPrintMargin: true,
              highlightActiveLine: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button marginRight={4} colorScheme="blue" onClick={() => editEvent(null, selectedEvent)}>
            Save
          </Button>
          <Button onClick={() => setSelectedEvent(null)}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <PageContainer>
      {editModal()}
      <InputGroup marginBottom={8}>
        <InputLeftElement>
          <Icon as={FontAwesomeIcon} icon={faSearch} color="grey" />
        </InputLeftElement>
        <Input value={searchTerm} placeholder="Search..." onChange={handleChange} background="white" />
      </InputGroup>

      <Table background="white">
        <Thead>
          <Tr>
            <Th>Active</Th>
            <Th>Name</Th>
            <Th>Sink</Th>
            <Th>Workflow Name</Th>
            <Th>Event Task Name</Th>
            <Th>Action</Th>
            <Th textAlign="center">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pageItems.map((e) => {
            return (
              <Tr key={e.event}>
                <Td textAlign="center">
                  <Checkbox onChange={() => editEvent(!e.active, e)} isChecked={e.active} />
                </Td>
                <Td>{e.name}</Td>
                <Td>{e.event.split(':')[0]}</Td>
                <Td>{e.event.split(':')[1]}</Td>
                <Td>{e.event.split(':')[2]}</Td>
                <Td>{e.actions[0].action}</Td>
                <Td textAlign="center">
                  <Button colorScheme="blue" onClick={() => setSelectedEvent(e)}>
                    Edit
                  </Button>
                  <IconButton
                    icon={<Icon as={FontAwesomeIcon} icon={faTrash} />}
                    variant="outline"
                    isRound
                    colorScheme="red"
                    onClick={() => deleteEvent(e.name)}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>
              <PaginationPages totalPages={totalPages} currentPage={currentPage} changePageHandler={setCurrentPage} />
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    </PageContainer>
  );
};

export default EventListeners;
