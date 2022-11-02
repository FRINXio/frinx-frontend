import React, { VoidFunctionComponent } from 'react';
import { Button, FormControl, FormLabel, HStack, Input, Select, Spacer } from '@chakra-ui/react';
import { FormikErrors, FormikValues, useFormik } from 'formik';
import { Editor, unwrap } from '@frinx/shared/src';
import * as yup from 'yup';
import { AllocationStrategyLang } from '../../__generated__/graphql';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';
import ExpectedProperties, { ExpectedProperty } from '../../components/expected-properties-form';

function getDefaultScriptValue(): string {
  return `function invoke() {
  log(JSON.stringify({ respool: resourcePool.ResourcePoolName, currentRes: currentResources }));
  return { vlan: userInput.desiredVlan };
}`;
}

const INITIAL_VALUES: FormValues = {
  name: '',
  lang: 'js',
  script: getDefaultScriptValue(),
  expectedPoolPropertyTypes: [{ key: 'address', type: 'string' }],
  resourceTypeProperties: [{ key: 'address', type: 'string' }],
};

yup.addMethod(yup.array, 'unique', function unique(message, mapper = (a: unknown) => a) {
  return this.test('unique', message, (list, context) => {
    const l = unwrap(list);
    if (l.length !== new Set(l.map(mapper)).size) {
      // we want to have duplicate error in another path to be able
      // to distinguish it frow ordinary alternateId errors (key, value)
      throw context.createError({
        path: `${context.path}DuplicatedKeys`,
        message,
      });
    }

    return true;
  });
});

const validationSchema = yup.object().shape({
  name: yup.string().required('Name of allocation strategy is required'),
  lang: yup.string().required('Language of script for allocation strategy is required'),
  script: yup.string().required('Allocation strategy script is required'),
  expectedPoolPropertyTypes: yup
    .array()
    .of(
      yup.object({
        key: yup.string().required('You need to define name of expected pool property'),
        type: yup.string().required('You need to define type of expected pool property'),
      }),
    )
    .unique('Expected pool property keys cannot repeat', (a: FormikValues) => a.key),
  resourceTypeProperties: yup
    .array()
    .of(
      yup.object({
        key: yup.string().required('You need to define name of resource type property'),
        type: yup.string().required('You need to define type of resource type property'),
      }),
    )
    .unique('Resource type property keys cannot repeat', (a: FormikValues) => a.key),
});

export type FormValues = {
  name: string;
  lang: AllocationStrategyLang;
  script: string;
  expectedPoolPropertyTypes?: ExpectedProperty[];
  resourceTypeProperties?: ExpectedProperty[];
};
type Props = {
  onFormSubmit: (values: FormValues) => void;
  onFormCancel: () => void;
};

const CreateStrategyForm: VoidFunctionComponent<Props> = ({ onFormSubmit, onFormCancel }) => {
  const { handleChange, handleSubmit, values, isSubmitting, setFieldValue, errors, setSubmitting } = useFormik({
    initialValues: INITIAL_VALUES,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit: (data) => {
      onFormSubmit(data);
      setSubmitting(false);
    },
  });

  type FormErrors = typeof errors &
    FormikErrors<{ expectedPoolPropertyTypesDuplicatedKeys?: string; resourceTypePropertiesDuplicatedKeys?: string }>;
  const formErrors: FormErrors = errors;

  return (
    <form onSubmit={handleSubmit}>
      <FormControl marginY={5} id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input name="name" id="name" value={values.name} onChange={handleChange} placeholder="Enter name" />
      </FormControl>

      <ExpectedProperties
        label="Expected pool properties"
        formErrors={{
          duplicatePropertyKey: formErrors.expectedPoolPropertyTypesDuplicatedKeys,
          propertyErrors: formErrors.expectedPoolPropertyTypes,
        }}
        expectedPropertyTypes={values.expectedPoolPropertyTypes}
        onPropertyAdd={(newProperties) => setFieldValue('expectedPoolPropertyTypes', newProperties)}
        onPropertyChange={(newProperties) => setFieldValue('expectedPoolPropertyTypes', newProperties)}
        onPropertyDelete={(newProperties) => setFieldValue('expectedPoolPropertyTypes', newProperties)}
      />

      <FormControl id="lang" marginY={5}>
        <FormLabel>Strategy script language</FormLabel>
        <Select
          id="lang"
          name="lang"
          value={values.lang}
          onChange={handleChange}
          placeholder="Select script language"
          width={60}
        >
          <option value="js">Javascript</option>
          <option value="py">Python</option>
        </Select>
      </FormControl>

      <FormControl marginY={5}>
        <FormLabel>Strategy script</FormLabel>
        <Editor
          height="450px"
          width="100%"
          mode={values.lang === 'js' ? 'javascript' : 'python'}
          theme="tomorrow"
          editorProps={{ $blockScrolling: true }}
          value={values.script}
          fontSize={16}
          onChange={(value) => {
            setFieldValue('script', value);
          }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </FormControl>

      <ExpectedProperties
        label="Expected resource type structure"
        formErrors={{
          duplicatePropertyKey: formErrors.resourceTypePropertiesDuplicatedKeys,
          propertyErrors: formErrors.resourceTypeProperties,
        }}
        expectedPropertyTypes={values.resourceTypeProperties}
        onPropertyAdd={(newProperties) => setFieldValue('resourceTypeProperties', newProperties)}
        onPropertyChange={(newProperties) => setFieldValue('resourceTypeProperties', newProperties)}
        onPropertyDelete={(newProperties) => setFieldValue('resourceTypeProperties', newProperties)}
      />

      <HStack spacing={2}>
        <Spacer />
        <Button onClick={onFormCancel}>Cancel</Button>
        <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
          Create strategy
        </Button>
      </HStack>
    </form>
  );
};

export default CreateStrategyForm;
