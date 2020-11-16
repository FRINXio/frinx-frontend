import React, { useEffect, useState } from 'react';
import Grow from '@material-ui/core/Grow';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { withSnackbar } from 'notistack';
import DeletePoolMutation from '../../mutations/DeletePoolMutation';
import {
  filterByPoolType,
  filterByQuery,
  filterByResourceType,
  filterByStrategy,
  filterByTags,
} from './Filters/filterUtils';
import {
  fetchQuery,
  queryAllPools,
  queryFilterOptions,
  tagPool,
  untagPool,
} from '../../queries/Queries';
import PoolTable from './Table/PoolTable';
import Filters from './Filters/Filters';

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

const PoolsPage = (props) => {
  const classes = useStyles();
  // eslint-disable-next-line react/prop-types
  const { enqueueSnackbar } = props;
  const [poolArray, setPoolArray] = useState([]);
  const [filteredPoolArray, setFilteredPoolArray] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    QueryAllocationStrategies: [],
    QueryResourceTypes: [],
    QueryTags: [],
  });
  const [filterConstraints, setFilterConstraints] = useState({
    searchQuery: '',
    allocStrat: '',
    resourceType: '',
    tags: [],
    poolType: '',
  });

  // eslint-disable-next-line react/prop-types
  const { setShowCreatePool } = props;

  const fetchData = () => {
    fetchQuery(queryAllPools).then((res) => {
      setPoolArray(res.data.data.QueryResourcePools);
      setFilteredPoolArray(res.data.data.QueryResourcePools);
    }).catch((error) => {
      console.log(error); // TODO error handling
    });

    fetchQuery(queryFilterOptions).then((res) => {
      setFilterOptions(res.data.data);
    }).catch((error) => {
      console.log(error); // TODO error handling
    });
  };

  // TODO: QueryRenderer should fetch the data child components should contain Fragments
  useEffect(() => {
    fetchData();
  }, []);

  // eslint-disable-next-line max-len
  // TODO filtering is performed locally on already fetched data, it should be probably handled by relay/graphql (?)
  useEffect(() => {
    const {
      searchQuery, tags, poolType, allocStrat, resourceType,
    } = filterConstraints;
    let results = filterByQuery(searchQuery, poolArray);
    results = filterByTags(tags, results);
    results = filterByPoolType(poolType, results);
    results = filterByStrategy(allocStrat, results);
    results = filterByResourceType(resourceType, results);

    setFilteredPoolArray(results);
  }, [filterConstraints]);

  const updateFilterConstraint = (key, value) => {
    setFilterConstraints({
      ...filterConstraints,
      [key]: value,
    });
  };

  const assignTagToPool = (tag, poolId) => {
    console.log(tag, poolId);
    fetchQuery(tagPool(tag.id, poolId)).then(() => {
      fetchData();
    }).catch((error) => {
      console.log(error); // TODO error handling
    });
  };

  const unassignTagFromPool = (tag, poolId) => {
    fetchQuery(untagPool(tag.id, poolId)).then(() => {
      fetchData();
    }).catch((error) => {
      console.log(error); // TODO error handling
    });
  };

  const deletePool = (resourcePoolId) => {
    // fetchQuery(deleteResourcePool(poolId)).then(() => {
    //     fetchData()
    // }).catch(function (error) {
    //     console.log(error); //TODO error handling
    // });
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

  return (
    <Container className={classes.container}>
      <div className={classes.wrapper}>
        <Typography component="div">
          <Box fontSize="h4.fontSize" fontWeight="fontWeightMedium">
            Available Pools
          </Box>
        </Typography>
        <div className={classes.btnContainer}>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttons}
            startIcon={<AddIcon />}
            onClick={() => setShowCreatePool(true)}
          >
            New
          </Button>
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
          <PoolTable
            QueryTags={filterOptions.QueryTags}
            filteredPoolArray={filteredPoolArray}
            deletePool={deletePool}
            unassingTagFromPool={unassignTagFromPool}
            assignTagToPool={assignTagToPool}
          />
        </div>
      </Grow>
    </Container>
  );
};

export default withSnackbar(PoolsPage);
