/**
 * @flow
 * @format
 */

import type { ContextRouter } from 'react-router-dom';
import type { WithStyles } from '@material-ui/core';
import { graphql } from 'react-relay';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withRouter } from 'react-router';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import LaunchIcon from '@material-ui/icons/Launch';
import Pagination from '@material-ui/lab/Pagination';
import ResourceManagerQueryRenderer from '../../../utils/relay/ResourceManagerQueryRenderer';
import ResourcesList from '../../resources/ResourcesList';
import { fetchQuery, QueryAllocatedResources } from '../../../queries/Queries';

const styles = theme => ({
  container: {
    marginTop: '20px',
  },
  paper: {
    padding: '24px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  chip: {
    height: '25px',
    marginRight: '4px',
  },
  poolInfoContainer: {
    display: 'grid',
    gridTemplateColumns: '170px minmax(200px, 1fr)',
    gridTemplateRows: 'repeat(50px)',
  },
  launchIcon: {
    marginLeft: '2px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
  },
  treeItemLabel: {
    display: 'flex',
    alignItems: 'center',
  },
});

type Props = ContextRouter & WithStyles<typeof styles> & {};

const query = graphql`
  query PoolDetailPageQuery($poolId: ID!) {
    QueryResourcePool(poolId: $poolId) {
      Name
      PoolType
      ResourceType {
        id
        Name
      }
      AllocationStrategy {
        Script
        Description
        Lang
        id
      }
      Tags {
        id
        Tag
      }
    }
    QueryResources(poolId: $poolId) {
      id
      NestedPool {
        id
        Name
        Resources {
          id
          Properties
          NestedPool {
            id
            Name
            PoolType
            Resources {
              id
              Properties
              NestedPool {
                id
                Name
                PoolType
                Resources {
                  id
                  Properties
                  NestedPool {
                    id
                    Name
                    Resources {
                      id
                      Properties
                      NestedPool {
                        id
                        Name
                        PoolType
                        Resources {
                          id
                          Properties
                          NestedPool {
                            id
                            Name
                            PoolType
                            Resources {
                              id
                              Properties
                              NestedPool {
                                id
                                Name
                                Resources {
                                  id
                                  Properties
                                  NestedPool {
                                    id
                                    Name
                                    PoolType
                                    Resources {
                                      id
                                      Properties
                                      NestedPool {
                                        id
                                        Name
                                        PoolType
                                        Resources {
                                          id
                                          Properties
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    QueryPoolCapacity(poolId: $poolId) {
      freeCapacity
      utilizedCapacity
    }
    QueryResourcePoolHierarchyPath(poolId: $poolId) {
      id
      Name
    }
  }
`;

