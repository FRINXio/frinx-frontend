// @flow
import type { WithStyles } from '@material-ui/core';

import * as React from 'react';
import Button from '@material-ui/core/Button';
// eslint-disable-next-line no-unused-vars
import classNames from 'classnames';
import { graphql } from 'graphql';
import { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AddEditStrategy from '../strategies/AddEditStrategy';
import ResourceManagerQueryRenderer from '../utils/relay/ResourceManagerQueryRenderer';
import StrategiesTable from '../strategies/StrategiesTable';
import StrategiesFilters from '../strategies/filters/StrategiesFilters';
import { filterByLang, filterByQuery } from '../strategies/filters/filterUtils';

const styles = () => ({
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
  addButton: {
    marginLeft: 'auto',
  },
  addButtonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

type Props = {} & WithStyles<typeof styles>;

const AllocationStrategies = (props: Props) => {
  const { classes } = props;

  const [updateDataVar, setUpdateDataVar] = useState(0);

  const [showEditCard, setShowEditCard] = useState(false);

  const [filteredArray, setFilteredArray] = useState([]);
  const [queryArray, setQueryArray] = useState([]);

  const [filterConstraints, setFilterConstraints] = useState({
    searchQuery: '',
    lang: '',
  });

  const updateFilterConstraint = (key, value) => {
    setFilterConstraints({
      ...filterConstraints,
      [key]: value,
    });
  };

  useEffect(() => {
    const { searchQuery, lang } = filterConstraints;
    let results = filterByQuery(searchQuery, queryArray);
    results = filterByLang(lang, results);
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

  const query = graphql`
    query AllocationStrategiesQuery {
      QueryAllocationStrategies {
        id
        Name
        Lang
        Script
        Description
      }
    }
  `;

  if (showEditCard) {
    return <AddEditStrategy showAddEditCardFunc={showEditCardFunc} />;
  }

  return (
    <div className={classes.mainDiv}>
      <ResourceManagerQueryRenderer
        query={query}
        variables={{ showEditCard, updateDataVar }}
        render={(queryProps) => {
          const { QueryAllocationStrategies } = queryProps;
          setQueryArray(QueryAllocationStrategies);
          return (
            <div>
              <div>
                <div className={classes.typesList}>
                  <div className={classes.addButtonContainer}>
                    <Typography component="div">
                      <Box fontSize="h4.fontSize" fontWeight="fontWeightMedium">
                        Allocation Strategies ({QueryAllocationStrategies.length})
                      </Box>
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setShowEditCard(true);
                      }}
                    >
                      Add Strategy
                    </Button>
                  </div>
                </div>
              </div>

              <StrategiesFilters
                setFilteredArray={setFilteredArray}
                resourceTypesArray={QueryAllocationStrategies}
                filterConstraints={filterConstraints}
                setFilterConstraints={setFilterConstraints}
                updateFilterConstraint={updateFilterConstraint}
              />

              <StrategiesTable strategiesData={filteredArray} updateDataVarFunc={updateDataVarFunc} />
            </div>
          );
        }}
      />
    </div>
  );
};

export default withStyles(styles)(AllocationStrategies);
