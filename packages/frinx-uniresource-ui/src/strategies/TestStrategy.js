// @flow
// import type { WithStyles } from '@material-ui/core';

import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { withSnackbar } from 'notistack';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { fetchQuery, queryAllPools } from '../queries/Queries';

const styles = () => ({
  root: {
    padding: '24px',
  },
  card: {
    padding: '24px',
    margin: '24px 0px',
  },
});

// type Props = {
//   children: React.ChildrenArray<null | React.Element<*>>,
//   showAddEditCardFunc: Function,
// } & WithStyles<typeof styles>;

const TestStrategy = (props) => {
  const { classes } = props;
  const [selectedPool, setSelectedPool] = useState(null);
  const [pools, setPools] = useState([]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    fetchQuery(queryAllPools).then((val) => {
      setPools(val.data.data.QueryResourcePools);
    });
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3} className={classes.container}>
        <Grid item xs={8}>
          <TextareaAutosize
            placeholder="Search pools"
            variant="outlined"
            value={userInput}
            rowsMin={3}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            id="combo-box-demo"
            options={pools}
            value={selectedPool}
            getOptionLabel={(option) => option.Name}
            onChange={(e, value) => setSelectedPool(value)}
            renderInput={(params) => <TextField {...params} label="Pool" variant="outlined" />}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default withSnackbar(withStyles(styles)(TestStrategy));
