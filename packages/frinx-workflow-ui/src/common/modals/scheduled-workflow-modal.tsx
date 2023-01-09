import React, { FC, useEffect } from 'react';
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
import { Editor, callbackUtils, ScheduledWorkflow } from '@frinx/shared/src';
import { useFormik } from 'formik';

const DEFAULT_CRON_STRING = '* * * * *';

export type ScheduledWorkflowModal = {
  cronString?: string;
  workflowName: string;
  workflowVersion: string;
  enabled?: boolean;
};

type Props = {
  workflow: ScheduledWorkflowModal;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workflow: Partial<ScheduledWorkflow>) => void;
};

const SchedulingModal: FC<Props> = ({ workflow, isOpen, onClose, onSubmit }) => {
  const { getSchedule } = callbackUtils.getCallbacks;

  const { values, handleChange, handleSubmit, submitForm, setFieldValue } = useFormik({
    initialValues: {
      enableReinitialize: true,
      workflowName: workflow.workflowName,
      workflowVersion: workflow.workflowVersion,
      workflowContext: {},
      name: `${workflow.workflowName}:${workflow.workflowVersion}`,
      cronString: workflow.cronString || DEFAULT_CRON_STRING,
      enabled: workflow.enabled ?? false,
    },
    onSubmit: (formValues) => {
      onSubmit(formValues);
      onClose();
    },
  });

  useEffect(() => {
    getSchedule(workflow.workflowName, workflow.workflowVersion).then((scheduledWorkflow) => {
      setFieldValue('workflowContext', scheduledWorkflow.workflowContext ?? {});
    });
  }, [workflow, getSchedule, setFieldValue]);

  const getCrontabGuruUrl = () => {
    const cronString = values.cronString || DEFAULT_CRON_STRING;
    const url = `https://crontab.guru/#${cronString.replace(/\s/g, '_')}`;
    return (
      <Link href={url} color="blue.500">
        crontab.guru
      </Link>
    );
  };

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Schedule Details - {values.workflowName}:{values.workflowVersion}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <FormControl>
              <FormLabel>Cron Expression</FormLabel>
              <Input
                value={values.cronString}
                onChange={handleChange}
                name="cronString"
                placeholder="Enter cron expression"
              />
              <FormHelperText>Verify using {getCrontabGuruUrl()}</FormHelperText>
            </FormControl>
            <FormControl marginTop={5} marginBottom={5}>
              <Checkbox onChange={handleChange} name="enabled" isChecked={values.enabled}>
                Enabled
              </Checkbox>
            </FormControl>
            <FormControl>
              <FormLabel>Workflow Context</FormLabel>
              <Editor
                name="workflowContext"
                mode="json"
                onChange={(e) => {
                  try {
                    const parsedJSON = JSON.parse(e);
                    setFieldValue('workflowContext', parsedJSON);
                  } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error(error);
                  }
                }}
                value={JSON.stringify(values.workflowContext, null, 2)}
                height="400px"
                width="100%"
              />
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2}>
            <Button colorScheme="blue" onClick={submitForm}>
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
