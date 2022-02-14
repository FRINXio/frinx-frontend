import React, { FC, useState } from 'react';
import AceEditor, { IAceEditorProps } from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-graphqlschema';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools';

const DEFAULT_SETTINGS: IAceEditorProps = {
  theme: 'textmate',
  width: '100%',
  fontSize: 16,
  wrapEnabled: true,
  showPrintMargin: false,
};

const Editor: FC<IAceEditorProps> = ({ value, onChange, name, readOnly, mode = 'json', ...props }) => {
  const [state, setState] = useState(value);

  const handleChange = (val: string) => {
    setState(val);

    if (!onChange) {
      return;
    }

    if (mode === 'json') {
      try {
        JSON.parse(val);
        onChange(val);
        // eslint-disable-next-line no-empty
      } catch (e) {}
    } else {
      onChange(val);
    }
  };

  return (
    <AceEditor
      name={name}
      value={state}
      onChange={handleChange}
      readOnly={readOnly}
      mode={mode}
      {...DEFAULT_SETTINGS}
      {...props}
    />
  );
};

export default Editor;
