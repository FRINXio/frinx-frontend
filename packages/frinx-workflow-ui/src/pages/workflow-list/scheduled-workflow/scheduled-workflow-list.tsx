import React, { useEffect, useState } from 'react';
import {
  Button,
  Heading,
  Box,
  ButtonGroup,
  Stack,
  FormControl,
  Switch,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Tag,
  Code,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import sortBy from 'lodash/sortBy';
import FeatherIcon from 'feather-icons-react';
import PageContainer from '../../../common/PageContainer';
import PaginationPages from '../../../common/Pagination';
import { usePagination } from '../../../common/PaginationHook';
import callbackUtils from '../../../utils/callback-utils';
import SchedulingModal from './scheduled-workflow-modal/scheduled-workflow-modal';
import { ScheduledWorkflow, StatusType } from '../../../types/types';

function ScheduledWorkflowList() {
  const { currentPage, setCurrentPage, pageItems, setItemList, totalPages } = usePagination([], 10);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ScheduledWorkflow>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  function getData() {
    const getSchedules = callbackUtils.getSchedulesCallback();

    getSchedules()
      .then((schedules) => {
        setItemList(sortBy(schedules, ['name']));
      })
      .catch((err: Error) => {
        toast({
          title: err?.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
  }

  useEffect(() => {
    getData();
  }, []);

  function onEdit(workflow: ScheduledWorkflow) {
    setSelectedWorkflow(workflow);
    onOpen();
  }

  function handleWorkflowUpdate(scheduledWf: ScheduledWorkflow) {
    const registerSchedule = callbackUtils.registerScheduleCallback();

    registerSchedule(scheduledWf.workflowName, scheduledWf.workflowVersion, scheduledWf)
      .then((res) => {
        toast({
          title: res.message,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        getData();
      })
      .catch((err) => {
        toast({
          title: err.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      });
  }

  const handleDeleteBtnClick = (workflow: ScheduledWorkflow) => {
    const deleteSchedule = callbackUtils.deleteScheduleCallback();
    deleteSchedule(workflow.workflowName, workflow.workflowVersion)
      .then(() => {
        toast({
          title: 'Deleted successfuly',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        getData();
      })
      .catch((err) => {
        toast({
          title: err?.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
  };

  function getStatusTagColor(status: StatusType) {
    switch (status) {
      case 'COMPLETED':
        return 'green';
      case 'RUNNING':
        return 'cyan';
      case 'FAILED':
        return 'red';
      default:
        return null;
    }
  }

  if (!pageItems.length) {
    return <p>Loading...</p>;
  }

  return (
    <PageContainer>
      {isOpen && selectedWorkflow != null && (
        <SchedulingModal
          scheduledWorkflow={selectedWorkflow}
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleWorkflowUpdate}
        />
      )}
      <Table background="white">
        <Thead>
          <Tr>
            <Th>Active</Th>
            <Th>Name/Version</Th>
            <Th>Last Status</Th>
            <Th>Cron expression</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pageItems.map((item: ScheduledWorkflow) => (
            <Tr key={item.name} role="group">
              <Td>
                <FormControl display="flex" alignItems="center">
                  <Switch
                    isChecked={item.enabled}
                    onChange={() => {
                      const editedWorkflow = {
                        ...item,
                        enabled: !item.enabled,
                      };

                      handleWorkflowUpdate(editedWorkflow);
                    }}
                  />
                </FormControl>
              </Td>
              <Td>
                <Heading as="h6" size="xs">
                  {item.name}
                </Heading>
              </Td>
              <Td>
                <Tag colorScheme={getStatusTagColor(item.status) ?? ''}>{item.status || '-'}</Tag>
              </Td>
              <Td>
                <Code>{item.cronString}</Code>
              </Td>
              <Td>
                <Stack direction="row" spacing={4}>
                  <ButtonGroup>
                    <Button
                      colorScheme="red"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        handleDeleteBtnClick(item);
                      }}
                    >
                      <Box as="span" flexShrink={0} alignSelf="center">
                        <Box
                          as={FeatherIcon}
                          size="1em"
                          icon="trash-2"
                          flexShrink={0}
                          lineHeight={4}
                          verticalAlign="middle"
                        />
                      </Box>
                    </Button>
                    <Button colorScheme="black" size="sm" variant="outline" onClick={() => onEdit(item)}>
                      <Box as="span" flexShrink={0} alignSelf="center">
                        <Box
                          as={FeatherIcon}
                          size="1em"
                          icon="edit"
                          flexShrink={0}
                          lineHeight={4}
                          verticalAlign="middle"
                        />
                      </Box>
                    </Button>
                  </ButtonGroup>
                </Stack>
              </Td>
            </Tr>
          ))}
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
}

export default ScheduledWorkflowList;
