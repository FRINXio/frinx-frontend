// @flow
import type {WithStyles} from '@material-ui/core';

import * as React from 'react';
import * as axios from 'axios';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import PoolItem from './PoolItem';
import classNames from 'classnames';
import {fetchQuery, queryAllPools} from '../queries/Queries';
import {graphql} from 'graphql';
import {motion} from 'framer-motion';
import {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';

const iconWidth = 40;
const iconHeight = 40;

const styles = theme => ({
  root: {

    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '24px',
  },
  cardContainerCollapsed: {
    display: 'flex',
    transition: 'all 0.935s ease-in-out',
  },
  cardContainerNotCollapsed: {
    display: 'block',
    transition: 'all 0.935s ease-in-out',
  },
  iconButton: {
    margin: '15px',
    padding: '10px',
    width: iconWidth + 'px',
    height: iconHeight + 'px',
    backgroundColor: '#aaaaff',

    border: '2px solid black',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = {
  title: string,
  children: React.ChildrenArray<null | React.Element<*>>,
  className?: string,
} & WithStyles<typeof styles>;

const PoolCard = (props: Props) => {
  const {className, classes, children} = props;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [poolArray, setPoolArray] = useState([]);

  useEffect(() => {
    fetchQuery(queryAllPools).then(val => {
      console.log('val', val.data.data.QueryResourcePools);
      setPoolArray(val.data.data.QueryResourcePools);
      console.log(poolArray);
    }).catch(function (error) {
      console.log(error); //TODO error handling
    });
  }, []);

  const divs = [];
  for (let i = 0; i < 3; i++) {
    console.log(i);
    divs.push(i);
  }
  console.log('divs', divs);
  return (
    <div>
      <Card>
        <div>
          {/*{[].map((e ,i) => {*/}
          {/*    return <motion.div*/}
          {/*        animate={isCollapsed ? "collapsed" : "notCollapsed"}*/}
          {/*        transition={{ duration: 0.1 + (i * 0.02) }}*/}
          {/*        variants={variants}*/}
          {/*        custom={i}*/}
          {/*        className={classes.iconButton}*/}
          {/*    >*/}
          {/*        <div>{i, e}</div>*/}
          {/*    </motion.div>*/}
          {/*})}*/}
        </div>

        <div>
          {poolArray.map((e, i) => {
            const {ID, Name, PoolType} = e;
            return <PoolItem key={i} poolItem={{id: ID, PoolType, Name}} i={i} />;
          })}
        </div>

        <div>
          <Button
            variant="contained"
            onClick={() => {
              fetchQuery();
            }}>
            Switch
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setIsCollapsed(!isCollapsed);
            }}>
            Switch
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default withStyles(styles)(PoolCard);
