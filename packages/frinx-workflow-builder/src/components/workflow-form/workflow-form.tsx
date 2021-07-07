import React, { FC, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Select,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { omitBy } from 'lodash';
import { Workflow } from '../../helpers/types';
import { isWorkflowNameAvailable } from '../../helpers/workflow.helpers';

type PartialWorkflow = Pick<
  Workflow,
  | 'name'
  | 'description'
  | 'version'
  | 'ownerEmail'
  | 'restartable'
  | 'timeoutPolicy'
  | 'timeoutSeconds'
  | 'outputParameters'
  | 'variables'
>;
type Props = {
  workflow: PartialWorkflow;
  onSubmit: (workflow: PartialWorkflow) => void;
  canEditName: boolean;
  workflows: Workflow[];
  onClose?: () => void;
};

const WorkflowForm: FC<Props> = ({ workflow, onSubmit, onClose, workflows, canEditName }) => {
  const [workflowState, setWorkflowState] = useState(workflow);
  const { name, description, version, restartable, ownerEmail, timeoutPolicy, timeoutSeconds, outputParameters } =
    workflowState;
  const [newParam, setNewParam] = useState<string>('');
  const isNameInvalid = canEditName ? isWorkflowNameAvailable(workflows, name) : false;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(workflowState);
      }}
    >
      <FormControl my={6} isInvalid={isNameInvalid}>
        <FormLabel>Name</FormLabel>
        <Input
          isDisabled={!canEditName}
          value={name}
          name="name"
          onChange={(event) => {
            event.persist();
            setWorkflowState((wf) => ({
              ...wf,
              name: event.target.value,
            }));
          }}
        />
        <FormErrorMessage>Workflow name should be unique, choose a different one</FormErrorMessage>
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
            <option value="ALERT_ONLY">ALERT_ONLY</option>
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
      <Heading as="h3" size="md">
        Output parameters
      </Heading>
      <Box width="50%">
        <FormControl my={2}>
          <FormLabel>Add new param</FormLabel>
          <HStack spacing={2}>
            <Input
              size="sm"
              type="text"
              variant="filled"
              value={newParam}
              onChange={(event) => {
                event.persist();
                setNewParam(event.target.value);
              }}
            />
            <IconButton
              size="sm"
              isDisabled={newParam === ''}
              aria-label="add param"
              colorScheme="blue"
              icon={<AddIcon />}
              onClick={() => {
                setWorkflowState((wf) => ({
                  ...wf,
                  outputParameters: {
                    ...wf.outputParameters,
                    [newParam]: '',
                  },
                }));
                setNewParam('');
              }}
            />
          </HStack>
        </FormControl>
      </Box>
      <Box width="50%">
        <Divider />
        {Object.keys(outputParameters).map((key) => (
          <FormControl id="param" my={2} key={key}>
            <FormLabel>{key}</FormLabel>
            <HStack spacing={2}>
              <Input
                name="param"
                variant="filled"
                value={outputParameters[key]}
                onChange={(event) => {
                  event.persist();
                  setWorkflowState((wf) => ({
                    ...wf,
                    outputParameters: {
                      ...wf.outputParameters,
                      [key]: event.target.value,
                    },
                  }));
                }}
              />
              <IconButton
                aria-label="remove param"
                colorScheme="red"
                icon={<DeleteIcon />}
                onClick={() => {
                  setWorkflowState((wf) => ({
                    ...wf,
                    outputParameters: omitBy(outputParameters, (_, k) => k === key),
                  }));
                }}
              />
            </HStack>
          </FormControl>
        ))}
      </Box>
      <Divider my={6} />
      <HStack spacing={2} align="center">
        <Button type="submit" colorScheme="blue" isDisabled={isNameInvalid}>
          Save changes
        </Button>
        {onClose && <Button onClick={onClose}>Cancel</Button>}
      </HStack>
    </form>
  );
};

export default WorkflowForm;
