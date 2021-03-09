import React, { FC, FormEvent, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
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
import produce from 'immer';
import { InputParameters, ExtendedTask } from '../../helpers/types';
import { renderInputParamForm } from './input-params-forms';

type Props = {
  task: ExtendedTask;
  onClose: () => void;
  onFormSubmit: (task: ExtendedTask) => void;
};

const TaskForm: FC<Props> = ({ task, onClose, onFormSubmit }) => {
  const [taskState, setTaskState] = useState(task);

  useEffect(() => {
    setTaskState(task);
  }, [task]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onFormSubmit(taskState);
  };

  const handleUpdateInputParameters = (inputParameters: InputParameters) => {
    setTaskState((t) => {
      return produce(t, (acc) => {
        if ('inputParameters' in acc) {
          acc.inputParameters = inputParameters;
        }
      });
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs size="md" isLazy>
        <TabList>
          <Tab>General settings</Tab>
          {'inputParameters' in taskState && <Tab>Input parameters</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormControl id="taskReferenceName" my={6}>
              <FormLabel>Task reference name</FormLabel>
              <Input
                variant="filled"
                name="taskReferenceName"
                type="text"
                value={taskState.taskReferenceName}
                onChange={(event) => {
                  event.persist();
                  setTaskState((t) => ({
                    ...t,
                    taskReferenceName: event.target.value,
                  }));
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
                  value={taskState.startDelay}
                  onChange={(event) => {
                    event.persist();
                    setTaskState((t) => ({
                      ...t,
                      startDelay: Number(event.target.value),
                    }));
                  }}
                />
                <FormHelperText>time period before task executes</FormHelperText>
              </Box>
            </FormControl>
            <FormControl my={6}>
              <Flex alignItems="center">
                <Checkbox
                  name="optional"
                  isChecked={taskState.optional}
                  onChange={(event) => {
                    event.persist();
                    setTaskState((t) => ({
                      ...t,
                      optional: event.target.checked,
                    }));
                  }}
                  id="optional"
                />
                <FormLabel htmlFor="optional" mb={0} ml={2}>
                  Optional
                </FormLabel>
              </Flex>
              <FormHelperText>when set to true - workflow continues even if the task fails.</FormHelperText>
            </FormControl>
            {taskState.type === 'DECISION' && (
              <>
                <HStack spacing={2}>
                  <FormControl>
                    <InputGroup>
                      <InputLeftAddon>if</InputLeftAddon>
                      <Input
                        type="text"
                        value={taskState.caseValueParam}
                        onChange={(event) => {
                          event.persist();
                          setTaskState((s) => {
                            return {
                              ...s,
                              caseValueParam: event.target.value,
                            };
                          });
                        }}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <InputGroup>
                      <InputLeftAddon>is equal to</InputLeftAddon>
                      <Input
                        type="text"
                        value={Object.keys(taskState.decisionCases)[0]}
                        onChange={(event) => {
                          event.persist();
                          setTaskState((s) => {
                            return {
                              ...s,
                              decisionCases: {
                                [event.target.value]: [],
                              },
                            };
                          });
                        }}
                      />
                    </InputGroup>
                  </FormControl>
                </HStack>
              </>
            )}
            {taskState.type === 'EVENT' && (
              <FormControl id="sink">
                <FormLabel>Sink</FormLabel>
                <Input
                  type="text"
                  name="sink"
                  value={taskState.sink}
                  onChange={(event) => {
                    event.persist();
                    setTaskState((s) => {
                      return {
                        ...s,
                        sink: event.target.value,
                      };
                    });
                  }}
                />
              </FormControl>
            )}
          </TabPanel>
          {'inputParameters' in taskState && (
            <TabPanel>{renderInputParamForm(taskState, handleUpdateInputParameters)}</TabPanel>
          )}
        </TabPanels>
      </Tabs>
      <Divider my={4} />
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
