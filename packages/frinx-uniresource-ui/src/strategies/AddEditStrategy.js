// @flow
import type { WithStyles } from '@material-ui/core';

import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
// eslint-disable-next-line no-unused-vars
import { Code } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { withSnackbar } from 'notistack';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import type {
  AddStrategyCreateData,
  // eslint-disable-next-line import/no-unresolved
} from '../../mutations/__generated__/AddStrategyMutation.graphql';
import AddStrategyMutation from '../mutations/AddStrategyMutation';
import CodeEditor from '../configure/CodeEditor';

const styles = () => ({
  root: {
    padding: '24px',
  },
  card: {
    padding: '24px',
    margin: '24px 0px',
  },
});

type Props = {
  showAddEditCardFunc: Function,
} & WithStyles<typeof styles>;

const AddEditStrategy = (props: Props) => {
  const { classes, showAddEditCardFunc, enqueueSnackbar } = props;
  const [name, setName] = useState('');
  const [script, setScript] = useState(
    'function invoke() {log(JSON.stringify({respool: resourcePool.ResourcePoolName, currentRes: currentResources}));return {vlan: userInput.desiredVlan};}',
  );
  const [error, setError] = useState(true);

  const onNameChanged = (val) => {
    setName(val.target.value);
  };

  const lang = 'js';

  // const input =

  const createStrategy = () => {
    const input: AddStrategyCreateData = {
      name,
      script,
      lang,
    };

    const variables: AddStrategyVariables = {
      input,
    };

    AddStrategyMutation(variables, (response, err) => {
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

  useEffect(() => {
    setError(name.length === 0);
  }, [name]);

  return (
    <div className={classes.root}>
      <div>
        <Typography>
          <Box fontSize="h4.fontSize" fontWeight="fontWeightMedium">
            Create New Strategy
          </Box>
        </Typography>
        <Button variant="contained" color="primary" onClick={createStrategy} disabled={error}>
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
      <Card className={classes.card}>
        <TextField error={error} label="NAME" onChange={onNameChanged} className={classes.nameTextField} autoFocus />
      </Card>
      <Card className={classes.card}>
        <CodeEditor setScript={setScript} />
      </Card>
    </div>
  );
};

export default withSnackbar(withStyles(styles)(AddEditStrategy));
