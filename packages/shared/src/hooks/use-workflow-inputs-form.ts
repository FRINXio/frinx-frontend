import { useFormik } from 'formik';
import { ClientWorkflow, Workflow } from '../helpers/workflow-api.types';
import {
  InputParameter,
  parseInputParameters,
  getDynamicInputParametersFromWorkflow,
  getInitialValuesFromParsedInputParameters,
} from '../helpers/workflow.helpers';

type HookProps = {
  workflow?: ClientWorkflow | Workflow | null;
  onSubmit: (values: Record<string, string | number | boolean | string[]>) => void;
};

type HookReturn = {
  values: Record<string, string | number | boolean | string[]>;
  isSubmitting: boolean;
  inputParameterKeys: string[];
  parsedInputParameters?: InputParameter | null;
  handleSubmit: () => void;
  submitForm: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
  handleChange: (key: string, value: string | number | boolean | string[]) => void;
};

const useWorkflowInputsForm = ({ workflow, onSubmit }: HookProps): HookReturn => {
  const parsedInputParameters = parseInputParameters(workflow?.inputParameters || []);
  const dynamicInputParameters = getDynamicInputParametersFromWorkflow(workflow);
  const { values, handleSubmit, submitForm, isSubmitting, setSubmitting, setFieldValue } = useFormik<
    Record<string, string>
  >({
    enableReinitialize: true,
    initialValues: getInitialValuesFromParsedInputParameters(parsedInputParameters, dynamicInputParameters),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit,
  });

  const inputParameterKeys = Object.keys(values);

  return {
    inputParameterKeys,
    parsedInputParameters,
    values,
    isSubmitting,
    handleSubmit,
    submitForm,
    setSubmitting,
    handleChange: setFieldValue,
  };
};

export default useWorkflowInputsForm;
