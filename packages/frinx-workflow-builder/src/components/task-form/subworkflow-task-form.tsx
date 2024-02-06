import {
  ClientWorkflowWithTasks,
  getDynamicInputParametersFromWorkflow,
  parseInputParameters,
  WorkflowInputsForm,
  getAvailableInputParamsOfWorkflow,
} from '@frinx/shared';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  taskInputParameters: Record<string, string>;
  workflow: ClientWorkflowWithTasks;
  onChange: (inputParameters: Record<string, string>) => void;
};

const SubworkflowTaskForm: VoidFunctionComponent<Props> = ({ taskInputParameters, workflow, onChange }) => {
  const parsedWorkflowInputParams = parseInputParameters(workflow.inputParameters);
  const dynamicWorkflowInputParams = getDynamicInputParametersFromWorkflow(workflow);
  const availableInputParamsOfWorkflowEntries = getAvailableInputParamsOfWorkflow(
    parsedWorkflowInputParams,
    dynamicWorkflowInputParams,
  );

  const handleOnChange = (key: string, value: string | number | boolean | string[]) => {
    if (typeof value === 'object' && Array.isArray(value)) {
      onChange({
        ...taskInputParameters,
        [key]: JSON.stringify(value),
      });
      return;
    }

    onChange({
      ...taskInputParameters,
      [key]: value.toString(),
    });
  };

  const parsedInputParameters = Object.keys({
    ...availableInputParamsOfWorkflowEntries,
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
