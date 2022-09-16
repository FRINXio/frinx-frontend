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
  Text,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { FC } from 'react';
import { jsonParse } from '@frinx/workflow-ui/src/utils/helpers.utils';

type Props = {
  workflowName: string;
  workflowDescription?: string;
  inputParameters?: string[];
  dynamicInputParameters?: string[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inputParameters: Record<string, any>) => void;
};

type InputParameter = Record<string, { value: string; description: string; type: string }>;

function parseInputParameters(inputParameters?: string[]) {
  if (inputParameters == null || inputParameters.length === 0) {
    return null;
  }

  const parsedInputParameters: InputParameter[] = inputParameters.map(jsonParse);

  return parsedInputParameters.map(Object.keys).reduce((acc, currObjectKeys, index) => {
    const result: InputParameter = currObjectKeys.reduce(
      (acc, curr) => ({ ...acc, [curr]: parsedInputParameters[index][curr] }),
      {},
    );

    return {
      ...acc,
      ...result,
    };
  }, {} as InputParameter);
}

function getInitialValuesFromParsedInputParameters(
  parsedInputParameters?: InputParameter | null,
  dynamicInputParameters?: string[] | null,
) {
  if (parsedInputParameters == null) {
    return {};
  }

  let initialValues = Object.keys(parsedInputParameters).reduce(
    (acc, curr) => ({ ...acc, [curr]: parsedInputParameters[curr].value }),
    {},
  );

  initialValues = {
    ...initialValues,
    ...dynamicInputParameters?.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: '',
      }),
      {},
    ),
  };

  return initialValues;
}

const ExecuteWorkflowModal: FC<Props> = ({
  inputParameters,
  dynamicInputParameters,
  isOpen,
  onClose,
  workflowName,
  onSubmit,
  workflowDescription,
}) => {
  const parsedInputParameters = parseInputParameters(inputParameters);
  const { values, handleSubmit, handleChange, submitForm } = useFormik<Record<string, any>>({
    initialValues: getInitialValuesFromParsedInputParameters(parsedInputParameters, dynamicInputParameters),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit,
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
          {parsedInputParameters == null || inputParameters == null || inputParameters.length === 0 ? (
            <Text>To successfully execute this workflow there are not provided any input parameters</Text>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid templateColumns="repeat(2, 1fr)" gap={5}>
                {inputParametersKeys.map((inputParameterKey) => (
                  <GridItem key={inputParameterKey}>
                    <FormControl>
                      <FormLabel htmlFor={inputParameterKey}>{inputParameterKey}</FormLabel>
                      <Input name={inputParameterKey} value={values[inputParameterKey]} onChange={handleChange} />
                      <FormHelperText>{parsedInputParameters[inputParameterKey].description}</FormHelperText>
                    </FormControl>
                  </GridItem>
                ))}
              </Grid>
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>Close</Button>
            <Button colorScheme="blue" onClick={submitForm}>
              Execute workflow
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExecuteWorkflowModal;
