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
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { asyncGenerator, ExecutedWorkflowPayload, getStatusBadgeColor } from './commit-status-modal.helpers';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  workflowId: string;
};

const CommitStatusModal: VoidFunctionComponent<Props> = ({ workflowId, isOpen, onClose }) => {
  const [execPayload, setExecPayload] = useState<ExecutedWorkflowPayload | null>(null);

  useEffect(() => {
    (async () => {
      // we have to use async iterator here, so we turn off this rule
      // eslint-disable-next-line no-restricted-syntax
      for await (const data of asyncGenerator(workflowId)) {
        setExecPayload(data.result);
      }
    })();
  }, [workflowId]);

  const workflowOutput = JSON.stringify(execPayload?.output ?? {}, null, 2);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display="flex" alignItems="center" paddingRight={16}>
          <Heading size="lg">Status</Heading>
          {execPayload && (
            <Badge marginLeft="auto" colorScheme={getStatusBadgeColor(execPayload.status)}>
              {execPayload.status}
            </Badge>
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {execPayload && (
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
                  {execPayload.tasks.map((task) => {
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
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CommitStatusModal;
