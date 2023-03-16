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
  Stack,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { convertTaskToExtendedTask, ExtendedTask, InputParameters } from '@frinx/shared/src';
import { useFormik } from 'formik';
import React, { FC } from 'react';
import { GraphExtendedTask } from '../../helpers/types';
import { getValidationSchema, renderInputParamForm } from './input-params-forms';
import DecisionTaskForm from './decision-task-form';
import SwitchTaskForm from './switch-task-form';

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
      isCaseExpressionEnabled: !!task.caseExpression,
    };
  }
  if (task.type === 'SWITCH') {
    const decisionCases = Object.entries(task.decisionCases).map(([key, tasks]) => {
      return { key, tasks: tasks.map(convertTaskToExtendedTask) };
    });
    return {
      ...task,
      decisionCases,
      evaluatorType: 'value-param',
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
      caseExpression: task.isCaseExpressionEnabled ? task.caseExpression : undefined,
      caseValueParam: task.isCaseExpressionEnabled ? undefined : task.caseValueParam,
    };
  }
  if (task.type === 'SWITCH') {
    const decisionCases = task.decisionCases.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.key]: curr.tasks,
      };
    }, {});
    return {
      ...task,
      decisionCases,
      expression: task.expression,
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
              <DecisionTaskForm
                values={values}
                errors={errors}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
              />
            )}
            {values.type === 'SWITCH' && (
              <SwitchTaskForm
                values={values}
                errors={errors}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
              />
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
