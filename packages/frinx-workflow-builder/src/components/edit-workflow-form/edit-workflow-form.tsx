import React, { FC, useState } from 'react';
import { Button, Checkbox, Divider, Flex, FormControl, FormLabel, HStack, Input, Select } from '@chakra-ui/react';
import { Workflow } from 'helpers/types';

type Props = {
  workflow: Workflow;
  onSubmit: (workflow: Workflow) => void;
  onClose: () => void;
};

const EditWorkflowForm: FC<Props> = ({ workflow, onSubmit, onClose }) => {
  const [workflowState, setWorkflowState] = useState(workflow);
  const { name, description, version, restartable, ownerEmail, timeoutPolicy, timeoutSeconds } = workflowState;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(workflowState);
      }}
    >
      <FormControl my={6}>
        <FormLabel>Name</FormLabel>
        <Input isDisabled value={name} />
      </FormControl>
      <FormControl id="description" my={6}>
        <FormLabel>Description</FormLabel>
        <Input
          name="description"
          value={description}
          onChange={(event) => {
            event.persist();
            setWorkflowState((wf) => ({
              ...wf,
              description: event.target.value,
            }));
          }}
        />
      </FormControl>
      <FormControl id="version" my={6}>
        <FormLabel>Version</FormLabel>
        <Input
          name="version"
          value={version}
          onChange={(event) => {
            event.persist();
            setWorkflowState((wf) => ({
              ...wf,
              version: Number(event.target.value),
            }));
          }}
        />
      </FormControl>
      <FormControl id="ownerEmail" my={6}>
        <FormLabel>Owner e-mail</FormLabel>
        <Input
          name="ownerEmail"
          value={ownerEmail}
          onChange={(event) => {
            event.persist();
            setWorkflowState((wf) => ({
              ...wf,
              ownerEmail: event.target.value,
            }));
          }}
        />
      </FormControl>
      <HStack spacing={2} my={6}>
        <FormControl id="timeoutPolicy">
          <FormLabel>Timeout policy</FormLabel>
          <Select
            name="timeoutPolicy"
            value={timeoutPolicy}
            onChange={(event) => {
              event.persist();
              setWorkflowState((wf) => ({
                ...wf,
                timeoutPolicy: event.target.value,
              }));
            }}
          >
            <option value="RETRY">RETRY</option>
            <option value="TIME_OUT_WF">TIME_OUT_WF</option>
            <option value="ALERT_ONLY">RETRY</option>
          </Select>
        </FormControl>
        <FormControl id="timeoutSeconds">
          <FormLabel>Timeout seconds</FormLabel>
          <Input
            name="timeoutSeconds"
            value={timeoutSeconds}
            onChange={(event) => {
              event.persist();
              setWorkflowState((wf) => ({
                ...wf,
                timeoutSeconds: Number(event.target.value),
              }));
            }}
          />
        </FormControl>
      </HStack>
      <FormControl my={6}>
        <Flex alignItems="center">
          <Checkbox
            name="restartable"
            isChecked={restartable}
            onChange={(event) => {
              event.persist();
              setWorkflowState((wf) => ({
                ...wf,
                restartable: event.target.checked,
              }));
            }}
            id="restartable"
          />
          <FormLabel htmlFor="restartable" mb={0} ml={2}>
            Restartable
          </FormLabel>
        </Flex>
      </FormControl>
      <Divider />
      <HStack spacing={2} align="center">
        <Button type="submit" colorScheme="blue">
          Save changes
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </HStack>
    </form>
  );
};

export default EditWorkflowForm;
