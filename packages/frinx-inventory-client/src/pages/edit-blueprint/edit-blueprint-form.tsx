import { FormControl, FormLabel, Input, FormErrorMessage, Textarea, Divider, Button, HStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { isEmpty, omitBy } from 'lodash';

const blueprintSchema = yup.object({
  name: yup.string(),
  template: yup.string(),
});

export type FormValues = {
  name?: string;
  template?: string;
};

type Props = {
  initialValues: FormValues;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
};

const EditBlueprintForm: FC<Props> = ({ initialValues, onSubmit, onCancel }) => {
  const { values, handleChange, isSubmitting, handleSubmit, errors } = useFormik<FormValues>({
    initialValues,
    validationSchema: blueprintSchema,
    onSubmit: (data: FormValues) => {
      const omittedData = omitBy(data, (value) => {
        return isEmpty(value.trim());
      });
      onSubmit(omittedData);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="name" my={6} isInvalid={errors.name != null}>
        <FormLabel>Name</FormLabel>
        <Input data-cy="blueprint-edit-name" type="text" value={values.name} onChange={handleChange} />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>
      <FormControl id="template" my={6} isInvalid={errors.template != null}>
        <FormLabel>Template</FormLabel>
        <Textarea
          data-cy="blueprint-edit-template"
          value={values.template}
          minHeight="calc(100vh - 550px)"
          onChange={handleChange}
        />
        <FormErrorMessage>{errors.template}</FormErrorMessage>
      </FormControl>
      <Divider my={6} />
      <FormControl>
        <HStack>
          <Button data-cy="blueprint-edit-cancel" colorScheme="gray" isLoading={isSubmitting} onClick={onCancel}>
            Cancel
          </Button>
          <Button data-cy="blueprint-edit-confirm" type="submit" colorScheme="blue" isLoading={isSubmitting}>
            Save changes
          </Button>
        </HStack>
      </FormControl>
    </form>
  );
};

export default EditBlueprintForm;
