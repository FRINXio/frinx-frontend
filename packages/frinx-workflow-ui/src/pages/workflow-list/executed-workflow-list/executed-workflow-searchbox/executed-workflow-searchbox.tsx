import {
  Button,
  ButtonGroup,
  Card,
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
import { ExecutedWorkflowStatus } from '../../../../__generated__/graphql';
import ExecutedWorkflowStatusLabels from '../executed-workflow-table/executed-workflow-status-labels';

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

const EXECUTED_WORKFLOW_POSSIBLE_STATUSES: ExecutedWorkflowStatus[] = [
  'COMPLETED',
  'FAILED',
  'PAUSED',
  'RUNNING',
  'TERMINATED',
  'TIMED_OUT',
];

const ExecutedWorkflowSearchBox: FC<Props> = ({
  onSearchBoxSubmit,
  onTableTypeChange,
  isFlat,
  initialSearchValues,
}) => {
  const { values, handleChange, handleReset, submitForm, setFieldValue } = useFormik<ExecutedWorkflowSearchQuery>({
    initialValues: initialSearchValues,
    onSubmit: onSearchBoxSubmit,
  });

  const handleOnStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const label = event.target.value;

    setFieldValue('status', [...new Set([...values.status, label])]);
  };

  const handleOnStatusClick = (status: ExecutedWorkflowStatus | 'UNKNOWN') => {
    setFieldValue(
      'status',
      values.status.filter((s) => s !== status),
    );
  };

  return (
    <Card shadow="md" rounded="lg" backgroundColor="white" p={15}>
      <HStack alignItems="flex-end">
        <FormControl>
          <FormLabel>Workflow Name</FormLabel>
          <Input name="workflowType" value={values.workflowType} onChange={handleChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Workflow ID</FormLabel>
          <Input name="workflowId" value={values.workflowId} onChange={handleChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Workflow Status</FormLabel>
          {values.status != null && values.status.length > 0 && (
            <HStack mb={5}>
              {values.status
                .map((s) => {
                  if (
                    s === 'PAUSED' ||
                    s === 'TERMINATED' ||
                    s === 'RUNNING' ||
                    s === 'COMPLETED' ||
                    s === 'FAILED' ||
                    s === 'TIMED_OUT'
                  ) {
                    return s;
                  }
                  return 'UNKNOWN';
                })
                .map((status) => (
                  <ExecutedWorkflowStatusLabels status={status} onClick={handleOnStatusClick} key={status} />
                ))}
            </HStack>
          )}
          <Select placeholder="Select option" value="" onChange={handleOnStatusChange}>
            {EXECUTED_WORKFLOW_POSSIBLE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </FormControl>
      </HStack>

      <HStack mt={15}>
        <FormControl>
          <FormLabel>Start Time (From)</FormLabel>
          <Input name="from" value={values.from} onChange={handleChange} type="datetime-local" />
        </FormControl>

        <FormControl>
          <FormLabel>Start Time (To)</FormLabel>
          <Input name="to" value={values.to || ''} onChange={handleChange} type="datetime-local" />
        </FormControl>

        <Spacer />

        <FormControl>
          <FormLabel>Workflows per page</FormLabel>
          <Select
            name="workflowsPerPage"
            value={values.workflowsPerPage}
            placeholder="Select option"
            onChange={(e) => setFieldValue('workflowsPerPage', Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </FormControl>
      </HStack>

      <HStack mt={15} alignContent="start">
        <FormControl maxWidth="max-content" display="flex" alignItems="center">
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

        <span>|</span>

        <FormControl maxWidth="max-content" display="flex" alignItems="center">
          <FormLabel htmlFor="table-type" mb="0" fontWeight={isFlat ? 'thin' : 'bold'}>
            Hierarchical
          </FormLabel>
          <Switch id="table-type" isChecked={isFlat} onChange={onTableTypeChange} colorScheme="gray" />
          <FormLabel htmlFor="table-type" mb="0" ml={3} fontWeight={isFlat ? 'bold' : 'thin'}>
            Flat
          </FormLabel>
        </FormControl>
      </HStack>

      <HStack mt={15}>
        <Spacer />

        <ButtonGroup>
          <Button
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
          <Button colorScheme="blue" onClick={submitForm}>
            Search
          </Button>
        </ButtonGroup>
      </HStack>
    </Card>
  );
};

export default ExecutedWorkflowSearchBox;
