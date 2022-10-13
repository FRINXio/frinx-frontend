import React, { FC } from 'react';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { omitBy } from 'lodash';
import { InputParameters, ExtendedTask } from '../../helpers/types';
import { getValidationSchema, renderInputParamForm } from './input-params-forms';

type Props = {
  task: ExtendedTask;
  tasks: ExtendedTask[];
  onClose: () => void;
  onFormSubmit: (task: ExtendedTask) => void;
};

const TaskForm: FC<Props> = ({ task, tasks, onClose, onFormSubmit }) => {
  const { errors, values, handleSubmit, handleChange, isSubmitting, isValid, setFieldValue } = useFormik<ExtendedTask>({
    initialValues: task,
    validationSchema: getValidationSchema(task),
    onSubmit: (formValues) => {
      onFormSubmit(formValues);
      onClose();
    },
  });

  const handleUpdateInputParameters = (inputParameters: InputParameters) => {
    setFieldValue('inputParameters', inputParameters);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs size="md" isLazy>
        <TabList>
          <Tab>General settings</Tab>
          {'inputParameters' in values && <Tab>Input parameters</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormControl id="taskReferenceName" my={6} isInvalid={errors.taskReferenceName != null}>
              <FormLabel>Task reference name</FormLabel>
              <Input
                variant="filled"
                name="taskReferenceName"
                type="text"
                value={values.taskReferenceName}
                onChange={handleChange}
              />
              <FormHelperText>
                alias used to refer the task within the workflow (MUST be unique within workflow)
              </FormHelperText>
              <FormErrorMessage>{errors.taskReferenceName}</FormErrorMessage>
            </FormControl>
            <FormControl id="startDelay" my={6} isInvalid={errors.startDelay != null}>
              <Box width="50%">
                <FormLabel>Start delay</FormLabel>
                <Input
                  variant="filled"
                  name="startDelay"
                  type="text"
                  value={values.startDelay}
                  onChange={handleChange}
                />
                <FormHelperText>time period before task executes</FormHelperText>
                <FormErrorMessage>{errors.startDelay}</FormErrorMessage>
              </Box>
            </FormControl>
            <FormControl my={6}>
              <Flex alignItems="center">
                <Checkbox name="optional" isChecked={values.optional} onChange={handleChange} id="optional" />
                <FormLabel htmlFor="optional" mb={0} ml={2}>
                  Optional
                </FormLabel>
              </Flex>
              <FormHelperText>when set to true - workflow continues even if the task fails.</FormHelperText>
            </FormControl>
            {values.type === 'DECISION' && (
              <>
                {Object.keys(values.decisionCases).map((key, index) => {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <HStack spacing={2} key={index} marginY={2}>
                      <FormControl>
                        <InputGroup>
                          <InputLeftAddon>if</InputLeftAddon>
                          <Input type="text" value={values.caseValueParam} onChange={handleChange} />
                        </InputGroup>
                      </FormControl>
                      <FormControl>
                        <InputGroup>
                          <InputLeftAddon>is equal to</InputLeftAddon>
                          <Input
                            type="text"
                            value={key}
                            onChange={(event) => {
                              event.persist();
                              if (values.type !== 'DECISION') {
                                return;
                              }
                              console.log(values.decisionCases[key], event.target.value);
                              const newDecisionCases = {
                                ...omitBy(values.decisionCases, (_, k) => k === key),
                                [event.target.value]: values.decisionCases[key],
                              };
                              setFieldValue('decisionCases', newDecisionCases);
                              // setFieldValue('caseValueParam', event.target.value);
                            }}
                          />
                        </InputGroup>
                      </FormControl>
                    </HStack>
                  );
                })}
              </>
            )}
            {values.type === 'EVENT' && (
              <FormControl id="sink">
                <FormLabel>Sink</FormLabel>
                <Input type="text" name="sink" value={values.sink} onChange={handleChange} />
              </FormControl>
            )}
          </TabPanel>
          {'inputParameters' in values && (
            <TabPanel>{renderInputParamForm(values, errors, handleUpdateInputParameters, tasks)}</TabPanel>
          )}
        </TabPanels>
      </Tabs>
      <Divider my={4} />
      <Stack direction="row" spacing={2} align="center">
        <Button type="submit" colorScheme="blue" isDisabled={!isValid || isSubmitting}>
          Save changes
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </Stack>
    </form>
  );
};

export default TaskForm;
