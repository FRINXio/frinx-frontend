import React, { FC } from 'react';
import { FormikErrors, useFormik } from 'formik';
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
  Icon,
  IconButton,
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
import FeatherIcon from 'feather-icons-react';
import produce from 'immer';
import { InputParameters, ExtendedTask, GraphExtendedTask } from '../../helpers/types';
import { getValidationSchema, renderInputParamForm } from './input-params-forms';
import { convertTaskToExtendedTask } from '../../helpers/api-to-graph.helpers';
import { getRandomString } from '../../helpers/task.helpers';

type Props = {
  task: ExtendedTask;
  tasks: ExtendedTask[];
  onClose: () => void;
  onFormSubmit: (task: ExtendedTask) => void;
};

function convertExtendedTaskToGraphExtendedTask(task: ExtendedTask): GraphExtendedTask {
  if (task.type === 'DECISION') {
    const decisionCases = Object.entries(task.decisionCases).map(([key, tasks]) => {
      return { key, tasks: tasks.map(convertTaskToExtendedTask) };
    });
    return {
      ...task,
      decisionCases,
    };
  }
  return task;
}

function convertGraphExtendedTaskToExtendedTask(task: GraphExtendedTask): ExtendedTask {
  if (task.type === 'DECISION') {
    const decisionCases = task.decisionCases.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.key]: curr.tasks,
      };
    }, {});
    return {
      ...task,
      decisionCases,
    };
  }
  return task;
}

function getDecisionCaseError(
  errors: FormikErrors<GraphExtendedTask>,
  index: number,
): FormikErrors<{ caseValueParam: string; decisionCase: string }> | null {
  if ('decisionCases' in errors) {
    const { decisionCases, caseValueParam } = errors;
    const decisionCaseErrors = decisionCases && decisionCases[index];
    return {
      caseValueParam,
      decisionCase: typeof decisionCaseErrors === 'object' ? decisionCaseErrors.key : undefined,
    };
  }
  return null;
}

const TaskForm: FC<Props> = ({ task, tasks, onClose, onFormSubmit }) => {
  const { errors, values, handleSubmit, handleChange, isSubmitting, isValid, setFieldValue } =
    useFormik<GraphExtendedTask>({
      initialValues: convertExtendedTaskToGraphExtendedTask(task),
      validationSchema: getValidationSchema(task),
      onSubmit: (formValues) => {
        const convertedFormValues = convertGraphExtendedTaskToExtendedTask(formValues);
        onFormSubmit(convertedFormValues);
        onClose();
      },
    });

  const handleUpdateInputParameters = (inputParameters: InputParameters) => {
    setFieldValue('inputParameters', inputParameters);
  };

  const handleAddDecisionCase = () => {
    if (values.type !== 'DECISION') {
      return;
    }
    const newDecisionCases = [...values.decisionCases, { key: `case_${getRandomString(3)}`, tasks: [] }];
    setFieldValue('decisionCases', newDecisionCases);
  };

  const handleDeleteDecisionCase = (decisionKey: string) => {
    if (values.type !== 'DECISION') {
      return;
    }
    const newDecisionCases = values.decisionCases.filter((c) => c.key !== decisionKey);
    setFieldValue('decisionCases', newDecisionCases);
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
                <HStack spacing={2} marginY={2} alignItems="center">
                  <FormControl isInvalid={getDecisionCaseError(errors, 0)?.caseValueParam != null}>
                    <InputGroup>
                      <InputLeftAddon>if</InputLeftAddon>
                      <Input
                        type="text"
                        name="caseValueParam"
                        value={values.caseValueParam || ''}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    <FormErrorMessage>{getDecisionCaseError(errors, 0)?.caseValueParam}</FormErrorMessage>
                  </FormControl>
                  <Button aria-label="Add decision case" size="sm" colorScheme="blue" onClick={handleAddDecisionCase}>
                    Add case
                  </Button>
                </HStack>
                {values.decisionCases.map(({ key }, index) => {
                  const decisionErrors = getDecisionCaseError(errors, index);
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <React.Fragment key={key}>
                      <HStack spacing={2} marginY={2} alignItems="flex-start" paddingLeft={2}>
                        <FormControl isInvalid={decisionErrors?.decisionCase != null}>
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

                                const newDecisionCases = produce(values.decisionCases, (draft) => {
                                  const newCase = {
                                    ...draft[index],
                                    key: event.target.value,
                                  };
                                  draft.splice(index, 1, newCase);
                                });
                                setFieldValue('decisionCases', newDecisionCases);
                              }}
                            />
                          </InputGroup>
                          <FormErrorMessage>{decisionErrors?.decisionCase}</FormErrorMessage>
                        </FormControl>
                        <IconButton
                          colorScheme="red"
                          size="md"
                          aria-label="Delete blueprint"
                          icon={<Icon size={20} as={FeatherIcon} icon="trash-2" />}
                          onClick={() => {
                            handleDeleteDecisionCase(key);
                          }}
                        />
                      </HStack>
                    </React.Fragment>
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
