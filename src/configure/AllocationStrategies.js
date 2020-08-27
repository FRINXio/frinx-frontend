// @flow
import type {WithStyles} from '@material-ui/core';

import * as React from 'react';
import * as axios from 'axios';
import AceEditor from 'react-ace';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import {graphql} from 'graphql';
import {motion} from 'framer-motion';
import {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow';
import AllocationStrategyItem from './AllocationStrategyItem';

const iconWidth = 40;
const iconHeight = 40;

const styles = theme => ({
  root: {
    color: theme.palette.grey[900],
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '24px',
  },
  mainDiv: {
    padding: '24px',
  },
  buttonDiv: {
    marginTop: '20px',
  },
});

type Props = {
  title: string,
  children: React.ChildrenArray<null | React.Element<*>>,
  className?: string,
} & WithStyles<typeof styles>;

const AllocationStrategies = (props: Props) => {
  const {className, classes, children} = props;
  const [editorValue, setEditorValue] = useState(`function onLoad(editor) {
  console.log("i've loaded");
}`);
  const [allocationStrategyArray, setAllocationStrategyArray] = useState([]);

  const onChange = val => {
    setEditorValue(val);
    console.log(val, editorValue);
  };

  // useEffect(() => {
  //   fetchQuery(queryAllocationStrats);
  // }, []);

  return (
    <div className={classes.mainDiv}>
      <Card>
        <div style={{display: 'none'}}>
          <AceEditor
            mode="javascript"
            theme="tomorrow"
            onChange={onChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{$blockScrolling: true}}
            value={editorValue}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </div>
      </Card>
      <div className={classes.buttonDiv}>
        <Card>
          <Button
            variant="contained"
            onClick={() => {
              fetchQuery(queryAllocationStrats).then(val => {
                console.log(val);
              });
            }}>
            queryAllocationStrats
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              createAllocationStrategy();
            }}>
            createAllocationStrat
          </Button>
        </Card>
      </div>
      {allocationStrategyArray.map(e => {
        const {ID, Lang, Name, Script} = e;
        return (
          <div>
            <AllocationStrategyItem
              allocationStrategyItemProps={{id: ID, Lang, Name, Script}}
            />
          </div>
        );
      })}
    </div>
  );
};

export default withStyles(styles)(AllocationStrategies);
