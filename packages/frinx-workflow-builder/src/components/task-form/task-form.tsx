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
import { omitBy } from 'lodash';
import produce from 'immer';
import { InputParameters, ExtendedTask } from '../../helpers/types';
import { renderInputParamForm } from './input-params-forms';

type Props = {
  task: ExtendedTask;
  tasks: ExtendedTask[];
  onClose: () => void;
  onFormSubmit: (task: ExtendedTask) => void;
};

const TaskForm: FC<Props> = ({ task, tasks, onClose, onFormSubmit }) => {
  const [taskState, setTaskState] = useState(task);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setTaskState(task);
  }, [task]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onFormSubmit(taskState);
    onClose();
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

  const handleValidation = (isValidInputParams: boolean) => {
    setIsValid(isValidInputParams);
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
              <Box width="50%">
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
                {Object.keys(taskState.decisionCases).map((key, index) => {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <HStack spacing={2} key={index} marginY={2}>
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
                            value={key}
                            onChange={(event) => {
                              event.persist();
                              setTaskState((s) => {
                                if (s.type !== 'DECISION') {
                                  return s;
                                }
                                return {
                                  ...s,
                                  decisionCases: {
                                    ...omitBy(s.decisionCases, (_, k) => k === key),
                                    [event.target.value]: s.decisionCases[key],
                                  },
                                };
                              });
                            }}
                          />
                        </InputGroup>
                      </FormControl>
                    </HStack>
                  );
                })}
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
            <TabPanel>{renderInputParamForm(taskState, handleUpdateInputParameters, tasks, handleValidation)}</TabPanel>
          )}
        </TabPanels>
      </Tabs>
      <Divider my={4} />
      <Stack direction="row" spacing={2} align="center">
        <Button type="submit" colorScheme="blue" isDisabled={!isValid}>
          Save changes
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </Stack>
    </form>
  );
};

export default TaskForm;
