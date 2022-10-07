import React, { FC, useEffect, useState } from 'react';
import AceEditor, { IAceEditorProps } from 'react-ace';

const DEFAULT_SETTINGS: IAceEditorProps = {
  theme: 'textmate',
  width: '100%',
  fontSize: 16,
  wrapEnabled: true,
  showPrintMargin: false,
};

const Editor: FC<IAceEditorProps> = ({ value, onChange, name, readOnly, mode = 'json', ...props }) => {
  const [state, setState] = useState(() => {
    try {
      return value != null ? JSON.stringify(JSON.parse(value), null, 2) : '';
    } catch {
      return value;
    }
  });

  useEffect(() => {
    try {
      setState(value != null ? JSON.stringify(JSON.parse(value), null, 2) : '');
    } catch (e) {
      setState(value);
    }
  }, [value]);

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
