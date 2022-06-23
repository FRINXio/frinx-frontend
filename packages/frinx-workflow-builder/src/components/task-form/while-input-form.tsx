import React, { FC } from 'react';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import * as yup from 'yup';
import { WhileInputParams } from '../../helpers/types';

export const WhileInputParamsSchema = yup.object({
  inputParameters: yup.object({
    iterations: yup.number().required('Iterations is required'),
  }),
});

type Props = {
  params: WhileInputParams;
  errors: FormikErrors<{ inputParameters: WhileInputParams }>;
  onChange: (p: WhileInputParams) => void;
};

const WhileInputForm: FC<Props> = ({ params, errors, onChange }) => {
  const { iterations } = params;

  return (
    <FormControl id="iterations" my={6} isInvalid={errors.inputParameters?.iterations != null}>
      <FormLabel>Iterations</FormLabel>
      <Input
        name="iterations"
        variant="filled"
        value={iterations}
        onChange={(event) => {
          event.persist();
          const value = Number(event.target.value);
          if (Number.isNaN(value)) {
            return;
          }
          onChange({
            iterations: value,
          });
        }}
      />
      <FormErrorMessage>{errors.inputParameters?.iterations}</FormErrorMessage>
    </FormControl>
  );
};

export default WhileInputForm;
