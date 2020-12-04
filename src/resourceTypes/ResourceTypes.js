/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type { ContextRouter } from 'react-router-dom';
import type { WithStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { graphql } from 'react-relay';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import AddEditResourceTypeCard from '../strategies/AddEditResourceTypeCard';
import ResourceManagerQueryRenderer from '../utils/relay/ResourceManagerQueryRenderer';
import ResourceTypesTable from './ResourceTypesTable';
import ResourceTypesFilters from './filters/ResourceTypesFilters';
import { filterByPool, filterByQuery } from './filters/filterUtils';

const styles = () => ({
  header: {
    margin: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  root: {
    width: '100%',
    marginTop: '15px',
  },
  paper: {
    flexGrow: 1,
    overflowY: 'hidden',
  },
  mainContainer: {
    margin: '24px',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  listItem: {
    marginBottom: '24px',
  },
  addButton: {
    marginLeft: 'auto',
  },
  addButtonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  typesList: {
    padding: '24px',
  },
  title: {
    marginLeft: '10px',
  },
  firstRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

type Props = ContextRouter & WithStyles<typeof styles> & {};

const query = graphql`
  query ResourceTypesQuery {
    QueryResourceTypes {
      id
      Name
      PropertyTypes {
        Name
        Type
      }
      Pools {
        id
        Name
      }
    }
  }
`;

const ResourceTypes = (props: Props) => {
  const [showEditCard, setShowEditCard] = useState(false);
  const [updateDataVar, setUpdateDataVar] = useState(0);
  const [filteredArray, setFilteredArray] = useState([]);
  const [queryArray, setQueryArray] = useState([]);

  const [filterConstraints, setFilterConstraints] = useState({
    searchQuery: '',
    pool: '',
  });

  const updateFilterConstraint = (key, value) => {
    console.log('key', key, value);
    setFilterConstraints({
      ...filterConstraints,
      [key]: value,
    });
  };

  useEffect(() => {
    const { searchQuery, pool } = filterConstraints;
    let results = filterByQuery(searchQuery, queryArray);
    results = filterByPool(pool, results);
    setFilteredArray(results);
  }, [filterConstraints]);

  useEffect(() => {
    setFilteredArray(queryArray);
  }, [queryArray]);

  const showEditCardFunc = (value) => {
    setShowEditCard(value);
  };
  const updateDataVarFunc = () => {
    setUpdateDataVar(updateDataVar + 1);
  };

  const { classes } = props;
  // const [resourceTypesData, setResourceTypesData] = useState([]);

  return (
    <ResourceManagerQueryRenderer
      query={query}
      variables={{ someVar: showEditCard, updateDataVar }}
      render={(queryProps) => {
        const { QueryResourceTypes } = queryProps;
        setQueryArray(QueryResourceTypes);

        if (showEditCard) {
          return (
            <div className={classes.paper}>
              <AddEditResourceTypeCard showAddEditCardFunc={showEditCardFunc} />
            </div>
          );
        }

        return (
          <div className={classes.mainContainer}>
            <div className={classes.addButtonContainer}>
              <Typography component="div">
                <Box fontSize="h4.fontSize" fontWeight="fontWeightMedium">
                  Resource Types ({QueryResourceTypes.length})
                </Box>
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setShowEditCard(true);
                }}
              >
                Add Resource Type
              </Button>
            </div>

            <div>
              <ResourceTypesFilters
                setFilteredArray={setFilteredArray}
                resourceTypesArray={QueryResourceTypes}
                filterConstraints={filterConstraints}
                setFilterConstraints={setFilterConstraints}
                updateFilterConstraint={updateFilterConstraint}
              />
            </div>

            <div>
              <ResourceTypesTable resourceTypesData={filteredArray} updateDataVarFunc={updateDataVarFunc} />
            </div>
          </div>
        );
      }}
    />
  );
};

export default withStyles(styles)(ResourceTypes);
