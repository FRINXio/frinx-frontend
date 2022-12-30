import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { callbackUtils, Workflow } from '@frinx/shared/src';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';

const jsonParse = (json?: string | null) => {
  if (json == null) {
    return null;
  }

  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

type Props = {
  deviceIds: string[];
  onClose: () => void;
};

const WorkflowListModal: VoidFunctionComponent<Props> = ({ deviceIds, onClose }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  useEffect(() => {
    const callbacks = callbackUtils.getCallbacks;
    callbacks.getWorkflows().then((wfs) => {
      setWorkflows(wfs);
    });
  }, []);

  const labeledWorkflows = workflows.filter((wf) => {
    const labels: string[] = jsonParse(wf.description)?.labels ?? [];
    return labels.includes('INVENTORY');
  });

  const handleWorkflowClick = () => {
    // eslint-disable-next-line
    console.log(deviceIds);
  };

  return (
    <Modal isOpen onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading as="h2" fontSize="xl" marginBottom={2}>
            Workflows
          </Heading>
          <Text fontSize="md" fontWeight={400}>
            Select workflow to execute
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody maxHeight="3xl" overflowY="auto">
          {labeledWorkflows.map((workflow) => {
            return (
              <Box
                as="button"
                textAlign="left"
                key={workflow.name}
                padding={2}
                borderColor="blackAlpha.200"
                borderBottomWidth={1}
                borderBottomStyle="solid"
                width="full"
                _hover={{
                  background: 'blackAlpha.200',
                }}
                onClick={handleWorkflowClick}
              >
                <Heading as="h4" fontWeight={600} fontSize="md" marginBottom={2}>
                  {workflow.name}
                </Heading>
                <Text as="span" fontSize="sm" color="blackAlpha.800">
                  {jsonParse(workflow.description)?.description}
                </Text>
              </Box>
            );
          })}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="gray">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WorkflowListModal;
