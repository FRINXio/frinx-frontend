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
    const newDecisionCases = [...values.decisionCases, { key: 'case', tasks: [] }];
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
                <Button
                  aria-label="Add decision case"
                  leftIcon={<Icon as={FeatherIcon} icon="plus" size="small" />}
                  size="md"
                  fontWeight="normal"
                  onClick={handleAddDecisionCase}
                >
                  Add decision case
                </Button>
                {values.decisionCases.map(({ key }, index) => {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <React.Fragment key={`decision-case-${index}`}>
                      <HStack spacing={2} marginY={2}>
                        <FormControl>
                          <InputGroup>
                            <InputLeftAddon>if</InputLeftAddon>
                            <Input
                              type="text"
                              name="caseValueParam"
                              value={values.caseValueParam || ''}
                              onChange={handleChange}
                            />
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
                        </FormControl>
                        <IconButton
                          colorScheme="red"
                          size="sm"
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
