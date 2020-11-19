/**
 * @flow
 * @format
 */

import type { ContextRouter } from 'react-router-dom';
import type { WithStyles } from '@material-ui/core';
import { graphql } from 'react-relay';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import { withSnackbar } from 'notistack';
import React, { useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import { Button } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withRouter } from 'react-router';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Card from '@material-ui/core/Card';
import LaunchIcon from '@material-ui/icons/Launch';
import ResourceManagerQueryRenderer from '../../../utils/relay/ResourceManagerQueryRenderer';
import CreateNestedPoolMutation from '../../../mutations/createPools/CreateNestedPoolMutation';
import CodeEditor from '../../../configure/CodeEditor';
import ResourcesList from '../../resources/ResourcesList';

const styles = (theme) => ({
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

const query = graphql`query PoolDetailPageQuery($poolId: ID!) {
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
        NestedPool{
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
                                NestedPool{
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
                                                        NestedPool{
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
    
    QueryResourcePools {
        id
        Name
        allocatedResources {
            pageInfo {
                hasNextPage
                hasPreviousPage
                endCursor {
                    ID
                }
                startCursor {
                    ID
                }
            }
            totalCount
        }
    }
    
}
`;

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.common.white,
  },
}))(TableCell);

const PoolDetailPage = (props: Props) => {
  const { classes, match } = props;
  const { params } = match;
  console.log(props);
  const { id } = params;

  const [updateDataVar, setUpdateDataVar] = useState(0);
  const createNestedPool = () => {
    const input = {
      resourceTypeId: 25769803777,
      poolName: 'Nested8',
      description: 'asdfsadfasd',
      poolDealocationSafetyPeriod: 0,
      poolValues: [{ address: '120' }, { address: '121' }, { address: '110' }, { address: '130' }, { address: '140' }],
      parentResourceId: 17179869185,
    };
    CreateNestedPoolMutation({ input });
  };

  const RESOURCE_MANAGER_URL = '/resourcemanager/frontend';

  const getCapacityValue = (capacity) => {
    const { freeCapacity, utilizedCapacity } = capacity;
    return ((freeCapacity / (freeCapacity + utilizedCapacity)) * 100);
  };

  const TreeItemRender = (NestedPool, nodeId) => {
    const { Resources } = NestedPool;

    const handleIconClick = (event) => {
      event.preventDefault();
      window.location.replace(`${RESOURCE_MANAGER_URL}/pools/${NestedPool.id}`);
    };

    return (
      <>
        <TreeItem
          nodeId={nodeId}
          label={(
            <div className={classes.treeItemLabel}>
              {NestedPool.Name}
              <LaunchIcon
                color="primary"
                onClick={handleIconClick}
                className={classes.launchIcon}
              />
            </div>
        )}
        >
          {Resources.map((e, i) => (
            <>
              {(e.NestedPool) ? TreeItemRender(e.NestedPool, `${nodeId}-${i}`) : null}
            </>
          ))}
        </TreeItem>
      </>
    );
  };

  return (
    <div>
      <ResourceManagerQueryRenderer
        query={query}
        variables={{ updateDataVar, poolId: id }}
        render={(queryProps) => {
          const {
            QueryResources, QueryPoolCapacity, QueryResourcePoolHierarchyPath, QueryResourcePool
          } = queryProps;
          console.log(queryProps);

          return (
            <div>
              <Typography component="div">
                <Box fontSize="h3.fontSize" fontWeight="fontWeightMedium">
                  { QueryResourcePool.Name }
                </Box>
              </Typography>
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                {QueryResourcePoolHierarchyPath.map((e) => (
                  <Link color="primary" href={`${RESOURCE_MANAGER_URL}/pools/${e.id}`}>
                    {e.Name}
                  </Link>
                ))}
              </Breadcrumbs>

              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <Paper className={classes.paper}>
                    <Typography component="div">
                      <Box fontSize="h6.fontSize" fontWeight="fontWeightMedium">
                        Properties
                      </Box>
                    </Typography>
                    <div style={{ display: 'flex', marginBottom: '24px' }}>
                      <Chip color="primary" label="someTag" className={classes.chip} />
                      <Chip color="primary" label="Tag" className={classes.chip} />
                      <Chip color="primary" label="some" className={classes.chip} />
                    </div>
                    <div className={classes.poolInfoContainer}>
                      <div className={` ${classes.pool}`}>Pool Type: </div>
                      <div>{QueryResourcePool.PoolType}</div>
                      <div>Resource Type: </div>
                      <div>{QueryResourcePool.ResourceType.Name}</div>
                    </div>
                  </Paper>
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
                      {QueryResources.map((e, i) => (
                        <>
                          {(e.NestedPool) ? TreeItemRender(e.NestedPool, i) : null}
                        </>
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
                      value={getCapacityValue(QueryPoolCapacity)}
                      variant="determinate"
                      disableShrink
                      style={{ height: 10 }}
                    />
                    <div>
                      Free:
                      {QueryPoolCapacity.freeCapacity}
                    </div>
                    <div>
                      Utilized:
                      {QueryPoolCapacity.utilizedCapacity}
                    </div>
                  </Paper>

                </Grid>
                <Grid item xs={9}>

                  <Paper className={classes.paper}>
                    <Typography component="div">
                      <Box fontSize="h6.fontSize" fontWeight="fontWeightMedium">
                        Resources
                      </Box>
                    </Typography>
                    <ResourcesList />
                  </Paper>

                  <Paper className={classes.paper}>
                    <Typography component="div">
                      <Box fontSize="h6.fontSize" fontWeight="fontWeightMedium">
                        Strategy
                      </Box>
                    </Typography>
                    <Card className={classes.card}>
                      <CodeEditor setScript="" />
                    </Card>
                  </Paper>

                </Grid>
              </Grid>

            </div>
          );
        }}
      />
    </div>
  );
};

export default withRouter(withSnackbar(withStyles(styles)(
  PoolDetailPage,
)));
