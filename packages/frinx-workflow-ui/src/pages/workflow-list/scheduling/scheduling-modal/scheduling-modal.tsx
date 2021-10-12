import React, { FC, useEffect, useState } from 'react';
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
import callbackUtils from '../../../../utils/callback-utils';
import Editor from 'react-ace';
import { ScheduledWorkflow } from '../../../../types/types';

const DEFAULT_CRON_STRING = '* * * * *';

type Props = {
  scheduledWorkflow: ScheduledWorkflow;
  isOpen: boolean;
  onClose: () => void;
};

const SchedulingModal: FC<Props> = ({ scheduledWorkflow, isOpen, onClose }) => {
  const [scheduledWf, setScheduledWf] = useState<ScheduledWorkflow>(scheduledWorkflow);
  const [status, setStatus] = useState<string | null>();
  const [found, setFound] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const getSchedule = callbackUtils.getScheduleCallback();

    getSchedule(scheduledWf.name, scheduledWf.workflowVersion)
      .then((schedule) => {
        setFound(true);
        setScheduledWf(schedule);
      })
      .catch(() => {
        setFound(false);
        setScheduledWf((prev) => {
          return {
            ...prev,
            name: scheduledWf.name,
            workflowName: scheduledWf.workflowName,
            workflowVersion: scheduledWf.workflowVersion,
            enabled: false,
            cronString: DEFAULT_CRON_STRING,
          };
        });
      });
  }, []);

  const onRegisterSchedule = () => {
    setStatus('Submitting');

    const registerSchedule = callbackUtils.registerScheduleCallback();

    registerSchedule(scheduledWf.name, scheduledWf.workflowVersion, {
      ...scheduledWf,
      workflowContext: JSON.stringify(scheduledWf?.workflowContext),
      name: `${name}:${scheduledWf.workflowVersion.toString()}`,
    })
      .then(() => {
        onClose();
      })
      .catch((err: Error) => {
        setStatus(null);
        setError(err.message);
      });
  };

  const setWorkflowContext = (workflowContext: string) => {
    try {
      const ctx = JSON.parse(workflowContext);
      const myScheduleWf = {
        ...scheduledWf,
        workflowContext: ctx,
      };
      setScheduledWf(myScheduleWf);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
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
              mode="json"
              onChange={setWorkflowContext}
              value={JSON.stringify(scheduledWf?.workflowContext, null, 2)}
              height="200px"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2}>
            <pre>{error}</pre>
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
