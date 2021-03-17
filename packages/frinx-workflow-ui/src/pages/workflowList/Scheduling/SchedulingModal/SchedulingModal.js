// @flow

import AceEditor from 'react-ace';
import React, { useState } from 'react';
import callbackUtils from '../../../../utils/callbackUtils';
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

const SchedulingModal = (props) => {
  const [schedule, setSchedule] = useState();
  const [status, setStatus] = useState();
  const [error, setError] = useState();
  const [found, setFound] = useState();

  const DEFAULT_CRON_STRING = '* * * * *';

  const handleClose = () => {
    props.onClose();
  };

  const handleShow = () => {
    setSchedule(null);
    setStatus(null);
    setError(null);

    const getSchedule = callbackUtils.getScheduleCallback();

    getSchedule(props.name).then((res) => {
      if (res && res.ok) {
        // found in db
        setFound(true);
        setSchedule(res.body);
      } else {
        // not found, prepare new object to be created
        setFound(false);
        setSchedule({
          name: props.name,
          workflowName: props.workflowName,
          // workflowVersion must be string
          workflowVersion: props.workflowVersion + '',
          enabled: false,
          cronString: DEFAULT_CRON_STRING,
        });
      }
    });
  };

  const submitForm = () => {
    setError(null);
    setStatus('Submitting');

    const registerSchedule = callbackUtils.registerScheduleCallback();

    registerSchedule(props.name, schedule).then((res, err) => {
      if (res && res.ok) {
        handleClose();
      } else {
        setStatus(null);
        setError('Request failed:' + err);
      }
    });
  };

  const setCronString = (str) => {
    const mySchedule = {
      ...schedule,
      cronString: str,
    };
    setSchedule(mySchedule);
  };

  const setEnabled = (enabled) => {
    const mySchedule = {
      ...schedule,
      enabled: enabled,
    };
    setSchedule(mySchedule);
  };

  const setWorkflowContext = (workflowContext) => {
    try {
      workflowContext = JSON.parse(workflowContext);
      const mySchedule = {
        ...schedule,
        workflowContext: workflowContext,
      };
      setSchedule(mySchedule);
    } catch (e) {}
  };

  const getCronString = () => {
    if (schedule != null) {
      if (schedule.cronString != null) {
        return schedule.cronString;
      }
    }
    return DEFAULT_CRON_STRING;
  };

  const getCrontabGuruUrl = () => {
    const url = 'https://crontab.guru/#' + getCronString().replace(/\s/g, '_');
    return (
      <Link href={url} color="brand.500">
        crontab.guru
      </Link>
    );
  };

  const getEnabled = () => {
    if (schedule != null) {
      if (typeof schedule.enabled === 'boolean') {
        return schedule.enabled;
      } // backend does not send this property when disabled
    }
    return false;
  };

  const getWorkflowContext = () => {
    if (schedule) {
      return JSON.stringify(schedule.workflowContext, null, 2);
    }
  };

  const handleDelete = () => {
    setError(null);
    setStatus('Deleting');

    const deleteSchedule = callbackUtils.deleteScheduleCallback();

    deleteSchedule(props.name).then((res, err) => {
      if (res && res.ok) {
        handleClose();
      } else {
        setStatus(null);
        setError('Request failed:' + err);
      }
    });
  };

  const deleteButton = () => {
    if (found) {
      return (
        <Button colorScheme="red" onClick={handleDelete} disabled={status != null}>
          Delete
        </Button>
      );
    }
  };

  return (
    <Modal size="3xl" isOpen={props.show} onClose={handleClose} onShow={handleShow}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schedule Details - {props.name} RM_allocate_resource_from_pool:1</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={submitForm}>
            <FormControl>
              <FormLabel>Cron</FormLabel>
              <Input
                onChange={(e) => setCronString(e.target.value)}
                placeholder="Enter cron pattern"
                value={getCronString()}
              />
              <FormHelperText>Verify using {getCrontabGuruUrl()}</FormHelperText>
            </FormControl>
            <FormControl marginTop={5} marginBottom={5}>
              <Checkbox onChange={(e) => setEnabled(e.target.checked)} isChecked={getEnabled()}>
                Enabled
              </Checkbox>
            </FormControl>
            <FormControl>
              <FormLabel>Workflow Input</FormLabel>
              <AceEditor
                mode="javascript"
                theme="tomorrow"
                width="100%"
                height="100px"
                onChange={(data) => setWorkflowContext(data)}
                fontSize={16}
                value={getWorkflowContext()}
                wrapEnabled={true}
                setOptions={{
                  showPrintMargin: true,
                  highlightActiveLine: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
              />
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <pre>{error}</pre>
          <Button marginRight={4} colorScheme="blue" onClick={submitForm} disabled={status != null}>
            {found ? 'Update' : 'Create'}
          </Button>
          {deleteButton()}
          <Button colorScheme="red" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SchedulingModal;
