import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
} from '@chakra-ui/react';
import { isEmpty } from 'lodash';
import React, { FC, FormEvent, useRef, useState } from 'react';
import { Workflow } from '../../helpers/types';
import { isWorkflowNameAvailable } from '../../helpers/workflow.helpers';

type Props = {
  onWorkflowClone: (name: string) => void;
  isOpen: boolean;
  onClose: () => void;
  workflows: Workflow[];
};

const CloneWorkflowModal: FC<Props> = ({ onWorkflowClone, isOpen, onClose, workflows }) => {
  const [wfNameError, setWfNameError] = useState<string | null>(null);
  const toast = useToast();

  const cloneInputRef = useRef<HTMLInputElement | null>(null);
  const cancelCloneRef = useRef();

  const handleCloneModalClose = () => {
    setWfNameError(null);
    onClose();
  };

  const handleCloneWorkflow = (e: FormEvent = {} as FormEvent) => {
    if (!isEmpty(e)) {
      e.preventDefault();
    }

    const workflowName = cloneInputRef.current?.value;

    if (!workflowName) {
      setWfNameError('Please enter name of workflow');
      return;
    }

    if (!isWorkflowNameAvailable(workflows, workflowName)) {
      setWfNameError('Please enter another name');
      return;
    }

    try {
      onWorkflowClone(workflowName);
      handleCloneModalClose();

      toast({
        duration: 2000,
        title: `Succesfully saved workflow as ${workflowName}`,
        isClosable: true,
        status: 'success',
      });
    } catch (err) {
      toast({ duration: 2000, title: 'There was a problem with saving workflow', isClosable: true, status: 'error' });
    }
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      leastDestructiveRef={cancelCloneRef}
      onClose={handleCloneModalClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Save as</AlertDialogHeader>
          <AlertDialogBody>
            <form onSubmit={handleCloneWorkflow}>
              <FormControl isInvalid={wfNameError !== null}>
                <Input placeholder="Please enter name of workflow" ref={cloneInputRef} />
                <FormErrorMessage>{wfNameError}</FormErrorMessage>
              </FormControl>
            </form>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={handleCloneModalClose}>Cancel</Button>
            <Button colorScheme="blue" ml={4} onClick={handleCloneWorkflow}>
              Save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default CloneWorkflowModal;
