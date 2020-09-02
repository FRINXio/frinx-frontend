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
import "ace-builds/webpack-resolver";

import AllocationStrategyItem from './AllocationStrategyItem';
import {fetchQuery, queryAllocationStrats} from "../queries/Queries";
import AddEditStrategy from "../strategies/AddEditStrategy";

const iconWidth = 40;
const iconHeight = 40;

const styles = theme => ({
  root: {

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
    const [showEditCard, setShowEditCard] = useState(false);

  const onChange = val => {
    setEditorValue(val);
    console.log(val, editorValue);
  };

  useEffect(() => {
      fetchQuery(queryAllocationStrats).then(val => {
          console.log(val.data.data.QueryAllocationStrategies)
          setAllocationStrategyArray(val.data.data.QueryAllocationStrategies)
      });
  }, []);

    if(showEditCard) {
        console.log('should be visible')
        return <AddEditStrategy />
    }

  return (
    <div className={classes.mainDiv}>
      <Card>
        <div>
            <Button type="primary" onClick={() => {setShowEditCard(!showEditCard)}}>
                add new Strategy
            </Button>
        </div>
      </Card>
      <div className={classes.buttonDiv}>
        <Card>
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
