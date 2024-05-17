import React, { FC } from 'react';
import { ClientWorkflow, jsonParse, useWorkflowInputsForm, WorkflowInputsForm } from '@frinx/shared';
import { Button, Spacer, HStack } from '@chakra-ui/react';

type Props = {
  workflowDefinition?: ClientWorkflow | null;
  workflowInput?: Record<string, string | boolean | number | string[]> | null;
  onRerunClick: (inputParameters: string) => void;
};

const EditRerunTab: FC<Props> = ({ onRerunClick, workflowDefinition, workflowInput }) => {
  const { values, inputParameterKeys, parsedInputParameters, submitForm, isSubmitting, setSubmitting, handleChange } =
    useWorkflowInputsForm({
      workflow: workflowDefinition,
      onSubmit: (data) => {
        // Parsing needed because editor used in form returns string when JSON is provided as hint
        const result = Object.entries(data).reduce((acc, [key, value]) => {
          if (parsedInputParameters?.[key]?.type === 'json' && typeof value === 'string') {
            return { ...acc, [key]: jsonParse(value) };
          }

          return { ...acc, [key]: value };
        }, {});
        onRerunClick(JSON.stringify(result));
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
