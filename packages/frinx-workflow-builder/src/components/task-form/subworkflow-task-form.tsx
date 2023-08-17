import {
  ClientWorkflow,
  getDynamicInputParametersFromWorkflow,
  parseInputParameters,
  WorkflowInputsForm,
  getAvailableInputParamsOfWorkflow,
} from '@frinx/shared';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  taskInputParameters: Record<string, string>;
  workflow: ClientWorkflow;
  onChange: (inputParameters: Record<string, string>) => void;
};

function isWorkflowInputParamKeyAlreadyInTaskInputParams(
  taskInputParams: Record<string, string>,
  workflowAvailableInputParamKey: string,
): boolean {
  const taskInputParamsEntries = Object.entries(taskInputParams);

  return taskInputParamsEntries.some(([taskInputParamKey]) => taskInputParamKey === workflowAvailableInputParamKey);
}

function removeAlreadyExistingPropertiesFromWorkflowAvailableInputParams(
  taskInputParams: Record<string, string>,
  workflowAvailableInputParams: Record<string, string>,
): Record<string, string> {
  const workflowAvailableInputParamsEntries = Object.entries(workflowAvailableInputParams);

  return workflowAvailableInputParamsEntries.reduce(
    (acc, [workflowAvailableInputParamKey, workflowAvailableInputParamValue]) => {
      if (isWorkflowInputParamKeyAlreadyInTaskInputParams(taskInputParams, workflowAvailableInputParamKey)) {
        return acc;
      }

      return {
        ...acc,
        [workflowAvailableInputParamKey]: workflowAvailableInputParamValue,
      };
    },
    {},
  );
}

const SubworkflowTaskForm: VoidFunctionComponent<Props> = ({ taskInputParameters, workflow, onChange }) => {
  const parsedWorkflowInputParams = parseInputParameters(workflow.inputParameters);
  const dynamicWorkflowInputParams = getDynamicInputParametersFromWorkflow(workflow);
  const availableInputParamsOfWorkflowEntries = getAvailableInputParamsOfWorkflow(
    parsedWorkflowInputParams,
    dynamicWorkflowInputParams,
  );

  const handleOnChange = (key: string, value: string | number | boolean) => {
    onChange({
      ...taskInputParameters,
      [key]: value.toString(),
    });
  };

  const parsedInputParameters = Object.keys({
    ...removeAlreadyExistingPropertiesFromWorkflowAvailableInputParams(
      taskInputParameters,
      availableInputParamsOfWorkflowEntries,
    ),
    ...taskInputParameters,
  }).sort();

  return (
    <WorkflowInputsForm
      inputParameterKeys={parsedInputParameters}
      onChange={handleOnChange}
      values={taskInputParameters}
    />
  );
};

export default SubworkflowTaskForm;
