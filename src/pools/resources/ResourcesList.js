/**
 * @flow
 * @format
 */

import type { ContextRouter } from 'react-router-dom';
import type { WithStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { graphql } from 'react-relay';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TableContainer from '@material-ui/core/TableContainer';
import { useParams } from 'react-router-dom';
// eslint-disable-next-line import/order
import { withSnackbar } from 'notistack';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import ClaimResourceMutation from '../../mutations/ClaimResourceMutation';
import ResourceManagerQueryRenderer from '../../utils/relay/ResourceManagerQueryRenderer';
import FreeResourceMutation from '../../mutations/FreeResourceMutation';

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
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  listItem: {
    marginBottom: '24px',
  },
  addButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
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
  addNewButton: {
    width: '50px',
  },
  propertyContainer: {
    display: 'grid',
    gridTemplateColumns: 'minmax(120px, 1fr)',
    gridTemplateRows: 'repeat(auto-fill, 80px)',
  },
  propertyRow: {
    display: 'flex',
    alignItems: 'flex-end',
    padding: '16px',
  },
  selectContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '12px',
  },
  select: {
    width: '100px',
    marginLeft: '32px',
  },
});

type Props = ContextRouter & WithStyles<typeof styles> & {};

const query = graphql`query ResourcesListQuery($poolId: ID!) {
    QueryResources(poolId: $poolId){
        id
        Description
        Properties
        NestedPool{
            id
            Name
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

const ResourceList = (props: Props) => {
  const { classes, setUpdateDataVarProp, updateDataVarProp, resources, enqueueSnackbar } = props;

  // eslint-disable-next-line no-unused-vars
  const [showEditCard, setShowEditCard] = useState(false);
  const [updateDataVar, setUpdateDataVar] = useState(0);

  const { id } = useParams();

  const claimResource = () => {
    const tmp = {};
    // eslint-disable-next-line no-use-before-define
    properties.map((prop) => {
      tmp[prop.value] = prop.type;
      return prop;
    });

    ClaimResourceMutation({
      poolId: id,
      userInput: tmp,
      description: description,
    }, (response, err) => {
      if (err) {
        console.log(err);
        enqueueSnackbar(err.message, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Resource claimed successfully', {
          variant: 'success',
        });
        setUpdateDataVar(updateDataVar + 1);
        setUpdateDataVarProp(updateDataVarProp + 1)
      }
    });
  };
  const freeResource = (row) => {
    console.log(row);
    FreeResourceMutation({
      poolId: id,
      input: row.Properties,
    }, (response, err) => {
      if (err) {
        console.log(err);
        enqueueSnackbar(err.message, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Resource freed successfully', {
          variant: 'success',
        });
        setUpdateDataVar(updateDataVar + 1);
        setUpdateDataVarProp(updateDataVarProp + 1)
      }
    });
  };
  const [properties, setProperties] = useState([{ type: '', value: '' }]);
  const [description, setDescription] = useState(null);

  const addProperty = () => {
    setProperties([...properties, { type: '', value: '' }]);
  };

  const onPropValueChanged = (val, index) => {
    const tmp = properties;
    tmp[index].type = val.target.value;
    setProperties(tmp);
  };
  const onDescriptionChanged = (val) => {
    setDescription(val.target.value);
  };
  const onPropKeyChanged = (val, index) => {
    const tmp = properties;
    tmp[index].value = val.target.value;
    setProperties(tmp);
  };

  return (
    <div>

      <div className={classes.selectContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => claimResource()}
        >
          Claim
        </Button>
      </div>

      <div>
        <div className={classes.selectContainer}>
          <TextField
            label="Resource description"
            onChange={(val) => onDescriptionChanged(val)}
            className={classes.nameTextField}
          />
        </div>
      </div>

      {properties.map((p, index) => (
        <div className={classes.propertyRow}>
          <div>
            <TextField
              label="KEY"
              onChange={(val) => onPropKeyChanged(val, index)}
              className={classes.nameTextField}
            />
          </div>
          <div className={classes.selectContainer}>
            <TextField
              label="VALUE"
              onChange={(val) => onPropValueChanged(val, index)}
              className={classes.nameTextField}
            />
          </div>
          {(index === properties.length - 1) ? (
            <IconButton
              color="primary"
              onClick={() => { addProperty(); }}
              className={classes.addNewButton}
            >
              <AddIcon />
            </IconButton>
          ) : null}

        </div>
      ))}
      <ResourceManagerQueryRenderer
        query={query}
        variables={{ someVar: showEditCard, updateDataVar, poolId: id }}
        render={(queryProps) => {
          const { QueryResources } = queryProps;

          return (
            <div>


              <TableContainer component={Paper} className={classes.container}>
                <Table ria-label="pool table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="left">Actions</StyledTableCell>
                      <StyledTableCell align="left">ID</StyledTableCell>
                      <StyledTableCell align="left">Description</StyledTableCell>
                      <StyledTableCell align="left">Properties</StyledTableCell>
                      <StyledTableCell align="left" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/*{QueryResources.map((row, i) => (*/}
                    {/*  // eslint-disable-next-line react/no-array-index-key*/}
                    {/*  <TableRow key={i}>*/}
                    {/*    <TableCell padding="checkbox" align="center">*/}
                    {/*      <IconButton*/}
                    {/*        aria-controls="actions-menu"*/}
                    {/*        aria-haspopup="true"*/}
                    {/*        onClick={() => {*/}
                    {/*        }}*/}
                    {/*      >*/}
                    {/*        <MoreVertIcon />*/}
                    {/*      </IconButton>*/}
                    {/*    </TableCell>*/}
                    {/*    <TableCell align="left">{row.id}</TableCell>*/}
                    {/*    <TableCell align="left">*/}
                    {/*      {Object.entries(row.Properties).map(([key, value]) => (*/}
                    {/*        <div>*/}
                    {/*          {' '}*/}
                    {/*          { `${key} : ${value}` }*/}
                    {/*        </div>*/}
                    {/*      ))}*/}
                    {/*    </TableCell>*/}
                    {/*    <TableCell align="left">*/}
                    {/*      <Button*/}
                    {/*        variant="contained"*/}
                    {/*        color="primary"*/}
                    {/*        onClick={() => freeResource(row)}*/}
                    {/*      >*/}
                    {/*        Free*/}
                    {/*      </Button>*/}
                    {/*    </TableCell>*/}
                    {/*  </TableRow>*/}
                    {/*))}*/}

                    {resources.map((row, i) => (

                      // eslint-disable-next-line react/no-array-index-key
                      <TableRow key={i}>
                        <TableCell padding="checkbox" align="center">
                          <IconButton
                            aria-controls="actions-menu"
                            aria-haspopup="true"
                            onClick={() => {
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell align="left">{row.node.id}</TableCell>
                        <TableCell align="left">{row.node.Description}</TableCell>
                        <TableCell align="left">
                          {Object.entries(row.node.Properties).map(([key, value]) => (
                            <div>
                              {' '}
                              { `${key} : ${value}` }
                            </div>
                          ))}
                        </TableCell>
                        <TableCell align="left">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => freeResource(row.node)}
                          >
                            Free
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </div>
          );
        }}
      />
    </div>

  );
};

export default withSnackbar(withStyles(styles)(
  ResourceList,
));
