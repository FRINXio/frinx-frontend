import {
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
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
import { getInitialValuesFromParsedInputParameters, InputParameter } from '@frinx/workflow-ui/src/utils/helpers.utils';
import { Link } from 'react-router-dom';

type Props = {
  workflowName: string;
  workflowDescription?: string;
  parsedInputParameters?: InputParameter | null;
  dynamicInputParameters?: string[] | null;
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (inputParameters: Record<string, any>) => Promise<string | null> | null;
};

const ExecuteWorkflowModal: FC<Props> = ({
  isOpen,
  onClose,
  workflowName,
  onSubmit,
  workflowDescription,
  parsedInputParameters,
  dynamicInputParameters,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executedWorkflowId, setExecutedWorkflowId] = useState<string | null>(null);
  const { values, handleSubmit, handleChange, submitForm, isSubmitting, setSubmitting } = useFormik<
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
          <Heading fontSize="md">{workflowName}</Heading>
          {workflowDescription != null && (
            <Text fontSize="sm" textColor="gray.400">
              {JSON.parse(workflowDescription).description}
            </Text>
          )}
        </ModalHeader>
        <ModalBody maxHeight="3xl" overflow="scroll">
          {inputParametersKeys == null || inputParametersKeys.length === 0 ? (
            <Text>To successfully execute this workflow there are not provided any input parameters</Text>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid templateColumns="repeat(2, 1fr)" gap={5}>
                {inputParametersKeys.map((inputParameterKey) => (
                  <GridItem key={inputParameterKey}>
                    <FormControl>
                      <FormLabel htmlFor={inputParameterKey}>{inputParameterKey}</FormLabel>
                      <Input name={inputParameterKey} value={values[inputParameterKey]} onChange={handleChange} />
                      {parsedInputParameters != null &&
                        Object.keys(parsedInputParameters).includes(inputParameterKey) && (
                          <FormHelperText>{parsedInputParameters[inputParameterKey].description}</FormHelperText>
                        )}
                    </FormControl>
                  </GridItem>
                ))}
              </Grid>
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          {executedWorkflowId != null && (
            <Button variant="link" colorScheme="blue" as={Link} to={`/uniflow/executed/${executedWorkflowId}`}>
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
