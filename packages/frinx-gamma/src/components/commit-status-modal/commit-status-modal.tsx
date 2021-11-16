import {
  Badge,
  Box,
  Button,
  Code,
  Heading,
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
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { getStatusBadgeColor, useAsyncGenerator } from './commit-status-modal.helpers';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  workflowId: string;
};

const CommitStatusModal: VoidFunctionComponent<Props> = ({ workflowId, isOpen, onClose }) => {
  const execPayload = useAsyncGenerator({ workflowId });

  if (execPayload == null) {
    return null;
  }

  const { status, tasks, output } = execPayload;
  const workflowOutput = JSON.stringify(output);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display="flex" alignItems="center" paddingRight={16}>
          <Heading size="lg">Status</Heading>

          <Badge marginLeft="auto" colorScheme={getStatusBadgeColor(status)}>
            {status}
          </Badge>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Task type</Th>
                  <Th>Task name</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tasks.map((task) => {
                  return (
                    <Tr key={task.referenceTaskName}>
                      <Td>{task.seq}</Td>
                      <Td>
                        <Text as="strong">{task.taskType}</Text>
                      </Td>
                      <Td>{task.referenceTaskName}</Td>
                      <Td width={44}>
                        <Badge marginLeft="auto" colorScheme={getStatusBadgeColor(task.status)}>
                          {task.status}
                        </Badge>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
            {workflowOutput !== '{}' && (
              <Box paddingTop={4}>
                <Heading size="md" as="h3" marginBottom={4}>
                  Output
                </Heading>
                <Box as="pre" maxWidth="100%" overflow="scroll">
                  <Code>{workflowOutput}</Code>
                </Box>
              </Box>
            )}
          </>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CommitStatusModal;
