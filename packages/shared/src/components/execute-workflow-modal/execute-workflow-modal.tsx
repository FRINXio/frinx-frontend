import {
  Button,
  ButtonGroup,
  Grid,
  GridItem,
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
import { useFormik } from 'formik';
import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Workflow, GraphqlWorkflow } from '../../helpers/workflow-api.types';
import {
  getDynamicInputParametersFromWorkflow,
  getInitialValuesFromParsedInputParameters,
  jsonParse,
  parseInputParameters,
} from '../../helpers/workflow.helpers';
import ExecuteWorkflowModalFormInput from './execute-workflow-modal-form-input';

type Props = {
  workflow: Workflow | GraphqlWorkflow;
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (inputParameters: Record<string, any>) => Promise<string | null> | null;
};

const ExecuteWorkflowModal: FC<Props> = ({ workflow, isOpen, onClose, onSubmit }) => {
  const { name, description } = workflow;
  const parsedInputParameters = parseInputParameters(workflow?.inputParameters || []);
  const dynamicInputParameters = getDynamicInputParametersFromWorkflow(workflow);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executedWorkflowId, setExecutedWorkflowId] = useState<string | null>(null);
  const { values, handleSubmit, submitForm, isSubmitting, setSubmitting, setFieldValue } = useFormik<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, any>
  >({
    enableReinitialize: true,
    initialValues: getInitialValuesFromParsedInputParameters(parsedInputParameters, dynamicInputParameters),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (formData) => {
      setIsExecuting(true);

      const id = await onSubmit(formData);
      setExecutedWorkflowId(id);
      setIsExecuting(false);
      setSubmitting(false);
    },
  });

  const inputParametersKeys = Object.keys(values);

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
          {inputParametersKeys == null || inputParametersKeys.length === 0 ? (
            <Text>To successfully execute this workflow there are not provided any input parameters</Text>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid templateColumns="repeat(2, 1fr)" gap={5}>
                {inputParametersKeys.map((inputParameterKey) => (
                  <GridItem key={inputParameterKey}>
                    <ExecuteWorkflowModalFormInput
                      inputParameterKey={inputParameterKey}
                      onChange={setFieldValue}
                      values={values}
                      parsedInputParameters={parsedInputParameters}
                    />
                  </GridItem>
                ))}
              </Grid>
            </form>
          )}
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
