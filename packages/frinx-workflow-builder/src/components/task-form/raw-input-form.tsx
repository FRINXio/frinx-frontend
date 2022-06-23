import React, { FC } from 'react';
import { FormControl, FormErrorMessage, FormLabel, useTheme } from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import * as yup from 'yup';
import { RawInputParams } from '../../helpers/types';
import Editor from '../common/editor';

export const RawInputParamsSchema = yup.object({
  inputParameters: yup.object({
    raw: yup.string().required('Raw is required'),
  }),
});

type Props = {
  params: RawInputParams;
  errors: FormikErrors<{ inputParameters: RawInputParams }>;
  onChange: (p: RawInputParams) => void;
};

const RawInputForm: FC<Props> = ({ params, errors, onChange }) => {
  const theme = useTheme();
  const { raw } = params;

  return (
    <FormControl id="raw" my={6} isInvalid={errors.inputParameters?.raw != null}>
      <FormLabel>Raw</FormLabel>
      <Editor
        name="raw-editor"
        mode="javascript"
        value={raw}
        onChange={(value) => {
          onChange({
            ...params,
            raw: value,
          });
        }}
        enableBasicAutocompletion
        height="200px"
        style={{
          borderRadius: theme.radii.md,
        }}
      />
      <FormErrorMessage>{errors.inputParameters?.raw}</FormErrorMessage>
    </FormControl>
  );
};

export default RawInputForm;
