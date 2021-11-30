/* eslint-disable */
// @ts-nocheck
import React, { FC, FormEvent, useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Task, Workflow } from '../../helpers/types';
import callbackUtils from '../../callback-utils';
import unwrap from '../../helpers/unwrap';

function jsonParse<T>(json?: string | null): T | null {
  if (json == null) {
    return null;
  }
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

const getInputs = (def: string): string[] => {
  const inputCaptureRegex = /workflow\.input\.([a-zA-Z0-9-_]+)}/gim;
  let match = inputCaptureRegex.exec(def);
  const inputsArray = [];

  while (match != null) {
    inputsArray.push(match[1]);
    match = inputCaptureRegex.exec(def);
  }

  return [...new Set(inputsArray)];
};

function getFormValues(workflow: Workflow): Record<string, FormItem> {
  const definition = JSON.stringify(workflow, null, 2);
  const labels = getInputs(definition);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const inputParams = jsonParse<Record<string, unknown>>(workflow.inputParameters ? workflow.inputParameters[0] : null);

  return labels.reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: (inputParams ? inputParams[curr] : undefined) ?? { label: curr, value: '', type: 'string' },
    };
  }, {});
}

const getWaitingWorkflows = () => {
  return new Promise(() => {
    const waitingWfs = [];

    const { getWorkflowExecutions, getWorkflowInstanceDetail } = callbackUtils.getCallbacks;

    getWorkflowExecutions().then((res) => {
      const runningWfs = res.result?.hits || [];
      const promises = runningWfs.map((wf) => {
        return getWorkflowInstanceDetail(wf.workflowId);
      });

      Promise.all(promises).then((results) => {
        results.forEach((r) => {
          const workflow = r.result;
          const waitTasks = workflow?.tasks.filter((task) => task.taskType === 'WAIT').map((t) => t.referenceTaskName);
          if (waitTasks.length > 0) {
            const waitingWf = {
              id: workflow.workflowId,
              name: workflow.workflowName,
              waitingTasks: waitTasks,
            };
            waitingWfs.push(waitingWf);
          }
        });
      });
    });
  });
};

type FormItem = {
  label: string;
  description?: string;
  constraint?: string;
} & (
  | {
      type: 'toggle';
      value: string | number;
      options: (string | boolean | number)[];
    }
  | { type: 'select'; value: string | number; options: { value: string | number }[] }
  | { type: 'textarea'; value: string }
  | { type: 'string'; value: string }
);

type Props = {
  workflow: Workflow<Task>;
  onClose: () => void;
  shouldCloseAfterSubmit: boolean;
  isOpen: boolean;
  onSuccessClick: (workflowId: string) => void;
};

