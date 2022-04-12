import React, { FC, useState } from 'react';
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
import Editor from 'react-ace';
import { ScheduledWorkflow, Workflow } from '@frinx/workflow-ui/src/helpers/types';

const DEFAULT_CRON_STRING = '* * * * *';

type Props = {
  workflow: Workflow;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workflow: Partial<ScheduledWorkflow>) => void;
};

const SchedulingModal: FC<Props> = ({ workflow, isOpen, onClose, onSubmit }) => {
  const [scheduledWf, setScheduledWf] = useState<Partial<ScheduledWorkflow>>({
    workflowName: workflow.name,
    workflowVersion: workflow.version.toString(),
    workflowContext: {},
    name: `${workflow.name}:${workflow.version}`,
    cronString: DEFAULT_CRON_STRING,
    enabled: false,
    correlationId: workflow.correlationId,
  });

  const handleSubmit = () => {
    onSubmit(scheduledWf);
    onClose();
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
    const cronString = scheduledWf.cronString || DEFAULT_CRON_STRING;
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
        <ModalHeader>Schedule Details - {scheduledWf.workflowName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Cron Expression</FormLabel>
            <Input
              value={scheduledWf.cronString || DEFAULT_CRON_STRING}
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
              isChecked={scheduledWf.enabled || false}
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
              value={JSON.stringify(scheduledWf.workflowContext, null, 2)}
              height="400px"
              width="100%"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2}>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Update
            </Button>
            <Button onClick={onClose}>Close</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SchedulingModal;
