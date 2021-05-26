import React, { FC } from 'react';
import AceEditor, { IAceEditorProps } from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-graphqlschema';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/ext-language_tools';

const DEFAULT_SETTINGS: IAceEditorProps = {
  mode: 'json',
  theme: 'textmate',
  width: '100%',
  fontSize: 16,
  wrapEnabled: true,
  showPrintMargin: false,
};

const Editor: FC<IAceEditorProps> = ({ value, onChange, name, readOnly, ...props }) => {
  return (
    <AceEditor name={name} value={value} onChange={onChange} readOnly={readOnly} {...DEFAULT_SETTINGS} {...props} />
  );
};

export default Editor;
