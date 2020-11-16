import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Search } from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { fetchQuery, queryAllPools } from '../../queries/Queries';

const useStyles = makeStyles(() => ({
  container: {
    marginTop: '20px',
  },
}));
const ResourceTypesFilters = (props) => {
  const {
    // eslint-disable-next-line react/prop-types
    filterConstraints, updateFilterConstraint,
  } = props;

  // eslint-disable-next-line react/prop-types
  const { searchQuery, pool } = filterConstraints;
  const classes = useStyles();
  const [pools, setPools] = useState([{ Name: '' }]);

  useEffect(() => {
    fetchQuery(queryAllPools).then((val) => {
      setPools(val.data.data.QueryResourcePools);
    });
  }, []);
  return (
    <Grid container spacing={3} className={classes.container}>
      <Grid item xs={9}>
        <TextField
          placeholder="Search pools"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => updateFilterConstraint('searchQuery', e.target.value)}
          InputProps={{
            type: 'search',
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <Autocomplete
          id="combo-box-demo"
          options={pools}
          value={pool}
          getOptionLabel={(option) => option.Name}
          onChange={(e, value) => updateFilterConstraint('pool', value)}
          renderInput={(params) => <TextField {...params} label="Pool Type" variant="outlined" />}
        />
      </Grid>
    </Grid>
  );
};

export default ResourceTypesFilters;
