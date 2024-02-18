import React, { useEffect, VoidFunctionComponent } from 'react';
import { Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Select, Spacer } from '@chakra-ui/react';
import { FormikErrors, FormikValues, useFormik } from 'formik';
import { Editor, unwrap } from '@frinx/shared';
import * as yup from 'yup';
import { omit } from 'lodash';
import {
  AllocationStrategyLang,
  CreateAllocationStrategyInput,
  CreateResourceTypeInput,
} from '../../__generated__/graphql';
import ExpectedProperties, { ExpectedProperty } from '../../components/expected-properties-form';

function getDefaultInvokeScript(lang: AllocationStrategyLang): string {
  switch (lang) {
    case 'go':
      return `
      package main

      import (
          "encoding/json"
          "fmt"
      )

      type LogMessage struct {
        Respool     string \`json:"respool"\`
        CurrentRes  string \`json:"currentRes"\`
      }

      func logMessage(msg LogMessage) {
          data, err := json.Marshal(msg)
          if err != nil {
              // Handle error (e.g., log it or return an error)
          }
          fmt.Println(string(data)) // Or use your preferred logging library/mechanism
      }
    
      type Result struct {
        Vlan int \`json:"vlan"\`
      }

      func Invoke() Result {
        msg := LogMessage{
            Respool:     resourcePool.ResourcePoolName,
            CurrentRes:  currentResources,
        }
        logMessage(msg) // Log the message
    
        return Result{
            Vlan: userInput.desiredVlan,
        }
      }
      `;
    case 'js':
      return `function invoke() {
          log(JSON.stringify({ respool: resourcePool.ResourcePoolName, currentRes: currentResources }));
          return { vlan: userInput.desiredVlan };
      }`;
    default:
      return `def invoke():
        log(JSON.stringify({ 'respool': resourcePool.ResourcePoolName, 'currentRes': currentResources }))
        return { 'vlan': userInput.desiredVlan }`;
  }
}

function getDefaultCapacityScript(lang: AllocationStrategyLang): string {
  switch (lang) {
    case 'go':
      return `package main

      type Capacity struct {
          free    int
          utilized int
      }
      
      func Capacity() Capacity {
          // Replace this with your actual logic for calculating capacity
          free := 0  // Example values for demonstration
          utilized := 0
      
          return Capacity{free, utilized} // Return a Capacity struct
      }`;
    case 'py':
      return `def capacity():
      # here will be your code, that will calculate capacity of the resource pool
      
      # this function needs to return free and utilized capacity of the resource pool
      # e.g. next example returns 0 for both free and utilized capacity
      return { 'free': 0, 'utilized': 0 }`;
    default:
      return `function capacity() {
      // here will be your code, that will calculate capacity of the resource pool
    
      // this function needs to return free and utilized capacity of the resource pool
      // e.g. next example returns 0 for both free and utilized capacity
      return { free: 0, utilized: 0 };
    }`;
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

  const handleSelectedLanguage = (language: AllocationStrategyLang) => {
    switch (language) {
      case 'js':
        return 'javascript';
      case 'py':
        return 'python';
      default:
        return 'go';
    }
  };

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
        tooltipLabel={`
          A resource pool is an entity that allocates and deallocates resources for a single specific resource type.
          When you are creating a new resource pool, you need to define what properties it will have.
          So, that we can use them when we will allocate resources for you.
        `}
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
          <option value="go">Go</option>
        </Select>
      </FormControl>

      <FormControl marginY={5} isRequired isInvalid={errors.capacityScript != null}>
        <FormLabel data-cy="new-strategy-editor">
          Capacity function that will calculate the capacity of resource pool
        </FormLabel>
        <Editor
          height="200px"
          width="100%"
          language={handleSelectedLanguage(values.lang)}
          value={values.capacityScript}
          onChange={(value) => {
            setFieldValue('capacityScript', value);
            if (INITIAL_VALUES.capacityScript === value) {
              setFieldTouched('capacityScript', false);
            } else {
              setFieldTouched('capacityScript', true);
            }
          }}
        />
        <FormErrorMessage>{errors.capacityScript}</FormErrorMessage>
      </FormControl>

      <FormControl marginY={5} isRequired isInvalid={errors.invokeScript != null}>
        <FormLabel data-cy="new-strategy-editor">Invoke function that will allocate resources</FormLabel>
        <Editor
          height="200px"
          width="100%"
          language={handleSelectedLanguage(values.lang)}
          value={values.invokeScript}
          onChange={(value) => {
            setFieldValue('invokeScript', value);
            if (INITIAL_VALUES.invokeScript === value) {
              setFieldTouched('invokeScript', false);
            } else {
              setFieldTouched('invokeScript', true);
            }
          }}
        />
        <FormErrorMessage>{errors.invokeScript}</FormErrorMessage>
      </FormControl>

      <ExpectedProperties
        tooltipLabel={`
          Resource type is a blueprint for how to represent a resource instance. 
          A resource type is essentially a set of property types, where each property type defines as object of
          "Name" of the property and "Type" such as int, string, float etc.
        `}
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
