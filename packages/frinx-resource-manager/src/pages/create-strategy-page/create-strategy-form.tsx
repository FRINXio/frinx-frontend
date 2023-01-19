import React, { useEffect, VoidFunctionComponent } from 'react';
import { Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Select, Spacer } from '@chakra-ui/react';
import { FormikErrors, FormikValues, useFormik } from 'formik';
import { Editor, unwrap } from '@frinx/shared/src';
import * as yup from 'yup';
import { omit } from 'lodash';
import {
  AllocationStrategyLang,
  CreateAllocationStrategyInput,
  CreateResourceTypeInput,
} from '../../__generated__/graphql';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';
import ExpectedProperties, { ExpectedProperty } from '../../components/expected-properties-form';

function getDefaultInvokeScript(lang: 'js' | 'py'): string {
  if (lang === 'js') {
    return `function invoke() {
    log(JSON.stringify({ respool: resourcePool.ResourcePoolName, currentRes: currentResources }));
    return { vlan: userInput.desiredVlan };
}`;
  } else {
    return `def invoke():
  log(JSON.stringify({ 'respool': resourcePool.ResourcePoolName, 'currentRes': currentResources }))
  return { 'vlan': userInput.desiredVlan }`;
  }
}

function getDefaultCapacityScript(lang: 'js' | 'py'): string {
  if (lang === 'js') {
    return `function capacity() {
      // here will be your code, that will calculate capacity of the resource pool
    
      // this function needs to return free and utilized capacity of the resource pool
      // e.g. next example returns 0 for both free and utilized capacity
      return { free: 0, utilized: 0 };
}`;
  } else {
    return `def capacity():
    # here will be your code, that will calculate capacity of the resource pool
    
    # this function needs to return free and utilized capacity of the resource pool
    # e.g. next example returns 0 for both free and utilized capacity
    return { 'free': 0, 'utilized': 0 }`;
  }
}

const INITIAL_VALUES: FormValues = {
  name: '',
  lang: 'js',
  capacityScript: getDefaultCapacityScript('js'),
  invokeScript: getDefaultInvokeScript('js'),
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
  capacityScript: yup.string().required('Capacity script is required'),
  invokeScript: yup.string().required('Invoke script is required'),
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
  capacityScript: string;
  invokeScript: string;
  expectedPoolPropertyTypes?: ExpectedProperty[];
  resourceTypeProperties?: ExpectedProperty[];
};
type Props = {
  onFormSubmit: (values: {
    stratInput: CreateAllocationStrategyInput;
    resourceTypeInput: CreateResourceTypeInput;
  }) => void;
  onFormCancel: () => void;
};

const CreateStrategyForm: VoidFunctionComponent<Props> = ({ onFormSubmit, onFormCancel }) => {
  const {
    handleChange,
    handleSubmit,
    values,
    isSubmitting,
    setFieldValue,
    errors,
    setSubmitting,
    touched,
    setFieldTouched,
  } = useFormik({
    initialValues: INITIAL_VALUES,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema,
    onSubmit: (data) => {
      const updatedData = {
        ...data,
        script: data.capacityScript.concat('\n\n'.concat(data.invokeScript)),
      };

      onFormSubmit({
        stratInput: {
          ...omit(updatedData, ['capacityScript', 'invokeScript', 'resourceTypeProperties']),
          expectedPoolPropertyTypes: updatedData.expectedPoolPropertyTypes?.reduce(
            (acc, curr) => ({ ...acc, [curr.key]: curr.type }),
            {},
          ),
        },
        resourceTypeInput: {
          resourceName: updatedData.name,
          resourceProperties: updatedData.resourceTypeProperties?.reduce(
            (acc, curr) => ({ ...acc, [curr.key]: curr.type }),
            {},
          ),
        },
      });
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (!touched.invokeScript) {
      setFieldValue('invokeScript', getDefaultInvokeScript(values.lang));
    }

    if (!touched.capacityScript) {
      setFieldValue('capacityScript', getDefaultCapacityScript(values.lang));
    }
    // because we do not want to execute this effect when script's touched state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.lang, setFieldValue, getDefaultInvokeScript, getDefaultCapacityScript]);

  type FormErrors = typeof errors &
    FormikErrors<{ expectedPoolPropertyTypesDuplicatedKeys?: string; resourceTypePropertiesDuplicatedKeys?: string }>;
  const formErrors: FormErrors = errors;

  return (
    <form onSubmit={handleSubmit}>
      <FormControl marginY={5} id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          data-cy="new-strategy-name"
          name="name"
          id="name"
          value={values.name}
          onChange={handleChange}
          placeholder="Enter name"
        />
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
          data-cy="new-strategy-lang"
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

      <FormControl marginY={5} isRequired isInvalid={errors.capacityScript != null}>
        <FormLabel data-cy="new-strategy-editor">
          Capacity function that will calculate the capacity of resource pool
        </FormLabel>
        <Editor
          height="200px"
          width="100%"
          mode={values.lang === 'js' ? 'javascript' : 'python'}
          theme="tomorrow"
          editorProps={{ $blockScrolling: true }}
          value={values.capacityScript}
          fontSize={16}
          onChange={(value) => {
            setFieldValue('capacityScript', value);
            if (INITIAL_VALUES.capacityScript === value) {
              setFieldTouched('capacityScript', false);
            } else {
              setFieldTouched('capacityScript', true);
            }
          }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
        <FormErrorMessage>{errors.capacityScript}</FormErrorMessage>
      </FormControl>

      <FormControl marginY={5} isRequired isInvalid={errors.invokeScript != null}>
        <FormLabel data-cy="new-strategy-editor">Invoke function that will allocate resources</FormLabel>
        <Editor
          height="200px"
          width="100%"
          mode={values.lang === 'js' ? 'javascript' : 'python'}
          theme="tomorrow"
          editorProps={{ $blockScrolling: true }}
          value={values.invokeScript}
          fontSize={16}
          onChange={(value) => {
            setFieldValue('invokeScript', value);
            if (INITIAL_VALUES.invokeScript === value) {
              setFieldTouched('invokeScript', false);
            } else {
              setFieldTouched('invokeScript', true);
            }
          }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
        <FormErrorMessage>{errors.invokeScript}</FormErrorMessage>
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
        <Button data-cy="new-strategy-cancel" onClick={onFormCancel}>
          Cancel
        </Button>
        <Button data-cy="new-strategy-create" type="submit" colorScheme="blue" isLoading={isSubmitting}>
          Create strategy
        </Button>
      </HStack>
    </form>
  );
};

export default CreateStrategyForm;