const PoolDetailPage = (props: Props) => {
  const { classes, onBreadcrumbLinkClick, id } = props;
  console.log(props);

  const [updateDataVar, setUpdateDataVar] = useState(0);
  const [first, setFirst] = useState(10);
  const [after, setAfter] = useState(null);
  const [before, setBefore] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalPages] = useState(0);
  const [resources, setResources] = useState([]);
  const [poolName, setPoolName] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [capacity, setCapacity] = useState([]);
  const [resourcePool, setResourcePool] = useState([]);
  const [queryResources, setQueryResources] = useState([]);

  const queryAllocatedResources = (startCursor, endCursor) => {
    console.log(after, before, after ? null : before);
    fetchQuery(QueryAllocatedResources(id, first, startCursor, endCursor)).then(v => {
      if (!v.data.data.QueryResourcePool.allocatedResources) {
        setResources([]);
        setTotalPages(0);
      }
      setTotalPages(v.data.data.QueryResourcePool.allocatedResources.totalCount);
      setResources(v.data.data.QueryResourcePool.allocatedResources.edges);
      setAfter(v.data.data.QueryResourcePool.allocatedResources?.pageInfo.endCursor);
      setBefore(v.data.data.QueryResourcePool.allocatedResources?.pageInfo.startCursor);
    });
  };

  useEffect(() => {
    queryAllocatedResources();
  }, []);
  useEffect(() => {
    queryAllocatedResources();
  }, [updateDataVar]);
  useEffect(() => {
    queryAllocatedResources(after, before);
  }, [page]);

  const getCapacityValue = cap => {
    const { freeCapacity, utilizedCapacity } = cap;
    return (utilizedCapacity / (freeCapacity + utilizedCapacity)) * 100;
  };

  const TreeItemRender = (NestedPool, nodeId) => {
    const { Resources } = NestedPool;

    const handleIconClick = event => {
      event.preventDefault();
      onBreadcrumbLinkClick(NestedPool.id);
    };

    return (
      <>
        <TreeItem
          nodeId={nodeId}
          label={
            // eslint-disable-next-line react/prop-types
            <div className={classes.treeItemLabel}>
              {NestedPool.Name}
              <LaunchIcon color="primary" onClick={handleIconClick} className={classes.launchIcon} />
            </div>
          }
        >
          {Resources.map((e, i) => (
            <>{e.NestedPool ? TreeItemRender(e.NestedPool, `${nodeId}-${i}`) : null}</>
          ))}
        </TreeItem>
      </>
    );
  };

  const handlePaginationChange = (event, value) => {
    console.log(event, value);
    page < value ? setBefore(null) : setAfter(null);

    setPage(value);
  };

  return (
    <div>
      <Typography component="div">
        <Box fontSize="h3.fontSize" fontWeight="fontWeightMedium">
          {poolName}
        </Box>
      </Typography>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs.map(e => (
          <Link
            color="primary"
            onClick={() => {
              onBreadcrumbLinkClick(e.id);
            }}
          >
            {e.Name}
          </Link>
        ))}
      </Breadcrumbs>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          {resourcePool ? (
            <Paper className={classes.paper}>
              <Typography component="div">
                <Box fontSize="h6.fontSize" fontWeight="fontWeightMedium">
                  Properties
                </Box>
              </Typography>
              {resourcePool.Tags ? (
                <div style={{ display: 'flex', marginBottom: '24px' }}>
                  {resourcePool.Tags.map(e => (
                    <Chip key={e.id} color="primary" label={e.Tag} className={classes.chip} />
                  ))}
                </div>
              ) : null}
              <div className={classes.poolInfoContainer}>
                <div className={` ${classes.pool}`}>Pool Type:</div>
                <div>{resourcePool.PoolType}</div>
                <div>Resource Type:</div>
                <div>{resourcePool.ResourceType?.Name}</div>
              </div>
            </Paper>
          ) : null}
          <Paper className={classes.paper}>
            <Typography component="div">
              <Box fontSize="h6.fontSize" fontWeight="fontWeightMedium">
                Pool hierarchy
              </Box>
            </Typography>
            <TreeView
              className={classes.root}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              {queryResources.map((e, i) => (
                <>{e.NestedPool ? TreeItemRender(e.NestedPool, i) : null}</>
              ))}
            </TreeView>
          </Paper>
          <Paper className={classes.paper}>
            <Typography component="div">
              <Box fontSize="h6.fontSize" fontWeight="fontWeightMedium">
                Capacity
              </Box>
            </Typography>
            <LinearProgress
              value={getCapacityValue(capacity)}
              variant="determinate"
              disableShrink
              style={{ height: 10 }}
            />
            <div>
              Free:
              {capacity.freeCapacity}
            </div>
            <div>
              Utilized:
              {capacity.utilizedCapacity}
            </div>
          </Paper>
        </Grid>
        <ResourceManagerQueryRenderer
          query={query}
          variables={{ updateDataVar, poolId: id, first }}
          render={queryProps => {
            const { QueryResources, QueryPoolCapacity, QueryResourcePoolHierarchyPath, QueryResourcePool } = queryProps;
            console.log(queryProps);
            setPoolName(QueryResourcePool.Name);
            setBreadcrumbs(QueryResourcePoolHierarchyPath);
            setResourcePool(QueryResourcePool);
            setCapacity(QueryPoolCapacity);
            setQueryResources(QueryResources);

            if (first === 0) setFirst(10);

            return (
              <>
                <Grid item xs={9}>
                  <Paper className={classes.paper}>
                    <Typography component="div">
                      <Box fontSize="h6.fontSize" fontWeight="fontWeightMedium">
                        Resources
                      </Box>
                    </Typography>
                    <ResourcesList
                      setUpdateDataVarProp={setUpdateDataVar}
                      updateDataVarProp={updateDataVar}
                      resources={resources}
                      match={match}
                    />
                    <Pagination
                      count={Math.ceil(totalCount / first)}
                      shape="rounded"
                      siblingCount={0}
                      onChange={handlePaginationChange}
                    />
                  </Paper>
                </Grid>
              </>
            );
          }}
        />
      </Grid>
    </div>
  );
};

export default withRouter(withSnackbar(withStyles(styles)(PoolDetailPage)));
