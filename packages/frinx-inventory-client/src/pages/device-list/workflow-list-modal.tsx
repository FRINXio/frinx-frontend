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
import { jsonParse } from '@frinx/shared';
import React, { VoidFunctionComponent } from 'react';
import { gql, useQuery } from 'urql';
import { convertGraphqlToClientWorkflow, ModalWorkflow } from '../../helpers/convert';
import { ModalWorkflowsQuery } from '../../__generated__/graphql';

const MODAL_WORKFLOWS_QUERY = gql`
  query ModalWorkflows {
    conductor {
      getAll {
        name
        description
        version
        createdBy
        updatedBy
        inputParameters
        outputParameters
        restartable
        timeoutSeconds
        timeoutPolicy
        ownerEmail
        schemaVersion
        variables
      }
    }
  }
`;

type Props = {
  onClose: () => void;
  onWorkflowSelect: (workflow: ModalWorkflow) => void;
};

const WorkflowListModal: VoidFunctionComponent<Props> = ({ onClose, onWorkflowSelect }) => {
  const [{ data: workflowsData }] = useQuery<ModalWorkflowsQuery>({
    query: MODAL_WORKFLOWS_QUERY,
  });

  if (workflowsData == null) {
    return null;
  }

  const workflows = convertGraphqlToClientWorkflow(workflowsData);

  const labeledWorkflows = workflows.filter((wf) => {
    const labels = jsonParse<{ labels: string[] }>(wf.description)?.labels ?? [];
    return labels.includes('INVENTORY');
  });

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
                onClick={() => {
                  onWorkflowSelect(workflow);
                }}
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
