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
} from '@chakra-ui/react';
import { ClientWorkflowWithTasks, isWorkflowNameAvailable } from '@frinx/shared';
import { isEmpty } from 'lodash';
import React, { FC, FormEvent, useRef, useState } from 'react';

type Props = {
  onWorkflowClone: (name: string) => void;
  isOpen: boolean;
  onClose: () => void;
  workflows: ClientWorkflowWithTasks[];
};

const CloneWorkflowModal: FC<Props> = ({ onWorkflowClone, isOpen, onClose, workflows }) => {
  const [wfNameError, setWfNameError] = useState<string | null>(null);

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

    onWorkflowClone(workflowName);
    handleCloneModalClose();
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
