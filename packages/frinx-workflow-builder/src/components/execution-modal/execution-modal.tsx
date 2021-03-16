// import Dropdown from 'react-dropdown';
import React, { FC, FormEvent, useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
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

function getFormValues(workflow: Workflow): FormItem[] {
  const definition = JSON.stringify(workflow, null, 2);
  const labels = getInputs(definition);
  const inputParams = jsonParse<Record<string, any>>(workflow.inputParameters ? workflow.inputParameters[0] : null);

  return labels.map((label) => ({
    label,
    ...(inputParams ? inputParams[label] : null),
  }));
}

const getWaitingWorkflows = () => {
  return new Promise(() => {
    const waitingWfs = [];

    const getWorkflowExecutions = callbackUtils.getWorkflowExecutionsCallback();
    const getWorkflowInstanceDetail = callbackUtils.getWorkflowInstanceDetailCallback();

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
  value?: string;
  description?: string;
  type?: string;
  constraint?: string;
};

type Props = {
  workflow: Workflow<Task>;
  onClose: () => void;
  shouldCloseAfterSubmit: boolean;
  isOpen: boolean;
  onWorkflowIdClick: (workflowId: string) => void;
};

const ExecutionModal: FC<Props> = ({ workflow, onClose, shouldCloseAfterSubmit, isOpen, onWorkflowIdClick }) => {
  const [warning, setWarning] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [workflowForm, setWorkflowForm] = useState<FormItem[]>(getFormValues(workflow));
  const [waitingWfs, setWaitingWfs] = useState<unknown[]>([]);
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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const workflowFormCopy = [...workflowForm];
    const warningCopy = [...warning];

    workflowFormCopy[i].value = e.target.value;
    warningCopy[i] = !!(workflowFormCopy[i].value?.match(/^\s.*$/) || workflowFormCopy[i].value?.match(/^.*\s$/));

    setWorkflowForm(workflowFormCopy);
    setWarning(warningCopy);
  };

  const handleTypeahead = (e, i) => {
    const workflowFormCopy = [...workflowForm];
    workflowFormCopy[i].value = e.toString();
    setWorkflowForm(workflowFormCopy);
  };

  const handleSwitch = (e, i) => {
    const workflowFormCopy = [...workflowForm];

    workflowFormCopy[i].value = e == 'true';
    setWorkflowForm(workflowFormCopy);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      name,
      version,
      input: workflowForm.reduce((acc, curr) => {
        const { label, value } = curr;
        return {
          ...acc,
          [label]: typeof value === 'string' && value.startsWith('{') ? JSON.parse(value) : value,
        };
      }, {}),
    };

    const executeWorkflow = callbackUtils.executeWorkflowCallback();

    setIsLoading(true);
    executeWorkflow(payload).then((res) => {
      setIsLoading(false);
      setWfId(res.text);
      if (shouldCloseAfterSubmit) {
        onClose();
      }
    });
  };

  const inputModel = (item, i) => {
    switch (item.type) {
      case 'workflow-id':
        return null;
      case 'task-refName':
        return (
          <Typeahead
            id={`input-${item.i}`}
            onChange={(e) => handleTypeahead(e, i)}
            placeholder="Enter or select task reference name"
            options={waitingWfs.map((w) => w.waitingTasks).flat()}
            onInputChange={(e) => handleTypeahead(e, i)}
            renderMenuItemChildren={(option) => (
              <div>
                {option}
                <div>
                  <small>name: {waitingWfs.find((w) => w.waitingTasks.includes(option))?.name}</small>
                </div>
              </div>
            )}
          />
        );
      case 'textarea':
        return (
          <FormControl placeholder="Enter the input" value={item.value} isInvalid={warning[i]}>
            <Textarea
              rows={2}
              onChange={(e) => handleInput(e, i)}
              value={workflowForm[i].value}
              placeholder="Enter the input"
            />
          </FormControl>
        );
      case 'toggle':
        return (
          <RadioGroup value={item.value.toString()} onChange={(e) => handleSwitch(e, i)}>
            <Stack direction="row" spacing={5}>
              <Radio value={item?.options[0].toString()}>{item?.options[0].toString()}</Radio>
              <Radio value={item?.options[1].toString()}>{item?.options[1].toString()}</Radio>
            </Stack>
          </RadioGroup>
        );
      case 'select':
        // return <Dropdown options={item.options} onChange={(e) => handleSwitch(e.value, i)} value={item.value} />;
        return (
          <Select value={item.value} onChange={(e) => handleSwitch(e.target.value, i)}>
            {item.options.map((option) => (
              <option value={option.value}>{option.value}</option>
            ))}
          </Select>
        );
      default:
        return (
          <FormControl isInvalid={warning[i]}>
            <Input onChange={(e) => handleInput(e, i)} value={item.value} placeholder="Enter the input" />
          </FormControl>
        );
    }
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
              {workflowForm.map((item, i) => {
                return (
                  <Box key={item.label}>
                    <FormControl>
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
              })}
            </Grid>
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <HStack spacing={2}>
              <Button type="submit" colorScheme="blue" isLoading={isLoading}>
                Execute
              </Button>
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
