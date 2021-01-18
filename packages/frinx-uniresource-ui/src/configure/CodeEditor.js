// @flow
import type { WithStyles } from '@material-ui/core';

import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';

// eslint-disable-next-line no-unused-vars
import ace from 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow';
import AceEditor from 'react-ace';

const styles = () => ({
  root: {
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '24px',
  },
  mainDiv: {},
  selectContainer: {
    padding: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

type Props = {
  setScript: Function,
} & WithStyles<typeof styles>;

const CodeEditor = (props: Props) => {
  const { classes, setScript } = props;
  const [lang, setLang] = React.useState('js');

  const [editorValue, setEditorValue] = useState(`function invoke() {
  return {"propertyName": "propertyValue"};
}`);
  // const [allocationStrategyArray, setAllocationStrategyArray] = useState([]);

  const onChange = (val) => {
    setEditorValue(val);
    setScript(val);
  };

  const handleChange = (event) => {
    setLang(event.target.value);
  };

  return (
    <div className={classes.mainDiv}>
      <div className={classes.selectContainer}>
        <Select labelId="demo-simple-select-label" id="demo-simple-select" value={lang} onChange={handleChange}>
          <MenuItem value="js">Javascript</MenuItem>
          <MenuItem value="py">Python</MenuItem>
        </Select>
      </div>

      <AceEditor
        height="300px"
        width="100%"
        mode="javascript"
        theme="tomorrow"
        onChange={onChange}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        value={editorValue}
        fontSize={16}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default withStyles(styles)(CodeEditor);
