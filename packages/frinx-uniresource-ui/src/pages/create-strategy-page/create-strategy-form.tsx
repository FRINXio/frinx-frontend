import React, { VoidFunctionComponent } from 'react';
import { Button, FormControl, FormLabel, HStack, Input, Select, Spacer } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { Editor, unwrap } from '@frinx/shared/src';
import * as yup from 'yup';
import { AllocationStrategyLang } from '../../__generated__/graphql';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';
import ExpectedProperties from './expected-properties-form';

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

// eslint-disable-next-line func-names
yup.addMethod(yup.array, 'unique', function (message, mapper = (a: unknown) => a) {
  return this.test('unique', message, (list, context) => {
    const l = unwrap(list);
    if (l.length !== new Set(l.map(mapper)).size) {
      // we want to have duplicate error in another path to be able
      // to distinguish it frow ordinary alternateId errors (key, value)
      throw context.createError({
        path: 'duplicatePropertyKey',
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
    // TODO: check suggested solution https://github.com/jquense/yup/issues/345#issuecomment-634718990
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .unique('Expected pool property keys cannot repeat', (a: FormikValues) => a.key),
  resourceTypeProperties: yup
    .array()
    .of(
      yup.object({
        key: yup.string().required('You need to define name of resource type property'),
        type: yup.string().required('You need to define type of resource type property'),
      }),
    )
    // TODO: check suggested solution https://github.com/jquense/yup/issues/345#issuecomment-634718990
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .unique('Resource type property keys cannot repeat', (a: FormikValues) => a.key),
});

export type FormValues = {
  name: string;
  lang: AllocationStrategyLang;
  script: string;
  expectedPoolPropertyTypes?: { key: string; type: string }[];
  resourceTypeProperties?: { key: string; type: string }[];
};
type Props = {
  onFormSubmit: (values: FormValues) => void;
};

const CreateStrategyForm: VoidFunctionComponent<Props> = ({ onFormSubmit }) => {
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

  return (
    <form onSubmit={handleSubmit}>
      <FormControl marginY={5} id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input name="name" id="name" value={values.name} onChange={handleChange} placeholder="Enter name" />
      </FormControl>
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
      <ExpectedProperties
        label="Expected pool properties"
        formErrors={{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          duplicatePropertyKey: errors.duplicatePropertyKey,
          propertyErrors: errors.expectedPoolPropertyTypes as any,
        }}
        expectedPoolPropertyTypes={values.expectedPoolPropertyTypes}
        onPropertyAdd={(newProperties) => setFieldValue('expectedPoolPropertyTypes', newProperties)}
        onPropertyChange={(newProperties) => setFieldValue('expectedPoolPropertyTypes', newProperties)}
        onPropertyDelete={(newProperties) => setFieldValue('expectedPoolPropertyTypes', newProperties)}
      />

      <ExpectedProperties
        label="Expected resource type properties"
        formErrors={{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          duplicatePropertyKey: errors.duplicatePropertyKey,
          propertyErrors: errors.resourceTypeProperties as any,
        }}
        expectedPoolPropertyTypes={values.resourceTypeProperties}
        onPropertyAdd={(newProperties) => setFieldValue('resourceTypeProperties', newProperties)}
        onPropertyChange={(newProperties) => setFieldValue('resourceTypeProperties', newProperties)}
        onPropertyDelete={(newProperties) => setFieldValue('resourceTypeProperties', newProperties)}
      />
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
      <HStack>
        <Spacer />
        <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
          Create strategy
        </Button>
      </HStack>
    </form>
  );
};

export default CreateStrategyForm;
