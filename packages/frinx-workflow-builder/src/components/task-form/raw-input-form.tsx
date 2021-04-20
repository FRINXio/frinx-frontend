import React, { FC } from 'react';
import { FormControl, FormLabel, useTheme } from '@chakra-ui/react';
import AceEditor from 'react-ace';
import { RawInputParams } from '../../helpers/types';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools';

type Props = {
  params: RawInputParams;
  onChange: (p: RawInputParams) => void;
};

const RawInputForm: FC<Props> = ({ params, onChange }) => {
  const theme = useTheme();
  const { raw } = params;

  return (
    <>
      <FormControl id="raw" my={6}>
        <FormLabel>Raw</FormLabel>
        <AceEditor
          mode="javascript"
          theme="textmate"
          wrapEnabled
          value={raw}
          onChange={(value) => {
            onChange({
              ...params,
              raw: value,
            });
          }}
          enableBasicAutocompletion
          fontSize={16}
          tabSize={2}
          width="100%"
          height="200px"
          style={{
            borderRadius: theme.radii.md,
          }}
        />
      </FormControl>
    </>
  );
};

export default RawInputForm;