const ExecutionModal: FC<Props> = ({ workflow, onClose, shouldCloseAfterSubmit, isOpen, onSuccessClick }) => {
  const [warning, setWarning] = useState<boolean[]>([]);
  const [workflowForm, setWorkflowForm] = useState<Record<string, FormItem>>(getFormValues(workflow));
  const [waitingWfs, setWaitingWfs] = useState<unknown[]>([]);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { name, version } = workflow;
  const description =
    jsonParse<{ description: string }>(workflow.description)?.description ||
    (jsonParse<{ description: string }>(workflow.description)?.description !== '' && workflow.description);

  useEffect(() => {
    const definition = JSON.stringify(workflow, null, 2);

    if (definition.match(/\bEVENT_TASK\b/)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getWaitingWorkflows().then((wWfs: unknown[]) => {
        setWaitingWfs(wWfs);
      });
    }
  }, [workflow]);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      name,
      version,
      input: Object.keys(workflowForm).reduce((acc, curr) => {
        const { value } = workflowForm[curr];

        return {
          ...acc,
          [curr]: typeof value === 'string' && value.startsWith('{') ? JSON.parse(value) : value,
        };
      }, {}),
    };

    const { executeWorkflow } = callbackUtils.getCallbacks;

    setIsLoading(true);
    executeWorkflow(payload).then((res) => {
      setIsLoading(false);
      setIsSuccess(true);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setWorkflowId(res.text);
      if (shouldCloseAfterSubmit) {
        onClose();
      }
    });
  };

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>
          {name} / {version}
          <Text fontSize={15} fontWeight="normal" color="gray.500">
            {' '}
            {description}{' '}
          </Text>
        </ModalHeader>
        <form onSubmit={handleFormSubmit}>
          <ModalBody padding={30}>
            <Grid templateColumns="330px 330px" columnGap={30} rowGap={4}>
              {Object.keys(workflowForm).map((label) => {
                const item = workflowForm[label];

                switch (item.type) {
                  case 'toggle':
                    return (
                      <FormControl id={label} key={label}>
                        <FormLabel>{label}</FormLabel>
                        <RadioGroup
                          id={label}
                          name={label}
                          value={item.value.toString()}
                          onChange={(value) => {
                            setWorkflowForm((s) => {
                              return {
                                ...s,
                                [label]: {
                                  ...item,
                                  value,
                                },
                              };
                            });
                          }}
                        >
                          <Stack direction="row" spacing={5}>
                            <Radio value={item.options[0].toString()}>{item.options[0].toString()}</Radio>
                            <Radio value={item.options[1].toString()}>{item.options[1].toString()}</Radio>
                          </Stack>
                        </RadioGroup>
                      </FormControl>
                    );
                  case 'textarea':
                    return (
                      <FormControl id={label} key={label}>
                        <FormLabel>{label}</FormLabel>
                        <Textarea
                          variant="filled"
                          id={label}
                          name={label}
                          value={item.value}
                          onChange={(event) => {
                            event.persist();
                            setWorkflowForm((s) => {
                              return {
                                ...s,
                                [label]: {
                                  ...item,
                                  value: event.target.value,
                                },
                              };
                            });
                          }}
                        />
                      </FormControl>
                    );
                  case 'select':
                    return (
                      <FormControl id={label} key={label}>
                        <FormLabel>{label}</FormLabel>
                        <Select
                          value={item.value}
                          onChange={(event) => {
                            event.persist();
                            setWorkflowForm((s) => {
                              return {
                                ...s,
                                [label]: {
                                  ...item,
                                  value: event.target.value,
                                },
                              };
                            });
                          }}
                        >
                          {item.options.map((option) => (
                            <option value={option.value} key={option.value}>
                              {option.value}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    );
                  case 'string':
                  default:
                    return (
                      <FormControl id={label} key={label}>
                        <FormLabel>{label}</FormLabel>
                        <Input
                          variant="filled"
                          type="text"
                          id={label}
                          name={label}
                          value={item.value}
                          onChange={(event) => {
                            event.persist();
                            setWorkflowForm((s) => {
                              return {
                                ...s,
                                [label]: {
                                  ...item,
                                  value: event.target.value,
                                },
                              };
                            });
                          }}
                        />
                      </FormControl>
                    );
                }
              })}
              {/* {workflowForm.map((item, i) => {
                return (
                  <Box key={item.label}>
                    <FormControl id={item.label}>
                      <FormLabel>{item.label}</FormLabel>
                      {warning[i] ? (
                        <Box color="red" fontSize={12} float="right" marginTop={5}>
                          Unnecessary space
                        </Box>
                      ) : null}
                      {inputModel(item, i)}
                      <FormHelperText className="text-muted">
                        {item.description}
                        <br />
                        {item.constraint && (
                          <>
                            <strong>Constraint:</strong> {item.constraint}
                          </>
                        )}
                      </FormHelperText>
                    </FormControl>
                  </Box>
                );
              })} */}
            </Grid>
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <HStack spacing={2}>
              {isSuccess ? (
                <Button
                  type="button"
                  colorScheme="blue"
                  onClick={() => {
                    onSuccessClick(unwrap(workflowId));
                  }}
                >
                  Continue to detail
                </Button>
              ) : (
                <Button type="submit" colorScheme="blue" isLoading={isLoading}>
                  Execute
                </Button>
              )}
              <Button colorScheme="gray" onClick={onClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ExecutionModal;
