import {
  Button,
  ButtonGroup,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
} from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Workflow, ClientWorkflow } from '../../helpers/workflow-api.types';
import { jsonParse } from '../../helpers/workflow.helpers';
import { useWorkflowInputsForm } from '../../hooks';
import WorkflowInputsForm from '../workflow-inputs-form/workflow-inputs-form';

type Props = {
  workflow: Workflow | ClientWorkflow;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inputParameters: Record<string, unknown>) => Promise<string | void | null> | null;
};

const ExecuteWorkflowModal: FC<Props> = ({ workflow, isOpen, onClose, onSubmit }) => {
  const { name, description } = workflow;
  const [isExecuting, setIsExecuting] = useState(false);
  const [executedWorkflowId, setExecutedWorkflowId] = useState<string | void | null>(null);

  const { values, inputParameterKeys, parsedInputParameters, submitForm, isSubmitting, setSubmitting, handleChange } =
    useWorkflowInputsForm({
      workflow,
      onSubmit: async (formData) => {
        setIsExecuting(true);

        const id = await onSubmit(formData);

        setSubmitting(false);
        setIsExecuting(false);
        setExecutedWorkflowId(id);
      },
    });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          <Heading as="h2" fontSize="xl" marginBottom={2}>
            {name}
          </Heading>
          <Text fontSize="md" fontWeight={400}>
            {jsonParse<{ description: string }>(description)?.description}
          </Text>
        </ModalHeader>
        <ModalBody maxHeight="3xl" overflowY="auto">
          <WorkflowInputsForm
            values={values}
            inputParameterKeys={inputParameterKeys}
            parsedInputParameters={parsedInputParameters}
            onChange={handleChange}
          />
        </ModalBody>
        <ModalFooter>
          {executedWorkflowId != null && (
            <Button variant="link" colorScheme="blue" as={Link} to={`/workflow-manager/executed/${executedWorkflowId}`}>
              Executed workflow in detail
            </Button>
          )}
          <Spacer />
          <ButtonGroup>
            <Button onClick={onClose} disabled={isExecuting}>
              Close
            </Button>
            <Button
              colorScheme="blue"
              onClick={submitForm}
              isLoading={isExecuting || isSubmitting}
              disabled={isExecuting}
            >
              {isExecuting ? 'Executing workflow' : 'Execute workflow'}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExecuteWorkflowModal;
