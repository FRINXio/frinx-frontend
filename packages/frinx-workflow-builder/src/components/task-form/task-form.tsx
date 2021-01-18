import React, { FC, FormEvent, ReactNode } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { GraphQLInputParams, HTTPInputParams, InputParameters, LambdaInputParams, Task } from 'helpers/types';
import HTTPInputsForm from './http-inputs-form';
import LambdaInputsForm from './lambda-inputs-form';
import GraphQLInputsForm from './graphql-inputs-form';
import { useWorkflowContext } from '../../workflow-context';
import unwrap from '../../helpers/unwrap';

type Props = {
  task: Task;
  onClose: () => void;
  onFormSubmit: (values: unknown) => void;
};

const isHttpTaskInputParams = (params: InputParameters): params is HTTPInputParams => 'http_request' in params;
const isLambdaTaskInputParams = (params: InputParameters): params is LambdaInputParams => 'lambdaValue' in params;
const isGraphQLTaskInputParams = (params: InputParameters): params is GraphQLInputParams =>
  'http_request' in params && 'body' in params.http_request && typeof params.http_request.body === 'object';

function renderInputParamForm(
  params: InputParameters | undefined,
  setState: (p: RecursivePartial<InputParameters>) => void,
): ReactNode | null {
  if (params == null) {
    return null;
  }
  if (isGraphQLTaskInputParams(params)) {
    return <GraphQLInputsForm params={params} onChange={setState} />;
  }
  if (isHttpTaskInputParams(params)) {
    return <HTTPInputsForm params={params} onChange={setState} />;
  }
  if (isLambdaTaskInputParams(params)) {
    return <LambdaInputsForm params={params} onChange={setState} />;
  }
  return null;
}

const TaskForm: FC<Props> = ({ onClose, onFormSubmit }) => {
  const { task, updateTask, updateInputParams } = useWorkflowContext();
  const { taskReferenceName, startDelay, optional, inputParameters } = unwrap(task);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs size="md" variant="enclosed">
        <TabList>
          <Tab>General settings</Tab>
          <Tab>Input parameters</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormControl id="taskReferenceName" my={6}>
              <FormLabel>Task reference name</FormLabel>
              <Input
                variant="filled"
                name="taskReferenceName"
                type="text"
                value={taskReferenceName}
                onChange={(event) => {
                  updateTask({
                    taskReferenceName: event.target.value,
                  });
                }}
              />
              <FormHelperText>
                alias used to refer the task within the workflow (MUST be unique within workflow)
              </FormHelperText>
            </FormControl>
            <FormControl id="startDelay" my={6}>
              <Box width={1 / 2}>
                <FormLabel>Start delay</FormLabel>
                <Input
                  variant="filled"
                  name="startDelay"
                  type="text"
                  value={startDelay}
                  onChange={(event) => {
                    updateTask({
                      startDelay: Number(event.target.value),
                    });
                  }}
                />
                <FormHelperText>time period before task executes</FormHelperText>
              </Box>
            </FormControl>
            <FormControl my={6}>
              <Flex alignItems="center">
                <Checkbox
                  name="optional"
                  isChecked={optional}
                  onChange={(event) => {
                    updateTask({
                      optional: event.target.checked,
                    });
                  }}
                  id="optional"
                />
                <FormLabel htmlFor="optional" mb={0} ml={2}>
                  Optional
                </FormLabel>
              </Flex>
              <FormHelperText>when set to true - workflow continues even if the task fails.</FormHelperText>
            </FormControl>
          </TabPanel>
          <TabPanel>{renderInputParamForm(inputParameters, updateInputParams)}</TabPanel>
        </TabPanels>
      </Tabs>
      <Stack direction="row" spacing={2} align="center">
        <Button type="submit" colorScheme="blue">
          Save changes
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </Stack>
    </form>
  );
};

export default TaskForm;
