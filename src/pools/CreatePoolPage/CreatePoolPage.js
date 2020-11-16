import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { withSnackbar } from 'notistack';
import { createPool } from './createPoolQueries';
import { fetchQuery, queryFilterOptions } from '../../queries/Queries';

// ENUM : probably query in future (?)
const ALLOCATING = 'allocating';

const POOL_TYPES = ['set', ALLOCATING, 'singleton'];

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '20px',
  },
  paper: {
    padding: '50px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  btnContainer: {
    marginLeft: '20px',
  },
  buttons: {
    margin: theme.spacing(0.5),
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  resourceTypes: {
    '& .MuiTextField-root': {
      marginRight: theme.spacing(2),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  },
  resourceList: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
    padding: 0,
  },
  resourceListButtons: {
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  propertyRow: {
    display: 'flex',
    alignItems: 'flex-end',
    width: '100%',
  },
  selectContainer: {
    width: '80px',
  },
  textfieldContainer: {
    marginLeft: '12px',
  },
  addNewButton: {
    width: '50px',
  },
}));

const CreatePoolPage = (props) => {
  // eslint-disable-next-line react/prop-types
  const { enqueueSnackbar, setShowCreatePool } = props;
  const classes = useStyles();
  const [poolName, setPoolName] = useState('');
  const [description, setDescription] = useState('');
  const [poolType, setPoolType] = useState('set');
  const [allocationStrategy, setAllocationStrategy] = useState(null);
  const [resourceType, setResourceType] = useState(null);
  const [dealocationPeriod, setDealocationPeriod] = useState(0);
  const [poolValues, setPoolValues] = useState([]);
  const [selectors, setSelectors] = useState({
    QueryAllocationStrategies: [],
    QueryResourceTypes: [],
    QueryTags: [],
  });
  const [poolProperties, setPoolProperties] = useState([{ value: '', key: '', type: '' }]);
  const [error, setError] = useState(true);
  const [selectedResources, setSelectedResources] = useState([]);

  useEffect(() => {
    fetchQuery(queryFilterOptions).then((res) => {
      setSelectors(res.data.data);
    }).catch((err) => {
      console.log(err); // TODO error handling
    });
  }, []);

  useEffect(() => {
    if (error && poolName.length > 0 && poolType && resourceType) {
      setError(false);
    }
  }, [poolName, poolType, resourceType, dealocationPeriod, allocationStrategy]);

  const createNewPool = () => {
    const poolPropertyTypes = {};
    const poolPropertiesInput = {};
    poolProperties.map((prop) => {
      poolPropertyTypes[prop.key] = prop.type;
      poolPropertiesInput[prop.key] = prop.value;
      return prop;
    });
    console.log(poolPropertyTypes);

    const pool = {
      poolName,
      description,
      poolType,
      allocationStrategy,
      resourceType,
      dealocationPeriod,
      poolValues,
      poolProperties: poolPropertiesInput,
      poolPropertyTypes,
    };

    createPool(pool).then((res, err) => {
      console.log(res, err);
      if (err) {
        enqueueSnackbar(err.message, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Pool Created', {
          variant: 'success',
        });
      }
    }).catch((err) => {
      console.log('here', err);
      if (err) {
        console.log(err);
        enqueueSnackbar(err.message, {
          variant: 'error',
        });
      }
    });
  };

  const renderDealocationPeriod = () => (
    <Grid item xs={3}>
      <TextField
        id="standard-full-width"
        label="Dealocation safety period"
        fullWidth
        required
        value={dealocationPeriod}
        onChange={(e) => setDealocationPeriod(e.target.value)}
        defaultValue={0}
        type="number"
        inputProps={{ min: 0, step: 1000 }}
      />
    </Grid>
  );

  const renderAllocationStrategy = () => (
    <Grid item xs={3}>
      <Autocomplete
        id="combo-box-demo"
        options={selectors.QueryAllocationStrategies}
        value={allocationStrategy}
        getOptionLabel={(option) => option.Name}
        onChange={(e, value) => setAllocationStrategy(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Allocation Strategy"
            required
            placeholder="Select Allocation Strategy"
          />
        )}
      />
    </Grid>
  );

  const handleAddResource = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    let resource = {};
    const propertyTypes = resourceType?.PropertyTypes || [];
    for (let i = 0; i < propertyTypes.length; i += 1) {
      resource = {
        ...resource,
        [propertyTypes[i].Name]: data.get(`propertyValue-${propertyTypes[i].Name}`),
      };
    }

    setPoolValues((oldValues) => [...oldValues, resource]);
  };

  const addResourceForm = () => (
    <form autoComplete="off" onSubmit={handleAddResource}>
      <Grid container item xs={12} spacing={3}>
        {resourceType?.PropertyTypes.map((pt) => (
          <Grid item xs={12} key={`propertyValue-${pt.Name}`}>
            <TextField
              name={`propertyValue-${pt.Name}`}
              label={`${pt.Name} (${pt?.Type})`}
              type={pt?.Type === 'int' ? 'number' : 'text'}
              variant="outlined"
              fullWidth
              required
            />
          </Grid>
        ))}
        <Grid item xs={6}>
          <Button type="submit" color="primary" variant="contained" size="large">Add</Button>
        </Grid>
      </Grid>
    </form>
  );
  const handleResourceCheckboxChange = (event, i) => {
    const tmp = selectedResources;
    tmp[i] = event.target.checked;
    setSelectedResources(tmp);
  };

  const resourceList = () => (
    <List className={classes.resourceList}>
      <ListSubheader>{Object.keys(poolValues[0] || []).join(' - ')}</ListSubheader>
      {poolValues.map((item, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <ListItem key={`item-${i}`} dense button onClick={null}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              tabIndex={-1}
              disableRipple
              onChange={(val) => { handleResourceCheckboxChange(val, i); }}
            />
          </ListItemIcon>
          {Object.values(item).map((v) => <ListItemText primary={v} />)}
        </ListItem>
      ))}
    </List>
  );

  const poolPropertiesList = () => {
    const onPropValueChanged = (val, index) => {
      const tmp = poolProperties;
      tmp[index].value = val.target.value;
      setPoolProperties(tmp);
    };
    const onPropKeyChanged = (val, index) => {
      const tmp = poolProperties;
      tmp[index].key = val.target.value;
      setPoolProperties(tmp);
    };

    const onTypeSelected = (val, index) => {
      const tmp = poolProperties;
      tmp[index].type = val.target.value;
      setPoolProperties(tmp);
    };

    return (
      poolProperties.map((p, index) => (
        <div className={classes.propertyRow}>
          <div className={classes.selectContainer}>
            <Select
              onClick={(val) => onTypeSelected(val, index)}
              className={classes.select}
              fullWidth
            >
              <MenuItem value="int">Int</MenuItem>
              <MenuItem value="string">String</MenuItem>
            </Select>
          </div>
          <div className={classes.textfieldContainer}>
            <TextField
              label="KEY"
              onChange={(val) => onPropKeyChanged(val, index)}
              className={classes.nameTextField}
              fullWidth
            />
          </div>
          <div className={classes.textfieldContainer}>
            <TextField
              label="VALUE"
              onChange={(val) => onPropValueChanged(val, index)}
              className={classes.nameTextField}
              fullWidth
            />
          </div>
          {(index === poolProperties.length - 1) ? (
            <IconButton
              color="primary"
              onClick={() => { setPoolProperties([...poolProperties, {}]); }}
              className={classes.addNewButton}
            >
              <AddIcon />
            </IconButton>
          ) : <div className={classes.addNewButton} />}

        </div>
      ))
    );
  };

  const POOL_SPECIFIC = {
    set: [renderDealocationPeriod()],
    allocating: [renderDealocationPeriod(), renderAllocationStrategy()],
    singleton: [],
  };

  return (
    <Container className={classes.container}>
      <div className={classes.wrapper}>
        <Typography component="div">
          <Box fontSize="h4.fontSize" fontWeight="fontWeightMedium">
            Create New Pool
          </Box>
        </Typography>
        <div className={classes.btnContainer}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttons}
            startIcon={<SaveIcon />}
            onClick={createNewPool}
            disabled={error}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.buttons}
            onClick={() => setShowCreatePool(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
      <Grow in mountOnEnter unmountOnExit>
        <div>
          <Paper elevation={2} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  id="standard-full-width"
                  label="Pool Name"
                  value={poolName}
                  onChange={(e) => setPoolName(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={3}>
                <Autocomplete
                  id="combo-box-demo"
                  options={POOL_TYPES}
                  value={poolType}
                  getOptionLabel={(option) => option}
                  onChange={(e, value) => setPoolType(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Pool Type"
                      required
                      placeholder="Select Pool Type"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Autocomplete
                  id="combo-box-demo"
                  options={selectors.QueryResourceTypes}
                  value={resourceType}
                  getOptionLabel={(option) => option.Name}
                  onChange={(e, value) => {
                    setResourceType(value);
                    setPoolValues([]);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Resource Type"
                      placeholder="Select Resource Type"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="standard-full-width"
                  label="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                />
              </Grid>
              {POOL_SPECIFIC[poolType]?.map((ps) => ps)}
            </Grid>
          </Paper>

          { poolType !== ALLOCATING ? (
            <Paper elevation={2} className={classes.paper}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <div style={{ marginBottom: '30px' }}>
                    <Typography component="div">
                      <Box fontSize="h5.fontSize" fontWeight="fontWeightMedium">
                        Resources
                      </Box>
                    </Typography>
                  </div>
                  {resourceType ? addResourceForm() : 'No resource type selected'}
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.resourceListButtons}>
                    {poolValues.length > 0 ? <Button variant="contained" size="small">Remove</Button> : null}
                  </div>
                  {poolValues.length > 0 ? resourceList() : null}
                </Grid>
              </Grid>
            </Paper>
          ) : null }

          {poolType === ALLOCATING ? (
            <Paper elevation={2} className={classes.paper}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <div style={{ marginBottom: '30px' }}>
                    <Typography component="div">
                      <Box fontSize="h5.fontSize" fontWeight="fontWeightMedium">
                        Pool Properties
                      </Box>
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  {poolPropertiesList()}
                </Grid>
              </Grid>
            </Paper>
          ) : null}

        </div>
      </Grow>
    </Container>
  );
};

export default withSnackbar(CreatePoolPage);
