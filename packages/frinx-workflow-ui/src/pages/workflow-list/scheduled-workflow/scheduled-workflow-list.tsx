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
  useDisclosure,
  Progress,
  Container,
} from '@chakra-ui/react';
import sortBy from 'lodash/sortBy';
import FeatherIcon from 'feather-icons-react';
import { usePagination } from '@frinx/workflow-ui/src/common/pagination-hook';
import callbackUtils from '@frinx/workflow-ui/src/utils/callback-utils';
import SchedulingModal from '../../../common/modals/scheduled-workflow-modal';
import { ScheduledWorkflow, StatusType } from '@frinx/workflow-ui/src/helpers/types';
import Paginator from '@frinx/workflow-ui/src/common/pagination';
import { useNotifications } from '@frinx/shared/src';

function ScheduledWorkflowList() {
  const { currentPage, setCurrentPage, pageItems, setItemList, totalPages } = usePagination<ScheduledWorkflow>([], 10);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ScheduledWorkflow>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addToastNotification } = useNotifications();

  function getData() {
    const { getSchedules } = callbackUtils.getCallbacks;

    getSchedules()
      .then((schedules) => {
        setItemList(sortBy(schedules, ['name']));
      })
      .catch((err: Error) => {
        addToastNotification({
          content: err.message,
          type: 'error',
          title: 'Error',
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

  function handleWorkflowUpdate(scheduledWf: Partial<ScheduledWorkflow>) {
    const { registerSchedule } = callbackUtils.getCallbacks;

    registerSchedule(scheduledWf.workflowName!, scheduledWf.workflowVersion!, scheduledWf)
      .then((res) => {
        addToastNotification({
          content: 'Schedule successfully registered',
          type: 'success',
          title: 'Success',
        });
        getData();
      })
      .catch((err) => {
        addToastNotification({
          title: 'Failed to schedule workflow',
          type: 'error',
          content: err.message,
        });
      });
  }

  const handleDeleteBtnClick = (workflow: ScheduledWorkflow) => {
    const { deleteSchedule } = callbackUtils.getCallbacks;
    deleteSchedule(workflow.workflowName, String(workflow.workflowVersion))
      .then(() => {
        addToastNotification({
          content: 'Deleted successfuly',
          title: 'Success',
          type: 'success',
        });
        getData();
      })
      .catch((err) => {
        addToastNotification({
          type: 'error',
          title: 'Error',
          content: err?.message,
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

  if (!pageItems == null) {
    return <Progress isIndeterminate size="xs" marginTop={-10} />;
  }

  if (!pageItems.length) {
    return (
      <Container maxWidth={1200} mx="auto">
        <Box textAlign="center" marginY={15}>
          There are no scheduled workflows yet
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={1200} mx="auto">
      {selectedWorkflow != null && (
        <SchedulingModal
          workflow={selectedWorkflow}
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
        {!pageItems.length ? null : (
          <>
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
                  <Paginator currentPage={currentPage} onPaginationClick={setCurrentPage} pagesCount={totalPages} />
                </Th>
              </Tr>
            </Tfoot>
          </>
        )}
      </Table>
    </Container>
  );
}

export default ScheduledWorkflowList;
