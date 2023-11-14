import {
  Button,
  ButtonGroup,
  chakra,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Spacer,
  Switch,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { FC } from 'react';
import { WorkflowStatus } from '../../__generated__/graphql';
import ExecutedWorkflowStatusLabels from './executed-workflow-table/executed-workflow-status-labels';

export type ExecutedWorkflowSearchQuery = {
  isRootWorkflow: boolean;
  from?: string;
  to?: string;
  status: string[];
  workflowId: string[];
  workflowType: string[];
  workflowsPerPage: number;
};

type Props = {
  isFlat: boolean;
  initialSearchValues: ExecutedWorkflowSearchQuery;
  onTableTypeChange: () => void;
  onSearchBoxSubmit: (filters: ExecutedWorkflowSearchQuery) => void;
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

const ExecutedWorkflowFilters: FC<Props> = ({ onSearchBoxSubmit, onTableTypeChange, isFlat, initialSearchValues }) => {
  const { values, handleChange, handleReset, submitForm, setFieldValue } = useFormik<ExecutedWorkflowSearchQuery>({
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
          <FormLabel>Workflow Status</FormLabel>
          {values.status != null &&
            values.status.length > 0 &&
            [...values.status, 'UNKNOWN'].map((status) => (
              <ExecutedWorkflowStatusLabels status={status} onClick={handleOnStatusClick} key={status} />
            ))}
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
          <Input background="white" name="to" value={values.to || ''} onChange={handleChange} type="datetime-local" />
        </FormControl>
        <FormControl maxWidth="max-content" display="flex" alignItems="center" alignSelf="flex-end">
          <FormLabel htmlFor="isRootWorkflows" mb="0">
            Only root workflows
          </FormLabel>
          <Switch
            id="isRootWorkflows"
            defaultValue={`${values.isRootWorkflow}`}
            isChecked={values.isRootWorkflow}
            onChange={handleChange}
            name="isRootWorkflow"
          />
        </FormControl>
        <FormControl maxWidth="max-content" display="flex" alignItems="center" alignSelf="flex-end">
          <FormLabel htmlFor="table-type" mb="0" fontWeight={isFlat ? 'thin' : 'bold'}>
            Hierarchical
          </FormLabel>
          <Switch id="table-type" isChecked={isFlat} onChange={onTableTypeChange} colorScheme="gray" />
          <FormLabel htmlFor="table-type" mb="0" ml={3} fontWeight={isFlat ? 'bold' : 'thin'}>
            Flat
          </FormLabel>
        </FormControl>
      </HStack>
      <HStack justifyContent="flex-end" marginTop={5}>
        <Button
          variant="outline"
          colorScheme="red"
          onClick={(e) => {
            e.preventDefault();
            handleReset(e);
            onSearchBoxSubmit({
              isRootWorkflow: false,
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
    </Form>
  );
};

export default ExecutedWorkflowFilters;
