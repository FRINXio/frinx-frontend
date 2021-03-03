// @flow
import Dropdown from 'react-dropdown';
import React, { useEffect, useState } from 'react';
import callbackUtils from '../../../../utils/callbackUtils';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
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
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { jsonParse } from '../../../../common/utils';
import { storeWorkflowId } from '../../../../store/actions/builder';
import { useDispatch } from 'react-redux';

const getInputs = (def) => {
  const inputCaptureRegex = /workflow\.input\.([a-zA-Z0-9-_]+)}/gim;
  let match = inputCaptureRegex.exec(def);
  const inputsArray = [];

  while (match != null) {
    inputsArray.push(match[1]);
    match = inputCaptureRegex.exec(def);
  }

  return [...new Set(inputsArray)];
};

function InputModal(props) {
  const dispatch = useDispatch();
  const [wfId, setWfId] = useState();
  const [warning, setWarning] = useState([]);
  const [status, setStatus] = useState('Execute');
  const [workflowForm, setWorkflowForm] = useState([]);
  const [waitingWfs, setWaitingWfs] = useState([]);
  const name = props.wf.name;
  const version = Number(props.wf.version);
  const wfdesc =
    jsonParse(props.wf.description)?.description ||
    (jsonParse(props.wf.description)?.description !== '' && props.wf.description);

  useEffect(() => {
    const definition = JSON.stringify(props.wf, null, 2);
    const labels = getInputs(definition);
    const inputParams = jsonParse(props.wf.inputParameters ? props.wf.inputParameters[0] : null);

    const workflowForm = labels.map((label) => ({
      label: label,
      ...(inputParams ? inputParams[label] : null),
    }));

    if (definition.match(/\bEVENT_TASK\b/)) {
      getWaitingWorkflows().then((waitingWfs) => {
        setWaitingWfs(waitingWfs);
      });
    }
    setWorkflowForm(workflowForm);
  }, [props]);

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
            const waitTasks = workflow?.tasks
              .filter((task) => task.taskType === 'WAIT')
              .map((t) => t.referenceTaskName);
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

  const handleClose = (openDetails = false) => {
    props.modalHandler(openDetails);
  };

  const handleInput = (e, i) => {
    const workflowFormCopy = [...workflowForm];
    const warningCopy = { ...warning };

    workflowFormCopy[i].value = e.target.value;
    warningCopy[i] = !!(workflowFormCopy[i].value.match(/^\s.*$/) || workflowFormCopy[i].value.match(/^.*\s$/));

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

    if (e === 'true' || e === 'false') {
      e = e == 'true';
    }

    workflowFormCopy[i].value = e;
    setWorkflowForm(workflowFormCopy);
  };

  const executeWorkflow = () => {
    const workflowFormCopy = [...workflowForm];
    const input = {};
    const payload = {
      name: name,
      version: version,
      input,
    };

    workflowFormCopy.forEach(({ label, value }) => {
      input[label] = typeof value === 'string' && value.startsWith('{') ? JSON.parse(value) : value;
    });

    const executeWorkflow = callbackUtils.executeWorkflowCallback();

    setStatus('Executing...');
    executeWorkflow(payload).then((res) => {
      setStatus(res.statusText);
      setWfId(res.text);
      dispatch(storeWorkflowId(res.text));
      timeoutBtn();

      if (props.fromBuilder) {
        handleClose(true);
      }
    });
  };

  const timeoutBtn = () => {
    setTimeout(() => setStatus('Execute'), 1000);
  };

  const inputModel = (item, i) => {
    switch (item.type) {
      case 'workflow-id':
        return (
          <Typeahead
            id={`input-${i}`}
            onChange={(e) => handleTypeahead(e, i)}
            placeholder="Enter or select workflow id"
            options={waitingWfs.map((w) => w.id)}
            defaultSelected={workflowForm[i].value}
            onInputChange={(e) => handleTypeahead(e, i)}
            renderMenuItemChildren={(option) => (
              <div>
                {option}
                <div>
                  <small>name: {waitingWfs.find((w) => w.id === option)?.name}</small>
                </div>
              </div>
            )}
          />
        );
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
          <FormControl
            onChange={(e) => handleInput(e, i)}
            placeholder="Enter the input"
            value={item.value}
            isInvalid={warning[i]}
          >
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
        return <Dropdown options={item.options} onChange={(e) => handleSwitch(e.value, i)} value={item.value} />;
      default:
        return (
          <FormControl isInvalid={warning[i]}>
            <Input onChange={(e) => handleInput(e, i)} value={item.value} placeholder="Enter the input" />
          </FormControl>
        );
    }
  };

  return (
    <Modal size="3xl" isOpen={props.show} onClose={handleClose}>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalHeader>
          {name} / {version}
          <Text fontSize={15} fontWeight="normal" color="gray.500">
            {' '}
            {wfdesc}{' '}
          </Text>
        </ModalHeader>
        <ModalBody padding={30}>
          <form onSubmit={executeWorkflow}>
            <Grid templateColumns="330px 330px" columnGap={30} rowGap={4}>
              {workflowForm.map((item, i) => {
                return (
                  <Box key={`col1-${i}`}>
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
                            <b>Constraint:</b> {item.constraint}
                          </>
                        )}
                      </FormHelperText>
                    </FormControl>
                  </Box>
                );
              })}
            </Grid>
          </form>
        </ModalBody>
        <ModalFooter>
          <a style={{ float: 'left', marginRight: '50px' }} onClick={() => props.onWorkflowIdClick(wfId)}>
            {wfId}
          </a>
          <Button
            marginRight={4}
            colorScheme={
              status === 'OK' ? 'green' : status === 'Executing...' ? 'teal' : status === 'Execute' ? 'blue' : 'red'
            }
            onClick={executeWorkflow}
          >
            {status === 'Execute' ? <i className="fas fa-play" /> : null}
            {status === 'Executing...' ? <i className="fas fa-spinner fa-spin" /> : null}
            {status === 'OK' ? <i className="fas fa-check-circle" /> : null}
            &nbsp;&nbsp;{status}
          </Button>
          <Button colorScheme="gray" onClick={() => handleClose(false)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default InputModal;
