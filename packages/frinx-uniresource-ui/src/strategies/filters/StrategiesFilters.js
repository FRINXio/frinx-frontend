import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Search } from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(() => ({
  container: {
    marginTop: '20px',
  },
}));
const StrategiesFilters = (props) => {
  const {
    // eslint-disable-next-line react/prop-types
    filterConstraints,
    updateFilterConstraint,
  } = props;
  // eslint-disable-next-line react/prop-types
  const { searchQuery, lang } = filterConstraints;

  const classes = useStyles();

  const options = ['js', 'py'];
  return (
    <Grid container spacing={3} className={classes.container}>
      <Grid item xs={9}>
        <TextField
          placeholder="Search strategies"
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
          options={options}
          value={lang}
          getOptionLabel={(option) => option}
          onChange={(e, value) => updateFilterConstraint('lang', value)}
          renderInput={(params) => <TextField {...params} label="Lang" variant="outlined" />}
        />
      </Grid>
    </Grid>
  );
};

export default StrategiesFilters;
