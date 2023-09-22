import React, { FC } from 'react';
import { ClientWorkflow, Task, useWorkflowInputsForm, WorkflowInputsForm } from '@frinx/shared';
import { Button, Spacer, HStack } from '@chakra-ui/react';

type Props = {
  workflowDefinition?: ClientWorkflow<Task> | null;
  workflowInput?: Record<string, string | boolean | number | string[]> | null;
  onRerunClick: (values: Record<string, string | number | boolean | string[]>) => void;
};

const EditRerunTab: FC<Props> = ({ onRerunClick, workflowDefinition, workflowInput }) => {
  const { values, inputParameterKeys, parsedInputParameters, submitForm, isSubmitting, setSubmitting, handleChange } =
    useWorkflowInputsForm({
      workflow: workflowDefinition,
      onSubmit: (data) => {
        onRerunClick(data);
        setSubmitting(false);
      },
      initialValues: workflowInput,
    });

  return (
    <>
      <WorkflowInputsForm
        values={values}
        inputParameterKeys={inputParameterKeys}
        parsedInputParameters={parsedInputParameters}
        onChange={handleChange}
      />

      <HStack mt={3}>
        <Spacer />
        <Button
          isLoading={isSubmitting}
          onClick={() => {
            submitForm();
            setSubmitting(true);
          }}
          colorScheme="blue"
        >
          Rerun
        </Button>
      </HStack>
    </>
  );
};

export default EditRerunTab;
