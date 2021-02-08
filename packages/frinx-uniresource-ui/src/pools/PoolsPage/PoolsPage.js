// @flow
import React, { useEffect, useState } from 'react';
import Grow from '@material-ui/core/Grow';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { withSnackbar } from 'notistack';
import Switch from '@material-ui/core/Switch';
import DeletePoolMutation from '../../mutations/DeletePoolMutation';
import {
  filterByPoolType,
  filterByQuery,
  filterByResourceType,
  filterByStrategy,
  filterByTags,
} from './Filters/filter.helpers';
import {
  fetchQuery,
  queryAllPools,
  queryFilterOptions,
  queryRootPools,
  tagPool,
  untagPool,
} from '../../queries/Queries';
import PoolTable from './Table/PoolTable';
import Filters from './Filters/Filters';
import { useStateValue } from '../../utils/StateProvider';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '20px',
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
}));

const pipe = (...functions) => (args) => functions.reduce((arg, fn) => fn(arg), args);

const PoolsPage = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = props;
  const [poolArray, setPoolArray] = useState([]);

  const [filterOptions, setFilterOptions] = useState({
    QueryAllocationStrategies: [],
    QueryResourceTypes: [],
    QueryTags: [],
  });
  const [filterConstraints, setFilterConstraints] = useState({
    searchQuery: '',
    allocStrat: null,
    resourceType: null,
    tags: [],
    poolType: null,
  });
  const [isInRootView, setIsInRootView] = useState(false);
  const [{ isAdmin }] = useStateValue();

  // eslint-disable-next-line react/prop-types
  const { setShowCreatePool } = props;

  const fetchData = () => {
    const query = isInRootView ? queryRootPools : queryAllPools;

    fetchQuery(query)
      .then((res) => {
        setPoolArray(isInRootView ? res.data.data.QueryRootResourcePools : res.data.data.QueryResourcePools);
      })
      .catch((error) => {
        console.log(error); // TODO error handling
      });

    fetchQuery(queryFilterOptions)
      .then((res) => {
        setFilterOptions(res.data.data);
      })
      .catch((error) => {
        console.log(error); // TODO error handling
      });
  };

  // TODO: QueryRenderer should fetch the data child components should contain Fragments
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [isInRootView]);

  // TODO filtering is performed locally on already fetched data, it should be probably handled by relay/graphql (?)
  const { searchQuery, tags, poolType, allocStrat, resourceType } = filterConstraints;
  const filteredPoolArray = pipe(
    filterByQuery(searchQuery),
    filterByTags(tags),
    filterByPoolType(poolType),
    filterByStrategy(allocStrat?.id),
    filterByResourceType(resourceType?.id),
  )(poolArray);

  const updateFilterConstraint = (key, value) => {
    setFilterConstraints({
      ...filterConstraints,
      [key]: value,
    });
  };

  const handleTagAdd = (tagId, poolId) => {
    fetchQuery(tagPool(tagId, poolId))
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.log(error); // TODO error handling
      });
  };

  const handleTagDelete = (tagId, poolId) => {
    fetchQuery(untagPool(tagId, poolId))
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.log(error); // TODO error handling
      });
  };

  const handlePoolDelete = (resourcePoolId) => {
    const variables = {
      input: {
        resourcePoolId,
      },
    };
    DeletePoolMutation(variables, (res, err) => {
      if (err) {
        console.log(err);
        enqueueSnackbar(err.message, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Pool deleted', {
          variant: 'warning',
        });
        fetchData();
      }
    });
  };

  const handleViewChange = async () => {
    // console.log(event.target.checked);
    await setIsInRootView((prev) => !prev);
    // fetchData();
  };

  return (
    <Container className={classes.container}>
      <div className={classes.wrapper}>
        <Typography component="div">
          <Box fontSize="h4.fontSize" fontWeight="fontWeightMedium">
            Available Pools
          </Box>
        </Typography>
        <div className={classes.btnContainer}>
          {isAdmin ? (
            <Button
              variant="contained"
              color="primary"
              className={classes.buttons}
              startIcon={<AddIcon />}
              onClick={() => setShowCreatePool(true)}
            >
              New
            </Button>
          ) : null}
        </div>
      </div>
      <Grow in mountOnEnter unmountOnExit>
        <div>
          <Filters
            {...filterOptions}
            poolArray={poolArray}
            filterConstraints={filterConstraints}
            updateFilterConstraint={updateFilterConstraint}
          />
          <Switch checked={isInRootView} onChange={handleViewChange} />
          Show only root pools
          <PoolTable
            allTags={filterOptions.QueryTags}
            pools={filteredPoolArray}
            onPoolDelete={handlePoolDelete}
            onTagDelete={handleTagDelete}
            onTagAdd={handleTagAdd}
          />
        </div>
      </Grow>
    </Container>
  );
};

export default withSnackbar(PoolsPage);
