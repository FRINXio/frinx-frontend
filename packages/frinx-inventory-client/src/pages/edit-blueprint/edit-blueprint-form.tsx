import { FormControl, FormLabel, Input, FormErrorMessage, Textarea, Divider, Button, HStack } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

const blueprintSchema = yup.object({
  name: yup.string().required('Please enter name'),
  template: yup.string().required('Please enter template'),
});

export type FormValues = {
  name: string;
  template: string;
};

type Props = {
  initialValues: {
    name: string;
    template: string;
  };
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
};

const EditBlueprintForm: FC<Props> = ({ initialValues, onSubmit, onCancel }) => {
  const { values, handleChange, isSubmitting, submitForm, errors } = useFormik<FormValues>({
    initialValues,
    validationSchema: blueprintSchema,
    onSubmit,
  });

  return (
    <form onSubmit={submitForm}>
      <FormControl id="name" my={6} isInvalid={errors.name != null}>
        <FormLabel>Name</FormLabel>
        <Input type="text" value={values.name} onChange={handleChange} />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>
      <FormControl id="template" my={6} isInvalid={errors.template != null}>
        <FormLabel>Template</FormLabel>
        <Textarea value={values.template} onChange={handleChange} />
        <FormErrorMessage>{errors.template}</FormErrorMessage>
      </FormControl>
      <Divider my={6} />
      <FormControl>
        <HStack>
          <Button colorScheme="gray" isLoading={isSubmitting} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
            Edit blueprint
          </Button>
        </HStack>
      </FormControl>
    </form>
  );
};

export default EditBlueprintForm;
