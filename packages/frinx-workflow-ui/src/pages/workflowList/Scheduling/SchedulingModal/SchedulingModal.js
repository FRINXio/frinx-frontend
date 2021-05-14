import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
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
import callbackUtils from '../../../../utils/callbackUtils';
import Editor from '../../../../common/editor';

const DEFAULT_CRON_STRING = '* * * * *';

const SchedulingModal = ({ name, workflowName, workflowVersion, isOpen, onClose }) => {
  const [scheduledWf, setScheduledWf] = useState();
  const [status, setStatus] = useState();
  const [found, setFound] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const getSchedule = callbackUtils.getScheduleCallback();

    getSchedule(name)
      .then((schedule) => {
        setFound(true);
        setScheduledWf(schedule);
      })
      .catch(() => {
        setFound(false);
        setScheduledWf({
          name,
          workflowName,
          // workflowVersion must be string
          workflowVersion: workflowVersion.toString(),
          enabled: false,
          cronString: DEFAULT_CRON_STRING,
        });
      });
  }, []);

  const onRegisterSchedule = () => {
    setStatus('Submitting');

    const registerSchedule = callbackUtils.registerScheduleCallback();

    registerSchedule(name, scheduledWf)
      .then(() => {
        onClose();
      })
      .catch((err) => {
        setStatus(null);
        setError(err);
      });
  };

  const setWorkflowContext = (workflowContext) => {
    try {
      const myScheduleWf = {
        ...scheduledWf,
        workflowContext: JSON.parse(workflowContext),
      };
      setScheduledWf(myScheduleWf);
    } catch (e) {}
  };

  const getCrontabGuruUrl = () => {
    const cronString = scheduledWf?.cronString || DEFAULT_CRON_STRING;
    const url = 'https://crontab.guru/#' + cronString.replace(/\s/g, '_');
    return (
      <Link href={url} color="brand.500">
        crontab.guru
      </Link>
    );
  };

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schedule Details - {scheduledWf?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Cron Expression</FormLabel>
            <Input
              value={scheduledWf?.cronString || DEFAULT_CRON_STRING}
              onChange={(e) => {
                e.persist();
                setScheduledWf((prev) => ({ ...prev, cronString: e.target.value }));
              }}
              placeholder="Enter cron expression"
            />
            <FormHelperText>Verify using {getCrontabGuruUrl()}</FormHelperText>
          </FormControl>
          <FormControl marginTop={5} marginBottom={5}>
            <Checkbox
              onChange={(e) => {
                e.persist();
                setScheduledWf((prev) => ({ ...prev, enabled: e.target.checked }));
              }}
              isChecked={scheduledWf?.enabled || false}
            >
              Enabled
            </Checkbox>
          </FormControl>
          <FormControl>
            <FormLabel>Workflow Context</FormLabel>
            <Editor
              name="schedule_editor"
              onChange={(data) => setWorkflowContext(data)}
              value={JSON.stringify(scheduledWf?.workflowContext, null, 2)}
              height="200px"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2}>
            <pre>{error?.message}</pre>
            <Button colorScheme="blue" onClick={onRegisterSchedule} isDisabled={status != null}>
              {found ? 'Update' : 'Create'}
            </Button>
            <Button onClick={onClose}>Close</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SchedulingModal;
