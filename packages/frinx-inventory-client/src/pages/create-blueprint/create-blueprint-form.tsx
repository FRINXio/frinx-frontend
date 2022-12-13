import { Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { VoidFunctionComponent } from 'react';
import * as yup from 'yup';

const blueprintSchema = yup.object({
  name: yup.string().required('Please enter name'),
  template: yup.string().required('Please enter template'),
});

type FormValues = {
  name: string;
  template: string;
};
type Props = {
  onFormSubmit: (values: FormValues) => void;
};

const CreateBlueprintForm: VoidFunctionComponent<Props> = ({ onFormSubmit }) => {
  const { values, handleChange, isSubmitting, handleSubmit, errors } = useFormik<FormValues>({
    initialValues: {
      name: '',
      template: '',
    },
    validationSchema: blueprintSchema,
    onSubmit: onFormSubmit,
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="name" my={6} isInvalid={errors.name != null}>
        <FormLabel>Name</FormLabel>
        <Input data-cy="deviceBlueprintAddName" type="text" value={values.name} onChange={handleChange} />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>
      <FormControl id="template" my={6} isInvalid={errors.template != null}>
        <FormLabel>Template</FormLabel>
        <Textarea
          data-cy="deviceBlueprintAddTemplate"
          value={values.template}
          minHeight="calc(100vh - 550px)"
          onChange={handleChange}
        />
        <FormErrorMessage>{errors.template}</FormErrorMessage>
      </FormControl>
      <Divider my={6} />
      <FormControl>
        <Button data-cy="deviceBlueprintAddSubmit" type="submit" colorScheme="blue" isLoading={isSubmitting}>
          Add blueprint
        </Button>
      </FormControl>
    </form>
  );
};

export default CreateBlueprintForm;
