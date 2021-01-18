// @flow
import type { WithStyles } from '@material-ui/core';

import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
// eslint-disable-next-line no-unused-vars
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { createFragmentContainer, graphql } from 'react-relay';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

import Box from '@material-ui/core/Box';
import { withSnackbar } from 'notistack';
import type {
  AddResourceTypeMutationVariables,
  AddResourceTypeCreateData,
  // eslint-disable-next-line import/no-unresolved
} from '../../mutations/__generated__/AddResourceTypeMutation.graphql';
import AddResourceTypeMutation from '../mutations/AddResourceTypeMutation';

const styles = () => ({
  root: {
    padding: '24px',
  },
  card: {
    padding: '24px',
    margin: '24px 0px',
  },
  nameTextField: {
    maxWidth: '120px',
  },
  propertyContainer: {
    display: 'grid',
    gridTemplateColumns: 'minmax(120px, 1fr)',
    gridTemplateRows: 'repeat(auto-fill, 80px)',
  },
  propertyRow: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  selectContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  select: {
    width: '100px',
    marginLeft: '32px',
  },
  addNewButton: {
    width: '50px',
  },
});

type Props = {
  showAddEditCardFunc: Function,
} & WithStyles<typeof styles>;

const AddEditResourceTypeCard = (props: Props) => {
  const { classes, showAddEditCardFunc, enqueueSnackbar } = props;

  const [name, setName] = useState('');
  const [properties, setProperties] = useState([{ type: '', value: '' }]);
  const [error, setError] = useState(true);

  const onNameChanged = (val) => {
    setName(val.target.value);
  };

  const addNewResourceType = () => {
    const tmp = {};
    properties.map((prop) => {
      tmp[prop.value] = prop.type;
      return prop;
    });

    const input: AddResourceTypeCreateData = {
      resourceName: name,
      resourceProperties: tmp,
    };

    const variables: AddResourceTypeMutationVariables = {
      input,
    };

    AddResourceTypeMutation(variables, (response, err) => {
      if (err) {
        console.log(err);
        enqueueSnackbar(err.message, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Resource Type Added', {
          variant: 'success',
        });
        showAddEditCardFunc(false);
      }
    });
  };

  const addProperty = () => {
    setProperties([...properties, { type: '', value: '' }]);
  };

  const onTypeSelected = (val, index) => {
    const tmp = properties;
    tmp[index].type = val.target.value;
    setProperties(tmp);
  };

  const onPropValueChanged = (val, index) => {
    const tmp = properties;
    tmp[index].value = val.target.value;
    setProperties(tmp);
  };
  useEffect(() => {
    setError(name.length === 0);
  }, [name]);

  return (
    <div className={classes.root}>
      <div>
        <Typography>
          <Box fontSize="h4.fontSize" fontWeight="fontWeightMedium">
            Create New Resource Type
          </Box>
        </Typography>
        <Button variant="contained" color="primary" onClick={addNewResourceType} disabled={error}>
          Save
        </Button>
        <Button
          onClick={() => {
            showAddEditCardFunc(false);
          }}
          color="secondary"
        >
          Cancel
        </Button>
      </div>

      <form>
        <Card className={classes.card}>
          <TextField error={error} label="NAME" onChange={onNameChanged} className={classes.nameTextField} autoFocus />
        </Card>
        <div>
          <Typography>Properties</Typography>
        </div>

        <Card className={classes.card}>
          <div className={classes.propertyContainer}>
            {properties.map((p, index) => (
              <div className={classes.propertyRow}>
                <div>
                  <TextField
                    label="NAME"
                    onChange={(val) => onPropValueChanged(val, index)}
                    className={classes.nameTextField}
                  />
                </div>
                <div className={classes.selectContainer}>
                  <Select onClick={(val) => onTypeSelected(val, index)} className={classes.select}>
                    <MenuItem value="int">Int</MenuItem>
                    <MenuItem value="string">String</MenuItem>
                  </Select>
                </div>
                {index === properties.length - 1 ? (
                  <IconButton
                    color="primary"
                    onClick={() => {
                      addProperty();
                    }}
                    className={classes.addNewButton}
                  >
                    <AddIcon />
                  </IconButton>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      </form>
    </div>
  );
};

export default withSnackbar(
  withStyles(styles)(
    createFragmentContainer(AddEditResourceTypeCard, {
      editingResourceType: graphql`
        fragment AddEditResourceTypeCard_editingResourceType on ResourceType {
          id
          Name
          PropertyTypes {
            id
            Name
            Type
            IntVal
            StringVal
            FloatVal
            Mandatory
          }
        }
      `,
    }),
  ),
);
