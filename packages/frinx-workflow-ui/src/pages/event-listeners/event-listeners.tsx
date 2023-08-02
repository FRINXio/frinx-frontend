import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Container,
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
  Stack,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import { Editor, useNotifications, callbackUtils, EListener } from '@frinx/shared/src';
import Paginator from '../../components/pagination';
import { usePagination } from '../../hooks/use-pagination-hook';

const EventListeners = () => {
  const [eventListeners, setEventListeners] = useState<EListener[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EListener | null>(null);
  const { currentPage, setCurrentPage, pageItems, setItemList, totalPages } = usePagination<EListener>();
  const { addToastNotification } = useNotifications();
  const toast = useToast();

  const getData = () => {
    const { getEventListeners } = callbackUtils.getCallbacks;

    getEventListeners().then((listeners) => {
      if (Array.isArray(listeners)) {
        setEventListeners(listeners);
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const results = !searchTerm
      ? eventListeners
      : eventListeners.filter((e: EListener) => {
          const searchedKeys: Array<keyof EListener> = ['name', 'event'];
          for (let i = 0; i < searchedKeys.length; i += 1) {
            if (e[searchedKeys[i]]?.toString().toLowerCase().includes(searchTerm.toLocaleLowerCase())) {
              return true;
            }
          }
          return false;
        });
    setItemList(results);
  }, [searchTerm, eventListeners, setItemList]);

  const editEvent = (state: boolean | null, event: EListener | null) => {
    if (!event) {
      return;
    }

    const { registerEventListener } = callbackUtils.getCallbacks;

    registerEventListener({
      ...event,
      active: state !== null ? state : event.active,
    })
      .then(() => {
        getData();
        addToastNotification({
          content: 'Event listener registered',
          type: 'success',
        });
      })
      .catch((err) => {
        addToastNotification({
          content: `Failed to register event listener: ${err}`,
          type: 'error',
        });
      });
    setSelectedEvent(null);
  };

  const deleteEvent = (name: string) => {
    const { deleteEventListener } = callbackUtils.getCallbacks;

    deleteEventListener(name)
      .then(() => {
        getData();
        addToastNotification({
          content: 'Event listener deleted',
          type: 'success',
        });
      })
      .catch((err) => {
        addToastNotification({
          content: `Failed to delete event listener: ${err}`,
          type: 'error',
        });
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const parseJSON = (data: string | undefined) => {
    try {
      const parsedJSON = JSON.parse(data ?? '');
      setSelectedEvent(parsedJSON);
    } catch (e) {
      toast({
        title: 'Invalid JSON',
        description: 'Please check the JSON syntax',
        status: 'error',
        duration: 500,
        isClosable: true,
      });
    }
  };

  const editModal = () => (
    <Modal size="3xl" isOpen={selectedEvent !== null} onClose={() => setSelectedEvent(null)}>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>Edit {selectedEvent?.name}</ModalHeader>
        <ModalBody>
          <Editor onChange={(data) => parseJSON(data)} value={JSON.stringify(selectedEvent, null, 2)} />
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
    <Container maxWidth={1200} mx="auto">
      {editModal()}
      <InputGroup marginBottom={8}>
        <InputLeftElement>
          <Icon size={20} as={FeatherIcon} icon="search" color="grey" />
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
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      icon={<Icon size={20} as={FeatherIcon} icon="edit" />}
                      variant="outline"
                      isRound
                      colorScheme="gray"
                      onClick={() => setSelectedEvent(e)}
                      aria-label="edit"
                    />
                    <IconButton
                      icon={<Icon size={20} as={FeatherIcon} icon="trash-2" />}
                      variant="outline"
                      isRound
                      colorScheme="red"
                      onClick={() => deleteEvent(e.name)}
                      aria-label="delete"
                    />
                  </Stack>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>
              <Paginator currentPage={currentPage} onPaginationClick={setCurrentPage} pagesCount={totalPages} />
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    </Container>
  );
};

export default EventListeners;
