import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-textmate';

const DEFAULT_SETTINGS = {
  mode: 'json',
  theme: 'textmate',
  width: '100%',
  fontSize: 16,
  wrapEnabled: true,
  showPrintMargin: false,
};

function Editor({ value, onChange, name, isReadOnly, ...props }) {
  return (
    <AceEditor name={name} value={value} onChange={onChange} readOnly={isReadOnly} {...DEFAULT_SETTINGS} {...props} />
  );
}

export default Editor;
