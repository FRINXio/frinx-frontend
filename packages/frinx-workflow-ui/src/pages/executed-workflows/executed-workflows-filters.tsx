import { Button, chakra, Flex, FormControl, FormLabel, HStack, Input, Select } from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { FC } from 'react';
import WorkflowStatusLabel from '../../components/workflow-status-label/workflow-status-label';
import { WorkflowStatus } from '../../__generated__/graphql';
import { ExecutedWorkflowSearchQuery } from './executed-workflows.helpers';

type Props = {
  initialSearchValues: ExecutedWorkflowSearchQuery;
  onSearchBoxSubmit: (filters: Partial<ExecutedWorkflowSearchQuery>) => void;
};

const EXECUTED_WORKFLOW_POSSIBLE_STATUSES: WorkflowStatus[] = [
  'COMPLETED',
  'FAILED',
  'PAUSED',
  'RUNNING',
  'TERMINATED',
  'TIMED_OUT',
];

const Form = chakra('form');

const ExecutedWorkflowsFilters: FC<Props> = ({ onSearchBoxSubmit, initialSearchValues }) => {
  const { values, handleChange, handleReset, submitForm, setFieldValue } = useFormik<ExecutedWorkflowSearchQuery>({
    enableReinitialize: false,
    initialValues: initialSearchValues,
    onSubmit: onSearchBoxSubmit,
  });

  const handleOnStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const label = event.target.value;

    setFieldValue('status', [...new Set([...values.status, label])]);
  };

  const handleOnStatusClick = (status: WorkflowStatus | 'UNKNOWN') => {
    setFieldValue(
      'status',
      values.status.filter((s) => s !== status),
    );
  };

  return (
    <Form
      marginBottom={8}
      onSubmit={(event) => {
        event.preventDefault();
        submitForm();
      }}
    >
      <HStack spacing={4} marginBottom={4}>
        <FormControl>
          <FormLabel>Workflow Name</FormLabel>
          <Input background="white" name="workflowType" value={values.workflowType} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Workflow ID</FormLabel>
          <Input background="white" name="workflowId" value={values.workflowId} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <Flex alignItems="center">
            <FormLabel>Workflow Status</FormLabel>
            <HStack>
              {values.status != null &&
                values.status.length > 0 &&
                (values.status as WorkflowStatus[]).map((status) => (
                  <WorkflowStatusLabel status={status ?? 'UNKNOWN'} onClick={handleOnStatusClick} key={status} />
                ))}
            </HStack>
          </Flex>
          <Select background="white" placeholder="Select option" value="" onChange={handleOnStatusChange}>
            {EXECUTED_WORKFLOW_POSSIBLE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </FormControl>
      </HStack>
      <HStack spacing={4}>
        <FormControl>
          <FormLabel>Start Time (From)</FormLabel>
          <Input background="white" name="from" value={values.from} onChange={handleChange} type="datetime-local" />
        </FormControl>
        <FormControl>
          <FormLabel>Start Time (To)</FormLabel>
          <Input background="white" name="to" value={values.to} onChange={handleChange} type="datetime-local" />
        </FormControl>
        <HStack justifyContent="flex-end" alignSelf="flex-end">
          <Button
            variant="outline"
            colorScheme="red"
            onClick={(e) => {
              e.preventDefault();
              handleReset(e);
              onSearchBoxSubmit({
                ...values,
                workflowsPerPage: values.workflowsPerPage,
                status: [],
                workflowId: [],
                workflowType: [],
              });
            }}
          >
            Clear
          </Button>
          <Button colorScheme="blue" type="submit">
            Search
          </Button>
        </HStack>
      </HStack>
    </Form>
  );
};

export default ExecutedWorkflowsFilters;
