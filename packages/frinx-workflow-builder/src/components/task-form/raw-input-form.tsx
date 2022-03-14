import React, { FC } from 'react';
import { FormControl, FormLabel, useTheme } from '@chakra-ui/react';
import { RawInputParams } from '../../helpers/types';
import Editor from '../common/editor';

type Props = {
  params: RawInputParams;
  onChange: (p: RawInputParams) => void;
};

const RawInputForm: FC<Props> = ({ params, onChange }) => {
  const theme = useTheme();
  const { raw } = params;

  return (
    <FormControl id="raw" my={6}>
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
      </FormControl>
  );
};

export default RawInputForm;
